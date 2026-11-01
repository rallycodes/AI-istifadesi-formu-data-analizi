import unittest
from server import dashboard, export_rows


class DashboardTests(unittest.TestCase):
    def test_real_sample_and_valid_trust(self):
        result = dashboard()
        kpi = result['kpis']
        self.assertEqual((kpi['n_total'], kpi['n_ai']), (126, 108))
        self.assertAlmostEqual(kpi['avg_trust'], 385 / 108)
        self.assertEqual(kpi['top_tool_n'], 105)
        self.assertEqual(result['trustAnswers'], 108)

    def test_distribution_denominators_and_deduplication(self):
        result = dashboard()
        for field in ('tools', 'purposes', 'etibar', 'odenisli', 'gizledir'):
            for row in result['distributions'][field]:
                self.assertEqual(row['base'], 108)
                self.assertLessEqual(row['count'], 108)
                self.assertAlmostEqual(row['percent'], row['count'] / 108 * 100, places=3)
        for row in result['distributions']['hekim']:
            self.assertEqual(row['base'], 126)
        for field in ('yas', 'etibar', 'odenisli', 'hekim'):
            self.assertEqual(sum(r['count'] for r in result['distributions'][field]),
                             result['distributions'][field][0]['base'])

    def test_filters_update_all_bases(self):
        result = dashboard({'yas': ['18-24']})
        self.assertEqual(result['kpis']['n_total'], 94)
        for row in result['distributions']['tools']:
            self.assertEqual(row['base'], result['kpis']['n_ai'])
        for row in result['ageGroups']:
            self.assertEqual(row['label'], '18-24')
            self.assertEqual(row['base'], 94)

    def test_no_ai_and_empty_filters(self):
        no_ai = dashboard({'ai_istifade': ['Xeyr']})
        self.assertEqual((no_ai['kpis']['n_total'], no_ai['kpis']['n_ai']), (5, 0))
        self.assertEqual(no_ai['distributions']['tools'], [])
        empty = dashboard({'yas': ['nonexistent']})
        self.assertEqual(empty['kpis']['n_total'], 0)
        self.assertEqual(empty['kpis']['ai_pct'], 0)
        self.assertEqual(empty['fieldTrust'], [])

    def test_aggregate_only_api(self):
        result = dashboard()
        self.assertNotIn('records', result)
        self.assertNotIn('respondents', result)
        self.assertEqual(set(result['distributions']), {'tezlik', 'muddet', 'odenisli', 'etibar', 'gizledir', 'oz_isi', 'sexsi', 'ai_siz_gun', 'yas', 'cins', 'mesguliyyet', 'sahe', 'hekim', 'usaq', 'dost', 'aqilli', 'odeme_heveski', 'ai_istifade', 'tools', 'purposes'})

    def test_tool_co_usage_and_breadth(self):
        result = dashboard()
        analyses = result['analyses']
        co = analyses['coUsage']
        self.assertEqual(co['base'], 108)
        self.assertEqual(co['labels'][:3], ['ChatGPT', 'Gemini', 'Claude'])
        self.assertEqual(co['counts'][0][0], 105)
        self.assertEqual(co['counts'][1][1], 91)
        for i, row in enumerate(co['counts']):
            for j, count in enumerate(row):
                self.assertEqual(count, co['counts'][j][i])
                self.assertLessEqual(count, min(co['counts'][i][i], co['counts'][j][j]))
        self.assertEqual(sum(row['count'] for row in analyses['toolBreadth']), 108)
        self.assertEqual(analyses['summary']['daily'], 93)
        self.assertEqual(analyses['summary']['paid'], 22)
        self.assertEqual(analyses['summary']['highTrust'], 66)

    def test_group_comparisons_and_question_coverage(self):
        result = dashboard()
        groups = result['analyses']['occupationUsage']
        self.assertEqual(sum(group['base'] for group in groups), 126)
        for group in groups:
            self.assertEqual(sum(group['counts']), group['base'])
        self.assertEqual(sum(row['count'] for row in result['analyses']['trustByFrequency']), 108)
        self.assertEqual([row['label'] for row in result['distributions']['etibar']], ['1.0', '2.0', '3.0', '4.0', '5.0'])
        for meta in result['questionMeta'].values():
            self.assertEqual(meta['answered'] + meta['missing'], meta['base'])
        no_ai = dashboard({'ai_istifade': ['Xeyr']})
        self.assertEqual(no_ai['analyses']['toolBreadth'], [])
        self.assertEqual(no_ai['analyses']['trustByFrequency'], [])
        self.assertEqual(no_ai['analyses']['summary']['averageTools'], None)

    def test_new_export_has_derived_analyses_and_bases(self):
        rows = list(export_rows(dashboard()))
        self.assertIn(['Hansı alətlərdən istifadə edirsiniz?', 'ChatGPT', 105, 108, 97.22, ''], rows)
        self.assertTrue(any(row[0] == 'Birlikdə seçilən alətlər' for row in rows))
        self.assertTrue(any(row[0] == 'İstifadə tezliyi və etibar' and row[4] == '' and 1 <= row[5] <= 5 for row in rows))
        filtered = list(export_rows(dashboard({'yas': ['25-34']})))
        self.assertTrue(all(row[3] <= 6 for row in filtered))


if __name__ == '__main__':
    unittest.main()
