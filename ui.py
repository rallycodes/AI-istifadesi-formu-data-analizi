import os
import base64
import textwrap
import streamlit as st
import icons

def render_clean_html(html_str: str):
    """Safely renders HTML without markdown converting indented lines into code blocks."""
    clean_lines = [line.strip() for line in html_str.splitlines() if line.strip()]
    st.markdown(" ".join(clean_lines), unsafe_allow_html=True)



def get_base64_svg(filename: str) -> str:
    """Reads an SVG file from assets/logos and returns data URL string."""
    filepath = os.path.join('assets', 'logos', filename)
    if os.path.exists(filepath):
        try:
            with open(filepath, 'rb') as f:
                encoded = base64.b64encode(f.read()).decode('utf-8')
                return f"data:image/svg+xml;base64,{encoded}"
        except Exception:
            return ""
    return ""


def inject_production_ui_css():
    """Injects high-end, production-grade Apple Liquid Glass & modern CSS."""
    css = """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&display=swap');

    :root {
        --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Manrope', sans-serif;
        --color-bg-base: #F4F5F0;
        --color-text-main: #121411;
        --color-text-secondary: #526052;
        --color-text-subtle: #7E8C7E;
        
        /* Apple Liquid Glass Tokens (Matching Reference) */
        --glass-surface: rgba(255, 255, 255, 0.92);
        --glass-surface-hover: #FFFFFF;
        --glass-surface-subtle: rgba(255, 255, 255, 0.65);
        --glass-border: rgba(226, 232, 222, 0.85);
        --glass-border-highlight: rgba(255, 255, 255, 0.98);
        --glass-blur: blur(28px) saturate(185%);
        --glass-shadow: 0 4px 20px -2px rgba(18, 24, 15, 0.03), 0 1px 3px rgba(18, 24, 15, 0.02);
        --glass-shadow-hover: 0 16px 36px -4px rgba(18, 24, 15, 0.07), 0 2px 6px rgba(18, 24, 15, 0.03);
        
        /* Signature Reference Accents */
        --color-accent-lime: #C8F135;
        --color-accent-lime-tint: rgba(200, 241, 53, 0.22);
        --color-accent-dark: #121411;
        --color-accent-sage: #556247;
        --color-accent-stone: #E2E7DB;
        --color-accent-stone-light: #EEF2EA;
        
        --radius-sm: 8px;
        --radius-md: 14px;
        --radius-lg: 24px;
        --radius-pill: 9999px;
    }

    /* Ambient Canvas */
    html, body, .stApp {
        font-family: var(--font-sans) !important;
        color: var(--color-text-main) !important;
        background-color: var(--color-bg-base) !important;
        background-image: 
            radial-gradient(circle at 50% -10%, rgba(200, 241, 53, 0.14) 0%, transparent 600px),
            radial-gradient(circle at 85% 15%, rgba(18, 20, 17, 0.03) 0%, transparent 400px),
            radial-gradient(circle at 10% 70%, rgba(200, 241, 53, 0.08) 0%, transparent 500px) !important;
        background-attachment: fixed !important;
    }

    /* Completely hide Streamlit default chrome & sidebar */
    #MainMenu, footer, header, .stDeployButton, [data-testid="stSidebar"], [data-testid="stSidebarCollapsedControl"] {
        display: none !important;
        visibility: hidden !important;
    }

    /* Center Container with Keynote Max Width */
    .block-container {
        padding-top: 1.5rem !important;
        padding-bottom: 5rem !important;
        padding-left: 2rem !important;
        padding-right: 2rem !important;
        max-width: 1240px !important;
        margin: 0 auto !important;
    }

    /* Streamlit Container Border Wrapper as Glass Card */
    [data-testid="stVerticalBlockBorderWrapper"] {
        background: var(--glass-surface) !important;
        backdrop-filter: var(--glass-blur) !important;
        -webkit-backdrop-filter: var(--glass-blur) !important;
        border: 1px solid var(--glass-border) !important;
        border-top: 1.5px solid var(--glass-border-highlight) !important;
        border-radius: var(--radius-lg) !important;
        padding: 24px 28px !important;
        box-shadow: var(--glass-shadow) !important;
        margin-bottom: 24px !important;
        transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 240ms cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    [data-testid="stVerticalBlockBorderWrapper"]:hover {
        transform: translateY(-2px) !important;
        box-shadow: var(--glass-shadow-hover) !important;
    }

    /* Top Breadcrumb & Navbar */
    .top-nav-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 20px;
    }

    .nav-breadcrumbs {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 600;
        color: var(--color-text-secondary);
    }

    .breadcrumb-item-muted {
        color: var(--color-text-subtle);
    }

    .breadcrumb-separator {
        color: var(--color-text-subtle);
        opacity: 0.6;
    }

    .nav-actions-group {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .nav-pill-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-pill);
        padding: 6px 14px;
        font-size: 12px;
        font-weight: 700;
        color: var(--color-text-main);
        box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }

    .pulse-dot-green {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #10B981;
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
        animation: pulseRing 2s infinite cubic-bezier(0.66, 0, 0, 1);
    }

    @keyframes pulseRing {
        0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
        70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
        100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    /* Executive Hero Header */
    .executive-header-wrap {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 28px;
    }

    .executive-title {
        font-size: 34px;
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.15;
        color: var(--color-text-main);
        margin: 0 0 8px 0;
    }

    .executive-subtitle {
        font-size: 15px;
        font-weight: 500;
        color: var(--color-text-secondary);
        margin: 0;
        line-height: 1.5;
    }

    /* Section Headers */
    .section-header-block {
        margin-top: 16px;
        margin-bottom: 16px;
    }

    .section-headline {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: var(--color-text-main);
        margin: 0 0 4px 0;
    }

    .section-subtext {
        font-size: 13px;
        font-weight: 500;
        color: var(--color-text-secondary);
        margin: 0;
        line-height: 1.5;
    }

    /* Executive KPI Grid */
    .kpi-glass-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 24px;
    }

    @media (max-width: 992px) {
        .kpi-glass-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 576px) {
        .kpi-glass-grid {
            grid-template-columns: 1fr;
        }
    }

    .kpi-card {
        background: var(--glass-surface);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        border: 1px solid var(--glass-border);
        border-top: 1.5px solid var(--glass-border-highlight);
        border-radius: var(--radius-lg);
        padding: 22px 24px;
        box-shadow: var(--glass-shadow);
        transition: transform 220ms ease, box-shadow 220ms ease;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 140px;
    }

    .kpi-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--glass-shadow-hover);
        background: var(--glass-surface-hover);
    }

    .kpi-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }

    .kpi-label {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--color-text-subtle);
    }

    .kpi-tag {
        font-size: 11px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: var(--radius-pill);
        background: var(--color-accent-lime-tint);
        color: #2D3A0A;
        border: 1px solid rgba(200, 241, 53, 0.4);
    }

    .kpi-value-row {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 6px;
    }

    .kpi-value {
        font-size: 32px;
        font-weight: 800;
        letter-spacing: -0.03em;
        color: var(--color-text-main);
        line-height: 1;
    }

    .kpi-delta {
        font-size: 12px;
        font-weight: 700;
        color: #10B981;
    }

    .kpi-subtext {
        font-size: 12px;
        font-weight: 500;
        color: var(--color-text-secondary);
        margin: 0;
        line-height: 1.4;
    }

    /* Key Findings Grid */
    .findings-glass-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 14px;
        margin-bottom: 24px;
    }

    @media (max-width: 1100px) {
        .findings-glass-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 768px) {
        .findings-glass-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 480px) {
        .findings-glass-grid {
            grid-template-columns: 1fr;
        }
    }

    .finding-card {
        background: var(--glass-surface);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        border: 1px solid var(--glass-border);
        border-top: 1.5px solid var(--glass-border-highlight);
        border-radius: var(--radius-md);
        padding: 18px 20px;
        box-shadow: var(--glass-shadow);
        transition: transform 220ms ease, box-shadow 220ms ease;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .finding-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--glass-shadow-hover);
        background: var(--glass-surface-hover);
    }

    .finding-icon-wrap {
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: rgba(18, 20, 17, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        color: var(--color-accent-dark);
    }

    .finding-stat {
        font-size: 26px;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: var(--color-text-main);
        line-height: 1;
        margin-bottom: 4px;
    }

    .finding-title {
        font-size: 13px;
        font-weight: 700;
        color: var(--color-text-main);
        margin: 0 0 6px 0;
    }

    .finding-desc {
        font-size: 12px;
        font-weight: 500;
        color: var(--color-text-secondary);
        margin: 0;
        line-height: 1.45;
    }

    .finding-sample {
        display: inline-block;
        font-size: 10px;
        font-weight: 700;
        color: var(--color-text-subtle);
        margin-top: 8px;
        background: rgba(18, 20, 17, 0.04);
        padding: 2px 7px;
        border-radius: var(--radius-pill);
    }

    /* Tools Liquid Rankings */
    .tools-ranking-wrap {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .tool-row-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 20px;
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid var(--glass-border);
        border-radius: 16px;
        gap: 18px;
        transition: transform 200ms ease, box-shadow 200ms ease;
    }

    .tool-row-card:hover {
        transform: translateX(4px);
        background: #FFFFFF;
        box-shadow: 0 4px 16px rgba(18, 24, 15, 0.04);
    }

    .tool-rank-badge {
        font-size: 13px;
        font-weight: 800;
        color: var(--color-text-subtle);
        width: 24px;
        text-align: center;
    }

    .tool-identity-group {
        display: flex;
        align-items: center;
        gap: 14px;
        min-width: 180px;
    }

    .tool-logo-box {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: #FFFFFF;
        border: 1px solid rgba(0, 0, 0, 0.06);
        box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        flex-shrink: 0;
    }

    .tool-logo-img {
        width: 24px;
        height: 24px;
        object-fit: contain;
    }

    .tool-meta-texts {
        display: flex;
        flex-direction: column;
    }

    .tool-name-text {
        font-size: 14px;
        font-weight: 700;
        color: var(--color-text-main);
        line-height: 1.2;
    }

    .tool-company-text {
        font-size: 11px;
        font-weight: 600;
        color: var(--color-text-subtle);
    }

    .tool-progress-track {
        flex: 1;
        height: 10px;
        background: var(--color-accent-stone-light);
        border-radius: var(--radius-pill);
        overflow: hidden;
        position: relative;
    }

    .tool-progress-fill {
        height: 100%;
        border-radius: var(--radius-pill);
        transition: width 400ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .tool-metrics-group {
        display: flex;
        align-items: baseline;
        gap: 10px;
        min-width: 110px;
        justify-content: flex-end;
    }

    .tool-pct-text {
        font-size: 15px;
        font-weight: 800;
        color: var(--color-text-main);
    }

    .tool-count-text {
        font-size: 11px;
        font-weight: 600;
        color: var(--color-text-subtle);
    }

    /* Social Dilemma Cards */
    .dilemma-card-inner {
        padding: 20px;
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid var(--glass-border);
        border-radius: 18px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .dilemma-top-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
    }

    .dilemma-icon-box {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: var(--color-accent-lime-tint);
        color: #2D3A0A;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .dilemma-title {
        font-size: 14px;
        font-weight: 700;
        color: var(--color-text-main);
        margin: 0;
    }

    /* Apple Glass Footer */
    .apple-glass-footer {
        margin-top: 40px;
        padding: 24px 30px;
        background: var(--glass-surface);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
    }

    .footer-left {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .footer-text-title {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--color-text-secondary);
    }

    .footer-text-desc {
        font-size: 12px;
        color: var(--color-text-subtle);
        margin: 0;
        max-width: 650px;
        line-height: 1.5;
    }

    .footer-tag {
        font-size: 11px;
        font-weight: 700;
        padding: 6px 14px;
        border-radius: var(--radius-pill);
        background: rgba(18, 20, 17, 0.05);
        color: var(--color-text-secondary);
        border: 1px solid var(--glass-border);
    }
    </style>
    """
    st.markdown(css, unsafe_allow_html=True)


# Alias for backward compatibility
inject_liquid_glass_css = inject_production_ui_css


def render_executive_navbar(n_total: int, last_update: str = ""):
    """Renders the top breadcrumbs and live data badges matching Image 1 & 2."""
    time_badge = f" · Yenilənmə: {last_update}" if last_update else ""
    html = f"""
    <div class="top-nav-bar">
        <div class="nav-breadcrumbs">
            <span class="breadcrumb-item-muted">Workspace</span>
            <span class="breadcrumb-separator">/</span>
            <span>Süni İntellekt Analitikası</span>
        </div>
        <div class="nav-actions-group">
            <div class="nav-pill-badge">
                <span class="pulse-dot-green"></span>
                <span>Canlı Sorğu: n={n_total} respondent{time_badge}</span>
            </div>
        </div>
    </div>
    """
    render_clean_html(html)


def render_executive_title(n_total: int):
    """Renders the executive title block."""
    html = f"""
    <div class="executive-header-wrap">
        <div>
            <h1 class="executive-title">Azərbaycanda Süni İntellekt İstifadəsi</h1>
            <p class="executive-subtitle">Sorğuda iştirak edən {n_total} respondent arasında aparılmış sosioloji və texnoloji icraçı analitik hesabat</p>
        </div>
    </div>
    """
    render_clean_html(html)


def render_kpi_matrix(kpis: dict, top_tool_logo_b64: str = ""):
    """Renders the 4 executive KPI cards matching Image 2."""
    n_total = kpis.get('n_total', 126)
    n_ai = kpis.get('n_ai', 108)
    ai_pct = kpis.get('ai_pct', 85.7)
    mean_trust = kpis.get('mean_trust', 3.42)
    top_tool = kpis.get('top_tool_name', 'ChatGPT')
    top_tool_pct = kpis.get('top_tool_pct', 97.2)
    top_tool_n = kpis.get('top_tool_n', 105)

    logo_markup = f'<img src="{top_tool_logo_b64}" style="width:20px;height:20px;vertical-align:middle;margin-right:4px;" alt="{top_tool}">' if top_tool_logo_b64 else ''

    html = f"""
    <div class="kpi-glass-grid">
        <div class="kpi-card">
            <div class="kpi-card-header">
                <span class="kpi-label">Cəmi Respondent</span>
                <span class="kpi-tag">Baza: 100%</span>
            </div>
            <div class="kpi-value-row">
                <span class="kpi-value">{n_total}</span>
            </div>
            <p class="kpi-subtext">Google Forms vasitəsilə toplanmış bütöv anonim nümunə</p>
        </div>

        <div class="kpi-card">
            <div class="kpi-card-header">
                <span class="kpi-label">AI Nüfuz Nisbəti</span>
                <span class="kpi-tag">Dominant</span>
            </div>
            <div class="kpi-value-row">
                <span class="kpi-value">{ai_pct:.1f}%</span>
                <span class="kpi-delta">n={n_ai}</span>
            </div>
            <p class="kpi-subtext">Sorğuda iştirak edənlərin mütləq əksəriyyəti aktiv istifadəçidir</p>
        </div>

        <div class="kpi-card">
            <div class="kpi-card-header">
                <span class="kpi-label">Lider Alət</span>
                <span class="kpi-tag">№ 1 Seçim</span>
            </div>
            <div class="kpi-value-row">
                <span class="kpi-value">{top_tool}</span>
            </div>
            <p class="kpi-subtext">{logo_markup} {top_tool_pct:.1f}% istifadəçi payı (n={top_tool_n}/{n_ai})</p>
        </div>

        <div class="kpi-card">
            <div class="kpi-card-header">
                <span class="kpi-label">Orta Etibar Səviyyəsi</span>
                <span class="kpi-tag">1-5 Şkala</span>
            </div>
            <div class="kpi-value-row">
                <span class="kpi-value">{mean_trust:.2f} <span style="font-size:18px;font-weight:600;color:var(--color-text-subtle);">/ 5</span></span>
            </div>
            <p class="kpi-subtext">AI cavablarına olan ümumi etimad indeksi (Baza: AI istifadəçiləri)</p>
        </div>
    </div>
    """
    render_clean_html(html)


def render_key_findings_glass(findings: list):
    """Renders 5 strategic behavioral discovery cards."""
    if not findings:
        return

    icon_names = ['shield-alert', 'award', 'heart-handshake', 'wallet', 'battery-charging']
    cards_html = []
    for idx, f in enumerate(findings):
        icon_name = icon_names[idx % len(icon_names)]
        svg_icon = icons.icon(icon_name, size=20, color="var(--color-accent-dark)")
        card = f"""
        <div class="finding-card">
            <div>
                <div class="finding-icon-wrap">
                    {svg_icon}
                </div>
                <div class="finding-stat">{f.get('stat', '')}</div>
                <h4 class="finding-title">{f.get('title', '')}</h4>
                <p class="finding-desc">{f.get('desc', '')}</p>
            </div>
            <span class="finding-sample">{f.get('sub', '')}</span>
        </div>
        """
        cards_html.append(textwrap.dedent(card).strip())

    container_html = f"""
    <div class="findings-glass-grid">
        {"".join(cards_html)}
    </div>
    """
    render_clean_html(container_html)


def render_tool_rankings_glass(tools_list: list, n_ai: int):
    """Renders interactive tool ranking cards with vector logos and liquid progress bars."""
    if not tools_list or n_ai == 0:
        return

    from data_utils import KNOWN_TOOLS

    rows_html = []
    for idx, item in enumerate(tools_list):
        name = item['name']
        count = item['count']
        pct = (count / n_ai * 100)
        meta = KNOWN_TOOLS.get(name, {'company': 'Digər', 'color': '#556247', 'logo': 'other.svg'})
        company = meta.get('company', '')
        color = meta.get('color', '#C8F135')
        logo_file = meta.get('logo', 'other.svg')
        logo_b64 = get_base64_svg(logo_file)

        logo_img = f'<img src="{logo_b64}" class="tool-logo-img" alt="{name}">' if logo_b64 else f'<span style="font-weight:800;color:{color};">{name[:1]}</span>'
        rank_str = f"{idx+1:02d}"

        row = f"""
        <div class="tool-row-card">
            <span class="tool-rank-badge">{rank_str}</span>
            <div class="tool-identity-group">
                <div class="tool-logo-box">
                    {logo_img}
                </div>
                <div class="tool-meta-texts">
                    <span class="tool-name-text">{name}</span>
                    <span class="tool-company-text">{company}</span>
                </div>
            </div>
            <div class="tool-progress-track">
                <div class="tool-progress-fill" style="width: {pct:.1f}%; background-color: {color};"></div>
            </div>
            <div class="tool-metrics-group">
                <span class="tool-pct-text">{pct:.1f}%</span>
                <span class="tool-count-text">n={count}/{n_ai}</span>
            </div>
        </div>
        """
        rows_html.append(textwrap.dedent(row).strip())

    full_html = f"""
    <div class="tools-ranking-wrap">
        {"".join(rows_html)}
    </div>
    """
    render_clean_html(full_html)


def render_footer_glass():
    """Renders the Apple Liquid Glass methodology and copyright footer."""
    html = """
    <div class="apple-glass-footer">
        <div class="footer-left">
            <span class="footer-text-title">Tədqiqat Metodologiyası və Hüquqi Qeyd</span>
            <p class="footer-text-desc">
                Bu hesabat 126 iştirakçının anonim rəyləri əsasında hazırlanmışdır. Nümunə təsadüfi ehtimallı deyil; nəticələr bütün ölkə əhalisinə deyil, yalnız bu sorğuda iştirak edənlərə aiddir. Loqolar müvafiq şirkətlərin mülkiyyətidir və burada yalnız məlumatlandırma məqsədi ilə istifadə edilmişdir.
            </p>
        </div>
        <div>
            <span class="footer-tag">Müstəqil Tədqiqat · 2026</span>
        </div>
    </div>
    """
    render_clean_html(html)

