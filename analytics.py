"""Descriptive survey comparisons. Every denominator is the selected population."""
import pandas as pd

ORDERS = {
    'yas': ['18-dən kiçik', '18-24', '25-34', '35-44', '45+'],
    'yas_birləşmiş': ['18-dən kiçik', '18-24', '25-34', '35+'],
    'tezlik': ['Gündə bir neçə dəfə', 'Gündə bir dəfə', 'Həftədə bir neçə dəfə', 'Ayda bir neçə dəfə', 'Nadir hallarda'],
    'muddet': ['6 aydan az', '6-12 ay', '1-2 il', '3-4 il', '5 il və daha çox'],
    'etibar': ['1.0', '2.0', '3.0', '4.0', '5.0'],
    'odeme_heveski': ['0 AZN', '1-10 AZN', '11-30 AZN', '30 AZN-dən çox'],
    'ai_istifade': ['Bəli', 'Eşitmişəm, amma istifadə etməmişəm', 'Xeyr'],
}


def ordered(rows, field):
    order = ORDERS.get(field)
    return sorted(rows, key=lambda row: order.index(row['label']) if row['label'] in order else len(order)) if order else rows


def trust_groups(active, field):
    rows = []
    for label, group in active.groupby(field, dropna=False):
        valid = group.etibar.dropna()
        if len(valid):
            rows.append(dict(label=str(label) if pd.notna(label) else 'Cavab yoxdur', count=len(valid), base=len(group), score=round(float(valid.mean()), 4)))
    return ordered(rows, field)


def usage_groups(frame, field):
    rows = []
    for label, group in frame.groupby(field, dropna=False):
        counts = [int((group.ai_istifade == status).sum()) for status in ORDERS['ai_istifade']]
        rows.append(dict(label=str(label) if pd.notna(label) else 'Cavab yoxdur', base=len(group), counts=counts))
    return sorted(rows, key=lambda row: -row['base'])


def additional_analyses(frame, active, tools):
    total, ai = len(frame), len(active)
    selected = tools.groupby('respondent_id')['alet'].nunique().reindex(active.index, fill_value=0)
    breadth = [dict(label=f'{int(number)} alət', count=int(count), base=ai, percent=int(count) / ai * 100 if ai else 0)
               for number, count in selected.value_counts().sort_index().items()]
    top = tools.alet.value_counts().head(6).index.tolist()
    memberships = {name: set(tools.loc[tools.alet == name, 'respondent_id']) for name in top}
    co_use = dict(labels=top, base=ai, counts=[[len(memberships[left] & memberships[right]) for right in top] for left in top])
    social = []
    for field, title, positive in [('hekim', 'İnsan həkimə üstünlük verir', 'İnsan həkim'), ('usaq', 'Müəllimə üstünlük verir', 'Müəllim'), ('dost', 'AI-a dost kimi baxır', 'Dost kimi')]:
        rows = []
        for name, group in [('AI istifadə edənlər', active), ('Digər respondentlər', frame[frame.ai_istifade != 'Bəli'])]:
            base = len(group)
            count = int((group[field] == positive).sum())
            rows.append(dict(label=name, count=count, base=base, percent=count / base * 100 if base else 0))
        social.append(dict(field=field, title=title, rows=rows))
    age = frame.yas.value_counts()
    dominant_age = dict(label=str(age.index[0]), count=int(age.iloc[0]), base=total, percent=int(age.iloc[0]) / total * 100) if len(age) else None
    return dict(toolBreadth=breadth, coUsage=co_use, occupationUsage=usage_groups(frame, 'mesguliyyet'),
                trustByFrequency=trust_groups(active, 'tezlik'), trustByPlan=trust_groups(active, 'odenisli'),
                socialByUse=social, dominantAge=dominant_age,
                summary=dict(daily=int(active.tezlik.isin(['Gündə bir neçə dəfə', 'Gündə bir dəfə']).sum()),
                             paid=int((active.odenisli == 'Bəli').sum()), highTrust=int(active.etibar.isin([4, 5]).sum()),
                             multiTool=int((selected >= 2).sum()), averageTools=round(float(selected.mean()), 3) if ai else None))
