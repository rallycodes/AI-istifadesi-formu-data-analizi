"""Same-origin survey API and production React host. No respondent rows in the API."""
import csv
import io
import json
import os
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

import pandas as pd
import data_utils as data
from analytics import additional_analyses, ordered

ROOT = Path(__file__).resolve().parent
FILTERS = ('yas', 'mesguliyyet', 'sahe', 'ai_istifade')
AI_FIELDS = ('tezlik', 'muddet', 'odenisli', 'etibar', 'gizledir', 'oz_isi', 'sexsi', 'ai_siz_gun')
GENERAL_FIELDS = ('yas', 'cins', 'mesguliyyet', 'sahe', 'hekim', 'usaq', 'dost', 'aqilli', 'odeme_heveski', 'ai_istifade')


def distribution(series, base):
    counts = series.fillna('Cavab yoxdur').value_counts()
    return [dict(label=str(label), count=int(count), base=base,
                 percent=round(int(count) / base * 100, 4) if base else 0)
            for label, count in counts.items()]


def dashboard(params=None):
    params = params or {}
    if params.get('refresh') == ['1']:
        data.load_and_clean_data.clear()
    source = os.environ.get('CSV_URL') or str(ROOT / 'data.csv')
    original = data.load_and_clean_data(source)
    frame = original
    for field in FILTERS:
        value = params.get(field, [''])[0]
        if value:
            frame = frame[frame[field] == value]
    active = frame[frame.ai_istifade == 'Bəli'].copy()
    active['etibar'] = active.etibar.where(active.etibar.between(1, 5))
    total, ai = len(frame), len(active)
    tools = data.explode_tools(active)
    purposes = data.explode_purposes(active)
    dists = {field: distribution(active[field], ai) for field in AI_FIELDS}
    dists.update({field: distribution(frame[field], total) for field in GENERAL_FIELDS})
    dists['tools'] = distribution(tools['alet'], ai)
    dists['purposes'] = distribution(purposes['meqsed'], ai)
    dists = {field: ordered(rows, field) for field, rows in dists.items()}
    questions = {short: question.strip() for question, short in data.COLUMN_MAP_EXACT.items()}
    question_meta = {}
    for field in dists:
        source_field = {'tools': 'aletler', 'purposes': 'meqsedler'}.get(field, field)
        population = active if field in AI_FIELDS or field in ('tools', 'purposes') else frame
        answered = int(population[source_field].notna().sum())
        question_meta[field] = dict(question=questions.get(source_field, source_field), base=len(population),
                                    answered=answered, missing=len(population) - answered,
                                    activeOnly=population is active, multiple=field in ('tools', 'purposes'))
    groups = []
    for label, group in frame.groupby('yas_birləşmiş'):
        yes = int((group.ai_istifade == 'Bəli').sum())
        groups.append(dict(label=label, count=yes, base=len(group), percent=yes / len(group) * 100))
    trust = []
    for label, group in active.groupby('sahe'):
        valid = group.etibar.dropna()
        if len(valid):
            trust.append(dict(label=label, count=len(valid), base=len(group), score=round(float(valid.mean()), 3)))
    return dict(kpis=data.compute_kpis(frame, active), findings=data.compute_key_findings(frame, active),
                distributions=dists, ageGroups=ordered(groups, 'yas_birləşmiş'), fieldTrust=sorted(trust, key=lambda r: -r['score']),
                questionMeta=question_meta, analyses=additional_analyses(frame, active, tools),
                options={field: sorted(original[field].dropna().unique().tolist()) for field in FILTERS},
                lastUpdate=data.get_last_timestamp(original), source='Google Sheets' if str(source).startswith('http') else 'Lokal CSV',
                sourceTotal=len(original), trustAnswers=int(active.etibar.notna().sum()))


def export_rows(payload):
    """One aggregate per row, including the derived visuals; never respondent records."""
    for section, rows in payload['distributions'].items():
        title = payload['questionMeta'][section]['question']
        for row in rows:
            yield [title, row['label'], row['count'], row['base'], round(row['percent'], 2), '']
    analyses = payload['analyses']
    for row in analyses['toolBreadth']:
        yield ['Bir istifadəçinin seçdiyi alət sayı', row['label'], row['count'], row['base'], round(row['percent'], 2), '']
    co = analyses['coUsage']
    for i, left in enumerate(co['labels']):
        for j in range(i + 1, len(co['labels'])):
            count = co['counts'][i][j]
            yield ['Birlikdə seçilən alətlər', f"{left} + {co['labels'][j]}", count, co['base'], round(count / co['base'] * 100, 2) if co['base'] else 0, '']
    for group in analyses['occupationUsage']:
        for label, count in zip(('İstifadə edir', 'Eşidib, istifadə etməyib', 'İstifadə etmir'), group['counts']):
            yield [f"Məşğuliyyət: {group['label']}", label, count, group['base'], round(count / group['base'] * 100, 2), '']
    for title, rows in [('İstifadə tezliyi və etibar', analyses['trustByFrequency']), ('Ödənişli plan və etibar', analyses['trustByPlan']), ('Sahə və etibar', payload['fieldTrust'])]:
        for row in rows:
            yield [title, row['label'], row['count'], row['base'], '', row['score']]
    for row in payload['ageGroups']:
        yield ['Yaş qrupu üzrə AI istifadəsi', row['label'], row['count'], row['base'], round(row['percent'], 2), '']
    for item in analyses['socialByUse']:
        for row in item['rows']:
            yield [item['title'], row['label'], row['count'], row['base'], round(row['percent'], 2), '']


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT / 'dist'), **kwargs)

    def do_GET(self):
        route = urlparse(self.path)
        if route.path in ('/api/dashboard', '/api/export'):
            try:
                payload = dashboard(parse_qs(route.query))
                if route.path == '/api/export':
                    stream = io.StringIO()
                    writer = csv.writer(stream)
                    writer.writerow(['Bölmə', 'Cavab', 'Say', 'Baza', 'Faiz', 'Orta bal'])
                    for row in export_rows(payload):
                        writer.writerow(["'" + value if isinstance(value, str) and value.startswith(('=', '+', '-', '@', '\t', '\r')) else value for value in row])
                    body = ('\ufeff' + stream.getvalue()).encode('utf-8')
                    self.send_response(200)
                    self.send_header('Content-Type', 'text/csv; charset=utf-8')
                    self.send_header('Content-Disposition', 'attachment; filename="ai-survey-report.csv"')
                else:
                    body = json.dumps(payload, ensure_ascii=False, allow_nan=False).encode('utf-8')
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Cache-Control', 'no-store')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            except Exception:
                body = json.dumps({'error': 'Məlumat oxunmadı. Mənbəni yoxlayıb yenidən cəhd edin.'}, ensure_ascii=False).encode('utf-8')
                self.send_response(503)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(body)
        elif route.path.startswith('/api/'):
            self.send_error(404)
        else:
            super().do_GET()


def main():
    port = int(os.environ.get('PORT', '8000'))
    print(f'Survey dashboard: http://127.0.0.1:{port}', flush=True)
    ThreadingHTTPServer((os.environ.get('HOST', '127.0.0.1'), port), Handler).serve_forever()


if __name__ == '__main__':
    main()
