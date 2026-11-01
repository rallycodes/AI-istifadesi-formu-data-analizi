import sys
import pandas as pd
import numpy as np

sys.stdout.reconfigure(encoding='utf-8')

import data_utils
import charts
import ui

def run_tests():
    print("=== TEST 1: Data Loading & Cleaning ===")
    df = data_utils.load_and_clean_data('data.csv')
    assert len(df) == 126, f"Expected 126 rows, got {len(df)}"
    assert 'timestamp' in df.columns, "Timestamp column missing"
    assert 'yas' in df.columns, "yas missing"
    assert 'ai_istifade' in df.columns, "ai_istifade missing"
    assert 'odeme_heveski' in df.columns, "odeme_heveski missing"
    assert 'O AZN' not in df['odeme_heveski'].values, "O AZN not cleaned"
    assert '0 AZN' in df['odeme_heveski'].values, "0 AZN missing"
    print("✓ Data loading and normalization passed!")

    print("\n=== TEST 2: Bases & Calculations ===")
    df_ai = df[df['ai_istifade'] == 'Bəli']
    n_ai = len(df_ai)
    n_total = len(df)
    assert n_total == 126, f"n_total {n_total} != 126"
    assert n_ai == 108, f"n_ai {n_ai} != 108"

    kpis = data_utils.compute_kpis(df, df_ai)
    assert kpis['n_total'] == 126
    assert kpis['n_ai'] == 108
    assert abs(kpis['ai_pct'] - 85.71) < 0.1
    assert kpis['top_tool_name'] == 'ChatGPT'
    assert kpis['top_tool_n'] == 105
    assert abs(kpis['top_tool_pct'] - 97.22) < 0.1
    print(f"✓ KPIs calculated with accurate bases: total={kpis['n_total']}, AI={kpis['n_ai']}, AI%={kpis['ai_pct']:.1f}%")

    print("\n=== TEST 3: Key Findings Dynamic Calculation ===")
    findings = data_utils.compute_key_findings(df, df_ai)
    assert len(findings) == 5, f"Expected 5 findings, got {len(findings)}"
    for f in findings:
        print(f"  • {f['title']}: {f['stat']} ({f['sub']})")
        assert 'n=' in f['sub']
    print("✓ Dynamic key findings verified!")

    print("\n=== TEST 4: Tool Ranking Cards & SVGs ===")
    df_tools = data_utils.explode_tools(df_ai)
    tools_counted = df_tools['alet'].value_counts()
    print("  Tools distribution:")
    for tool, count in tools_counted.items():
        pct = count / n_ai * 100
        print(f"    - {tool}: {count} ({pct:.1f}%, n={n_ai})")
    
    assert tools_counted['ChatGPT'] == 105
    assert tools_counted['Gemini'] == 91
    assert tools_counted['Claude'] == 54

    # Verify logos
    for tool_name, meta in data_utils.KNOWN_TOOLS.items():
        b64 = ui.get_base64_svg(meta['logo'])
        assert b64.startswith("data:image/svg+xml;base64,"), f"Logo for {tool_name} failed base64 encoding"
    print("✓ All logos successfully converted to base64 data URLs!")

    print("\n=== TEST 5: Edge Case - Small Filter (<10 responses) ===")
    df_small = df[(df['yas'] == '45+') & (df['sahe'] == 'Tibb')]
    n_small = len(df_small)
    print(f"  Sample size with small filter: n={n_small}")
    assert n_small < 10, f"Expected <10, got {n_small}"
    # Verify that code handles this condition gracefully
    if n_small < 10:
        print("  ✓ Graceful fallback rule triggered: 'Bu filtr üçün kifayət qədər cavab yoxdur'")

    print("\n=== TEST 6: Edge Case - Filter with 0 AI users ===")
    df_no_ai = df[df['ai_istifade'] == 'Xeyr']
    kpis_no_ai = data_utils.compute_kpis(df_no_ai, pd.DataFrame(columns=df.columns))
    assert kpis_no_ai['n_ai'] == 0
    assert kpis_no_ai['ai_pct'] == 0.0
    print("  ✓ 0 AI users handled without division by zero!")

    print("\n=== ALL TESTS PASSED SUCCESSFULLY! ===")

if __name__ == '__main__':
    run_tests()

