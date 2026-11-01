import plotly.graph_objects as go
import pandas as pd
import numpy as np

# Apple Liquid Glass & Reference Palette
COLOR_LIME = "#C8F135"
COLOR_ONYX = "#121411"
COLOR_OLIVE = "#4E5C43"
COLOR_SAGE = "#75846B"
COLOR_STONE = "#DEE4D7"
COLOR_STONE_LIGHT = "#EEF2E8"
COLOR_MUTED_TEXT = "#606D5E"
COLOR_DARK_TEXT = "#121411"
COLOR_HAIRLINE = "rgba(180, 195, 175, 0.28)"

FONT_STACK = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Manrope', sans-serif"


def apply_apple_glass_layout(fig: go.Figure, height: int = 320, title: str = "", subtitle: str = "") -> go.Figure:
    """Applies Apple Liquid Glass minimalist aesthetic to Plotly figures."""
    title_dict = None
    if title:
        title_text = f"<b>{title}</b>"
        if subtitle:
            title_text += f"<br><span style='font-size:12px;font-weight:500;color:{COLOR_MUTED_TEXT};'>{subtitle}</span>"
        title_dict = dict(
            text=title_text,
            font=dict(family=FONT_STACK, size=15, color=COLOR_DARK_TEXT),
            x=0.01,
            y=0.96
        )

    fig.update_layout(
        title=title_dict,
        font=dict(family=FONT_STACK, color=COLOR_MUTED_TEXT, size=12),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        height=height,
        margin=dict(t=54 if title else 20, b=25, l=15, r=25),
        showlegend=False,
        hoverlabel=dict(
            bgcolor="rgba(18, 20, 17, 0.95)",
            font=dict(family=FONT_STACK, size=12, color="#FFFFFF"),
            bordercolor="rgba(255, 255, 255, 0.15)"
        )
    )
    fig.update_xaxes(
        showgrid=False,
        showline=False,
        zeroline=False,
        tickfont=dict(family=FONT_STACK, size=11, color=COLOR_MUTED_TEXT)
    )
    fig.update_yaxes(
        showgrid=True,
        gridcolor=COLOR_HAIRLINE,
        gridwidth=1,
        showline=False,
        zeroline=False,
        tickfont=dict(family=FONT_STACK, size=11, color=COLOR_MUTED_TEXT)
    )
    return fig


def plot_hero_attainment_bars(tools_list: list, n_ai: int, height: int = 360) -> go.Figure:
    """
    Creates vertical rounded capsule bar chart matching Image 1 'Attainment by rep'.
    First bar is Lime, 2nd is Onyx, 3rd is Dark Olive, rest are warm Stone.
    """
    if not tools_list or n_ai == 0:
        return go.Figure()

    top_tools = tools_list[:6]
    names = [t['name'] for t in top_tools]
    counts = [t['count'] for t in top_tools]
    pcts = [(c / n_ai * 100) for c in counts]
    pct_labels = [f"{p:.1f}%" for p in pcts]

    # Reference color progression
    bar_colors = [COLOR_LIME, COLOR_ONYX, COLOR_OLIVE, COLOR_SAGE, COLOR_STONE, COLOR_STONE]

    fig = go.Figure()
    fig.add_trace(go.Bar(
        x=names,
        y=counts,
        text=pct_labels,
        textposition='outside',
        textfont=dict(family=FONT_STACK, size=12, color=COLOR_DARK_TEXT, weight=700),
        marker=dict(
            color=bar_colors[:len(names)],
            cornerradius=12,
            line=dict(width=0)
        ),
        hovertemplate="<b>%{x}</b><br>İstifadəçi sayı: %{y} nəfər<br>İstifadə nisbəti: %{text} (n=" + str(n_ai) + ")<extra></extra>"
    ))

    fig = apply_apple_glass_layout(
        fig,
        height=height,
        title="Ən Populyar AI Alətləri",
        subtitle=f"Aktiv istifadəçilər arasında alət seçimləri və paylanma (Baza: n={n_ai})"
    )
    max_c = max(counts) if counts else 10
    fig.update_yaxes(range=[0, max_c * 1.18])
    return fig


def plot_source_mix_donut(series: pd.Series, title: str = "AI Nüfuz Nisbəti", center_metric: str = "85.7%", center_caption: str = "AKTİV İSTİFADƏ", height: int = 360) -> go.Figure:
    """
    Creates thick ring donut chart matching Image 1 'Source mix'.
    Features bold center metric and legend on the right.
    """
    counts = series.value_counts(dropna=True)
    if counts.empty:
        return go.Figure()

    labels = list(counts.index)
    values = list(counts.values)
    total = sum(values)

    colors = [COLOR_LIME, COLOR_ONYX, COLOR_OLIVE, COLOR_STONE]
    if len(labels) > len(colors):
        colors = colors + [COLOR_SAGE, COLOR_STONE_LIGHT] * 2

    fig = go.Figure(data=[go.Pie(
        labels=labels,
        values=values,
        hole=0.72,
        direction='clockwise',
        sort=False,
        marker=dict(colors=colors[:len(labels)], line=dict(color='rgba(255,255,255,0.95)', width=2.5)),
        textinfo='none',
        hovertemplate="<b>%{label}</b><br>Cavab: %{value} nəfər<br>Nisbət: %{percent} (n=" + str(total) + ")<extra></extra>"
    )])

    annotations = [dict(
        text=f"<span style='font-size:26px;font-weight:800;color:{COLOR_DARK_TEXT};'>{center_metric}</span><br><span style='font-size:10px;font-weight:700;color:{COLOR_MUTED_TEXT};letter-spacing:0.06em;'>{center_caption}</span>",
        x=0.5, y=0.5,
        font=dict(family=FONT_STACK),
        showarrow=False
    )]

    fig.update_layout(
        annotations=annotations,
        showlegend=True,
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=-0.22,
            xanchor="center",
            x=0.5,
            font=dict(family=FONT_STACK, size=11, color=COLOR_MUTED_TEXT)
        )
    )

    return apply_apple_glass_layout(
        fig,
        height=height,
        title=title,
        subtitle=f"Sorğuda iştirak edənlərin ümumi təcrübə payı (n={total})"
    )


def plot_horizontal_pill_bars(labels: list, values: list, n_base: int, title: str = "", height: int = 340, max_items: int = 8, highlight_first: bool = True, is_rating: bool = False) -> go.Figure:
    """
    Creates horizontal rounded pill bars matching Image 3 'Won/lost reason analysis'.
    Top bar highlighted with Lime, others with Stone/Dark.
    Supports is_rating=True for scale questions (1-5 averages).
    """
    if not labels or not values or n_base == 0:
        return go.Figure()

    if len(labels) > max_items:
        if is_rating:
            # For ratings, take top items without summing averages
            labels = labels[:max_items]
            values = values[:max_items]
        else:
            top_labels = labels[:max_items-1]
            top_values = values[:max_items-1]
            other_val = sum(values[max_items-1:])
            top_labels.append('Digər')
            top_values.append(other_val)
            labels = top_labels
            values = top_values

    # Invert for horizontal display
    labels_rev = labels[::-1]
    values_rev = values[::-1]

    # Colors
    colors = []
    for i, _ in enumerate(values_rev):
        if i == len(values_rev) - 1 and highlight_first:
            colors.append(COLOR_LIME)
        elif i == len(values_rev) - 2:
            colors.append(COLOR_ONYX)
        else:
            colors.append(COLOR_STONE)

    if is_rating:
        pct_texts = [f"{v:.2f} / 5" for v in values_rev]
        hovertemplate = "<b>%{y}</b><br>Orta etibar balı: %{x:.2f} / 5<extra></extra>"
    else:
        pct_texts = [f"{(v / n_base * 100):.1f}%" if n_base > 0 else f"{v}" for v in values_rev]
        hovertemplate = "<b>%{y}</b><br>Cavab: %{x} nəfər<br>Nisbət: %{text} (n=" + str(n_base) + ")<extra></extra>"

    fig = go.Figure(go.Bar(
        x=values_rev,
        y=labels_rev,
        orientation='h',
        text=pct_texts,
        textposition='outside',
        textfont=dict(family=FONT_STACK, size=11, color=COLOR_DARK_TEXT, weight=700),
        marker=dict(
            color=colors,
            cornerradius=8,
            line=dict(width=0)
        ),
        hovertemplate=hovertemplate
    ))

    fig = apply_apple_glass_layout(fig, height=height, title=title)
    fig.update_xaxes(showgrid=True, gridcolor=COLOR_HAIRLINE)
    fig.update_yaxes(showgrid=False, tickfont=dict(family=FONT_STACK, size=11, color=COLOR_DARK_TEXT, weight=600))
    if is_rating:
        fig.update_xaxes(range=[0, 5.3])
    else:
        max_v = max(values_rev) if values_rev else 10
        fig.update_xaxes(range=[0, max_v * 1.25])
    return fig



# Alias
plot_horizontal_bars = plot_horizontal_pill_bars


def plot_vertical_capsule_bars(categories: list, values: list, n_base: int, title: str = "", height: int = 290) -> go.Figure:
    """Vertical capsule bar chart with reference styling."""
    if not categories or not values or n_base == 0:
        return go.Figure()

    pct_texts = [f"{(v / n_base * 100):.1f}%" for v in values]
    
    # Gradient sequence
    colors = [COLOR_ONYX if i == 0 else (COLOR_LIME if i == 1 else COLOR_STONE) for i in range(len(categories))]

    fig = go.Figure(go.Bar(
        x=categories,
        y=values,
        text=pct_texts,
        textposition='outside',
        textfont=dict(family=FONT_STACK, size=11, color=COLOR_DARK_TEXT, weight=700),
        marker=dict(
            color=colors,
            cornerradius=10,
            line=dict(width=0)
        ),
        hovertemplate="<b>%{x}</b><br>Cavab: %{y} nəfər<br>Nisbət: %{text} (n=" + str(n_base) + ")<extra></extra>"
    ))

    fig = apply_apple_glass_layout(fig, height=height, title=title)
    max_v = max(values) if values else 10
    fig.update_yaxes(range=[0, max_v * 1.22])
    return fig


# Alias
plot_vertical_bars = plot_vertical_capsule_bars


def plot_spline_distribution(categories: list, values: list, n_base: int, title: str = "", height: int = 290) -> go.Figure:
    """
    Creates smooth spline curve matching Image 1 'Sales cycle length'.
    Features glowing markers and lime area fill.
    """
    if not categories or not values or n_base == 0:
        return go.Figure()

    pcts = [(v / n_base * 100) for v in values]

    fig = go.Figure()

    # Soft glowing gradient area
    fig.add_trace(go.Scatter(
        x=categories,
        y=values,
        mode='lines+markers',
        line=dict(color=COLOR_LIME, width=3, shape='spline', smoothing=1.1),
        fill='tozeroy',
        fillcolor='rgba(200, 241, 53, 0.16)',
        marker=dict(
            size=9,
            color='#FFFFFF',
            line=dict(color=COLOR_ONYX, width=2.5)
        ),
        hovertemplate="<b>Bal %{x}</b><br>Say: %{y} nəfər<br>Nisbət: %{customdata:.1f}% (n=" + str(n_base) + ")<extra></extra>",
        customdata=pcts
    ))

    fig = apply_apple_glass_layout(fig, height=height, title=title)
    max_v = max(values) if values else 10
    fig.update_yaxes(range=[0, max_v * 1.2])
    return fig


def plot_trust_distribution(series: pd.Series, n_base: int, height: int = 290) -> go.Figure:
    """Distribution of 1-5 trust scores using smooth spline."""
    s_clean = series.dropna()
    scale = [1, 2, 3, 4, 5]
    counts = s_clean.value_counts()
    values = [int(counts.get(score, 0)) for score in scale]
    categories = [f"{s} Bal" for s in scale]

    return plot_spline_distribution(
        categories=categories,
        values=values,
        n_base=n_base,
        title="AI Cavablarına Etibar Paylanması (1-5 Şkala)",
        height=height
    )


def plot_donut_metric(series: pd.Series, title: str, center_text: str = "", height: int = 290) -> go.Figure:
    """Compact donut chart with clean legend."""
    counts = series.value_counts(dropna=True)
    if counts.empty:
        return go.Figure()

    labels = list(counts.index)
    values = list(counts.values)
    total = sum(values)

    colors = [COLOR_ONYX, COLOR_LIME, COLOR_OLIVE, COLOR_STONE, COLOR_SAGE]
    if len(labels) > len(colors):
        colors = colors + [COLOR_STONE_LIGHT] * len(labels)

    fig = go.Figure(data=[go.Pie(
        labels=labels,
        values=values,
        hole=0.70,
        direction='clockwise',
        sort=False,
        marker=dict(colors=colors[:len(labels)], line=dict(color='rgba(255,255,255,0.95)', width=2)),
        textinfo='percent',
        textposition='outside',
        textfont=dict(family=FONT_STACK, size=11, color=COLOR_DARK_TEXT),
        hovertemplate="<b>%{label}</b><br>Cavab: %{value} nəfər<br>Nisbət: %{percent} (n=" + str(total) + ")<extra></extra>"
    )])

    annotations = []
    if center_text:
        annotations.append(dict(
            text=f"<span style='font-size:22px;font-weight:800;color:{COLOR_DARK_TEXT};'>{center_text}</span>",
            x=0.5, y=0.5,
            font=dict(family=FONT_STACK),
            showarrow=False
        ))

    fig.update_layout(
        annotations=annotations,
        showlegend=True,
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=-0.22,
            xanchor="center",
            x=0.5,
            font=dict(family=FONT_STACK, size=10, color=COLOR_MUTED_TEXT)
        )
    )
    return apply_apple_glass_layout(fig, height=height, title=title)


def plot_choice_comparison(df: pd.DataFrame, col: str, title: str, height: int = 300) -> go.Figure:
    """
    Visualizes dilemma options with stacked comparison between AI users and Non-users.
    """
    if col not in df.columns or df.empty:
        return go.Figure()

    counts = df[col].value_counts(dropna=True)
    if counts.empty:
        return go.Figure()

    labels = list(counts.index)
    values = list(counts.values)
    n_total = len(df)
    pcts = [(v / n_total * 100) for v in values]
    pct_texts = [f"{p:.1f}%" for p in pcts]

    colors = [COLOR_LIME, COLOR_ONYX] if len(labels) == 2 else [COLOR_LIME, COLOR_ONYX, COLOR_STONE]

    fig = go.Figure(go.Bar(
        x=labels,
        y=values,
        text=pct_texts,
        textposition='outside',
        textfont=dict(family=FONT_STACK, size=12, color=COLOR_DARK_TEXT, weight=700),
        marker=dict(
            color=colors[:len(labels)],
            cornerradius=10,
            line=dict(width=0)
        ),
        hovertemplate="<b>%{x}</b><br>Cavab: %{y} nəfər<br>Nisbət: %{text} (Baza: n=" + str(n_total) + ")<extra></extra>"
    ))

    fig = apply_apple_glass_layout(fig, height=height, title=title)
    max_v = max(values) if values else 10
    fig.update_yaxes(range=[0, max_v * 1.25])
    return fig


def plot_cross_comparison(df: pd.DataFrame, group_col: str, target_col: str, positive_val: str, title: str, height: int = 300) -> go.Figure:
    """
    Plots cross-group percentage with sample size indicators.
    Groups with n < 20 are tagged.
    """
    if group_col not in df.columns or target_col not in df.columns or df.empty:
        return go.Figure()

    groups = df[group_col].dropna().unique()
    results = []

    for g in groups:
        subset = df[df[group_col] == g]
        total_grp = len(subset)
        if total_grp == 0:
            continue
        pos_count = len(subset[subset[target_col] == positive_val])
        pct = (pos_count / total_grp * 100)
        tag = " (kiçik nümunə)" if total_grp < 20 else ""
        results.append({
            'group': f"{g} (n={total_grp}){tag}",
            'pct': pct,
            'count': pos_count,
            'total': total_grp
        })

    df_res = pd.DataFrame(results).sort_values(by='pct', ascending=False)
    if df_res.empty:
        return go.Figure()

    pct_labels = [f"{p:.1f}%" for p in df_res['pct']]

    fig = go.Figure(go.Bar(
        x=df_res['group'],
        y=df_res['pct'],
        text=pct_labels,
        textposition='outside',
        textfont=dict(family=FONT_STACK, size=11, color=COLOR_DARK_TEXT, weight=700),
        marker=dict(
            color=[COLOR_LIME if i == 0 else COLOR_STONE for i in range(len(df_res))],
            cornerradius=8
        ),
        hovertemplate="<b>%{x}</b><br>İstifadə edən: %{customdata} nəfər<br>Nisbət: %{text}<extra></extra>",
        customdata=df_res['count']
    ))

    fig = apply_apple_glass_layout(fig, height=height, title=title)
    fig.update_yaxes(range=[0, 115], ticksuffix="%")
    return fig
