import os
import zipfile
import io
import pandas as pd
import numpy as np
import streamlit as st

KNOWN_TOOLS = {
    'ChatGPT': {'company': 'OpenAI', 'color': '#10A37F', 'logo': 'chatgpt.svg'},
    'Gemini': {'company': 'Google', 'color': '#4285F4', 'logo': 'gemini.svg'},
    'Claude': {'company': 'Anthropic', 'color': '#D97757', 'logo': 'claude.svg'},
    'Copilot': {'company': 'Microsoft', 'color': '#0078D4', 'logo': 'copilot.svg'},
    'DeepSeek': {'company': 'DeepSeek', 'color': '#4D6BFE', 'logo': 'deepseek.svg'},
    'Grok': {'company': 'xAI', 'color': '#161A16', 'logo': 'grok.svg'},
    'Şəkil və video alətləri': {'company': 'Kreativ alətlər', 'color': '#8B5CF6', 'logo': 'creative.svg'},
    'Digər': {'company': 'Müxtəlif alətlər', 'color': '#6B7280', 'logo': 'other.svg'}
}

KNOWN_PURPOSES = [
    'Təhsil və imtahan hazırlığı',
    'Məlumat axtarışı və suallara cavab',
    'İş və peşəkar tapşırıqlar',
    'Şəkil və video yaradılması',
    'Tərcümə və dil öyrənmə',
    'Proqramlaşdırma və texniki dəstək',
    'Şəxsi məsləhət və münasibətlər',
    'Mətn və e-mail yazılması',
    'Alış-veriş və məhsul seçimi'
]

COLUMN_MAP_EXACT = {
    'Yaşınız?': 'yas',
    'Cinsiniz?': 'cins',
    'Məşğuliyyətiniz?': 'mesguliyyet',
    'Sahəniz (və ya oxuduğunuz ixtisas)?': 'sahe',
    'AI alətlərindən istifadə edirsiniz?': 'ai_istifade',
    'Nə vaxtdan istifadə edirsiniz?': 'muddet',
    'Hansı alətlərdən istifadə edirsiniz?': 'aletler',
    'Nə üçün istifadə edirsiniz?': 'meqsedler',
    'Nə qədər tez-tez istifadə edirsiniz?': 'tezlik',
    'Ödənişli versiya istifadə edirsiniz?': 'odenisli',
    'AI cavablarına nə qədər etibar edirsiniz?': 'etibar',
    'AI istifadə etdiyinizi dərsdə və ya işdə gizlədirsiniz?': 'gizledir',
    'AI-ın etdiyi işi “mənim işimdir” deyə təqdim etmisiniz?': 'oz_isi',
    'AI-a şəxsi məsələlərinizi (münasibət, psixoloji, karyera) danışmısınız?': 'sexsi',
    'AI olmadan bir gün keçirə bilərdiniz?': 'ai_siz_gun',
    'Sizcə AI istifadə edən insan, istifadə etməyəndən...': 'aqilli',
    'AI üçün aylıq nə qədər ödəməyə hazırsınız?': 'odeme_heveski',
    'Xəstəlik  diaqnozunda kimə daha çox inanardınız?': 'hekim',
    'Uşağınıza kim öyrətsin?': 'usaq',
    'AI-a necə baxırsınız?': 'dost',
    'Zaman möhürü': 'timestamp'
}


@st.cache_data(ttl=60)
def load_and_clean_data(csv_path_or_url: str = 'data.csv') -> pd.DataFrame:
    """
    Loads dataset from st.secrets['CSV_URL'] if configured,
    or local file (supporting both zip archives and plain CSVs).
    Cleans and standardizes columns and values.
    """
    url_secret = None
    try:
        if hasattr(st, 'secrets') and 'CSV_URL' in st.secrets and st.secrets['CSV_URL']:
            url_secret = st.secrets['CSV_URL']
    except Exception:
        url_secret = None

    source_path = url_secret if url_secret else csv_path_or_url
    df_raw = None

    # Load from URL or local file
    if isinstance(source_path, str) and (source_path.startswith('http://') or source_path.startswith('https://')):
        df_raw = pd.read_csv(source_path)
    else:
        # Check if zip
        if os.path.exists(source_path) and zipfile.is_zipfile(source_path):
            with zipfile.ZipFile(source_path, 'r') as z:
                first_file = z.namelist()[0]
                with z.open(first_file) as f:
                    df_raw = pd.read_csv(f)
        else:
            for enc in ['utf-8', 'utf-8-sig', 'windows-1254', 'latin1']:
                try:
                    df_raw = pd.read_csv(source_path, encoding=enc)
                    break
                except Exception:
                    continue

    if df_raw is None:
        raise ValueError(f"Məlumat faylı oxuna bilmədi: {source_path}")

    # Map columns based on stripped text matching
    renamed_cols = {}
    for col in df_raw.columns:
        c_clean = col.strip()
        matched = False
        for expected_q, short_name in COLUMN_MAP_EXACT.items():
            if expected_q.lower() in c_clean.lower() or c_clean.lower() in expected_q.lower():
                renamed_cols[col] = short_name
                matched = True
                break
        if not matched:
            renamed_cols[col] = c_clean

    df = df_raw.rename(columns=renamed_cols).copy()

    # Drop email if present
    for extra in ['email', 'e-mail', 'e-poçt']:
        if extra in df.columns:
            df = df.drop(columns=[extra])

    # Strip whitespace for all object columns
    for col in df.select_dtypes(include=['object']).columns:
        df[col] = df[col].astype(str).str.strip()
        df[col] = df[col].replace({'nan': np.nan, 'None': np.nan, '': np.nan})

    # Standardize 'odeme_heveski': 'O AZN' (letter O) -> '0 AZN'
    if 'odeme_heveski' in df.columns:
        df['odeme_heveski'] = df['odeme_heveski'].replace({
            'O AZN': '0 AZN',
            '0 azn': '0 AZN',
            'O azn': '0 AZN'
        })

    # Standardize 'etibar' to numeric float
    if 'etibar' in df.columns:
        df['etibar'] = pd.to_numeric(df['etibar'], errors='coerce')

    # Normalize AI istifade
    if 'ai_istifade' in df.columns:
        df['ai_istifade'] = df['ai_istifade'].replace({
            'Bəli': 'Bəli',
            'Xeyr': 'Xeyr',
            'Eşitmişəm, amma istifadə etməmişəm': 'Eşitmişəm, amma istifadə etməmişəm'
        })

    # Create merged age group for small sample sizes (<15)
    # 18-dən kiçik (12), 25-34 (6), 35-44 (7), 45+ (7) -> merge 35-44 & 45+ into '35+' or create 'yas_grouped'
    if 'yas' in df.columns:
        def group_age(y):
            if pd.isna(y):
                return 'Məlum deyil'
            if y in ['35-44', '45+']:
                return '35+'
            return y
        df['yas_birləşmiş'] = df['yas'].apply(group_age)

    return df


def get_last_timestamp(df: pd.DataFrame) -> str:
    """Returns formatted string of the last timestamp in dataset."""
    if 'timestamp' not in df.columns or df['timestamp'].dropna().empty:
        return "Bilinmir"
    try:
        ts_series = pd.to_datetime(df['timestamp'], format='mixed', errors='coerce')
        valid_ts = ts_series.dropna()
        if not valid_ts.empty:
            return valid_ts.max().strftime('%d.%m.%Y %H:%M')
    except Exception:
        pass
    # Return last raw string
    return str(df['timestamp'].dropna().iloc[-1])


def explode_tools(df_ai_users: pd.DataFrame) -> pd.DataFrame:
    """
    Splits semicolon-separated aletler into standardized tools
    and groups all other entries under 'Digər'.
    """
    if 'aletler' not in df_ai_users.columns or df_ai_users.empty:
        return pd.DataFrame(columns=['alet', 'respondent_id'])

    records = []
    for idx, row in df_ai_users.iterrows():
        raw_val = row.get('aletler')
        if pd.isna(raw_val) or not str(raw_val).strip():
            continue
        parts = [p.strip() for p in str(raw_val).split(';') if p.strip()]
        for part in parts:
            tool_name = 'Digər'
            p_lower = part.lower()
            if 'chatgpt' in p_lower:
                tool_name = 'ChatGPT'
            elif 'gemini' in p_lower:
                tool_name = 'Gemini'
            elif 'claude' in p_lower:
                tool_name = 'Claude'
            elif 'copilot' in p_lower:
                tool_name = 'Copilot'
            elif 'deepseek' in p_lower:
                tool_name = 'DeepSeek'
            elif 'grok' in p_lower or 'grook' in p_lower:
                tool_name = 'Grok'
            elif 'dizayn' in p_lower or 'kreativ' in p_lower or 'şəkil' in p_lower:
                tool_name = 'Şəkil və video alətləri'
            else:
                tool_name = 'Digər'

            records.append({'alet': tool_name, 'respondent_id': idx})

    df_tools = pd.DataFrame(records)
    if df_tools.empty:
        return pd.DataFrame(columns=['alet', 'respondent_id'])
    # Avoid duplicate tool selection per respondent
    return df_tools.drop_duplicates(subset=['alet', 'respondent_id'])


def explode_purposes(df_ai_users: pd.DataFrame) -> pd.DataFrame:
    """
    Splits semicolon-separated meqsedler into standardized purposes.
    """
    if 'meqsedler' not in df_ai_users.columns or df_ai_users.empty:
        return pd.DataFrame(columns=['meqsed', 'respondent_id'])

    records = []
    for idx, row in df_ai_users.iterrows():
        raw_val = row.get('meqsedler')
        if pd.isna(raw_val) or not str(raw_val).strip():
            continue
        parts = [p.strip() for p in str(raw_val).split(';') if p.strip()]
        for part in parts:
            matched = False
            for kp in KNOWN_PURPOSES:
                if kp.lower() == part.lower():
                    records.append({'meqsed': kp, 'respondent_id': idx})
                    matched = True
                    break
            if not matched:
                records.append({'meqsed': 'Digər', 'respondent_id': idx})

    df_purposes = pd.DataFrame(records)
    if df_purposes.empty:
        return pd.DataFrame(columns=['meqsed', 'respondent_id'])
    return df_purposes.drop_duplicates(subset=['meqsed', 'respondent_id'])


def compute_kpis(df_total: pd.DataFrame, df_ai_users: pd.DataFrame) -> dict:
    """
    Computes key summary performance indicators.
    """
    n_total = len(df_total)
    n_ai = len(df_ai_users)
    ai_pct = (n_ai / n_total * 100) if n_total > 0 else 0

    # Top tool
    df_tools = explode_tools(df_ai_users)
    if not df_tools.empty:
        top_tool_counts = df_tools['alet'].value_counts()
        top_tool_name = top_tool_counts.index[0]
        top_tool_n = int(top_tool_counts.iloc[0])
        top_tool_pct = (top_tool_n / n_ai * 100) if n_ai > 0 else 0
    else:
        top_tool_name = "Məlumat yoxdur"
        top_tool_n = 0
        top_tool_pct = 0

    # Average trust
    if 'etibar' in df_ai_users.columns and not df_ai_users['etibar'].dropna().empty:
        avg_trust = float(df_ai_users['etibar'].dropna().mean())
    else:
        avg_trust = 0.0

    # Top purpose
    df_purp = explode_purposes(df_ai_users)
    if not df_purp.empty:
        top_purp_counts = df_purp['meqsed'].value_counts()
        top_purp_name = top_purp_counts.index[0]
        top_purp_n = int(top_purp_counts.iloc[0])
        top_purp_pct = (top_purp_n / n_ai * 100) if n_ai > 0 else 0
    else:
        top_purp_name = "Məlumat yoxdur"
        top_purp_n = 0
        top_purp_pct = 0

    return {
        'n_total': n_total,
        'n_ai': n_ai,
        'ai_pct': ai_pct,
        'top_tool_name': top_tool_name,
        'top_tool_n': top_tool_n,
        'top_tool_pct': top_tool_pct,
        'avg_trust': avg_trust,
        'top_purp_name': top_purp_name,
        'top_purp_n': top_purp_n,
        'top_purp_pct': top_purp_pct
    }


def compute_key_findings(df_total: pd.DataFrame, df_ai_users: pd.DataFrame) -> list:
    """
    Dynamically computes 4-5 key discovery insights with exact numbers and n counts.
    """
    findings = []
    n_total = len(df_total)
    n_ai = len(df_ai_users)

    # 1. AI istifadəsini gizlədənlər (baza: AI istifadəçiləri)
    if 'gizledir' in df_ai_users.columns and n_ai > 0:
        hiding_count = (df_ai_users['gizledir'] == 'Bəzən').sum()
        hiding_pct = (hiding_count / n_ai * 100)
        findings.append({
            'title': 'İşdə və ya dərsdə gizlətmə',
            'stat': f"{hiding_pct:.1f}%",
            'sub': f"n={hiding_count}/{n_ai}",
            'desc': f"AI istifadəçilərinin {hiding_pct:.1f}%-i (n={hiding_count}) işdə və ya təhsildə AI-dan yararlandığını bəzən gizlədir."
        })

    # 2. "Mənim işimdir" deyənlər (baza: AI istifadəçiləri)
    if 'oz_isi' in df_ai_users.columns and n_ai > 0:
        own_work_count = df_ai_users['oz_isi'].isin(['Bəli, bir-iki dəfə', 'Bəli, dəfələrlə']).sum()
        own_work_pct = (own_work_count / n_ai * 100)
        findings.append({
            'title': 'AI işini "özününkü" təqdim etmə',
            'stat': f"{own_work_pct:.1f}%",
            'sub': f"n={own_work_count}/{n_ai}",
            'desc': f"AI istifadə edənlərin {own_work_pct:.1f}%-i (n={own_work_count}) süni intellektin hazırladığı nəticəni öz işi kimi təqdim edib."
        })

    # 3. Şəxsi məsələlərini AI ilə bölüşənlər (baza: AI istifadəçiləri)
    if 'sexsi' in df_ai_users.columns and n_ai > 0:
        personal_count = df_ai_users['sexsi'].isin(['Tez-tez', 'Bir neçə dəfə']).sum()
        personal_pct = (personal_count / n_ai * 100)
        findings.append({
            'title': 'Şəxsi mövzularda AI-a güvən',
            'stat': f"{personal_pct:.1f}%",
            'sub': f"n={personal_count}/{n_ai}",
            'desc': f"AI istifadəçilərinin {personal_pct:.1f}%-i (n={personal_count}) psixoloji, karyera və ya münasibət mövzularını AI ilə məsləhətləşir."
        })

    # 4. 0 AZN ödəmək istəyənlər (baza: Bütün respondentlər)
    if 'odeme_heveski' in df_total.columns and n_total > 0:
        zero_pay_count = (df_total['odeme_heveski'] == '0 AZN').sum()
        zero_pay_pct = (zero_pay_count / n_total * 100)
        findings.append({
            'title': 'Ödəniş etməyə meylsizlik',
            'stat': f"{zero_pay_pct:.1f}%",
            'sub': f"n={zero_pay_count}/{n_total}",
            'desc': f"Sorğuda iştirak edənlərin {zero_pay_pct:.1f}%-i (n={zero_pay_count}) AI üçün aylıq büdcə ayırmaq istəmir (0 AZN)."
        })

    # 5. AI-sız bir gün (baza: AI istifadəçiləri)
    if 'ai_siz_gun' in df_ai_users.columns and n_ai > 0:
        hard_count = df_ai_users['ai_siz_gun'].isin(['Çətinliklə', 'Yox']).sum()
        hard_pct = (hard_count / n_ai * 100)
        findings.append({
            'title': 'AI-dan asılılıq dərəcəsi',
            'stat': f"{hard_pct:.1f}%",
            'sub': f"n={hard_count}/{n_ai}",
            'desc': f"İstifadəçilərin {hard_pct:.1f}%-i (n={hard_count}) AI olmadan bir günü çətinliklə keçirə biləcəyini və ya keçirə bilməyəcəyini bildirir."
        })

    return findings

