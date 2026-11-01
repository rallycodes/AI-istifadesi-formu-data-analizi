import { EMBEDDED_CSV } from './embeddedData';

export type Row = {
  label: string;
  count: number;
  base: number;
  percent: number;
  score?: number;
};

export type DashboardData = {
  kpis: {
    n_total: number;
    n_ai: number;
    ai_pct: number;
    avg_trust: number;
    top_tool_name: string;
    top_tool_n: number;
    top_tool_pct: number;
    top_purp_name?: string;
    top_purp_n?: number;
    top_purp_pct?: number;
  };
  findings: { title: string; stat: string; sub: string; desc: string }[];
  distributions: Record<string, Row[]>;
  ageGroups: Row[];
  fieldTrust: Row[];
  options: Record<string, string[]>;
  lastUpdate: string;
  source: string;
  sourceTotal: number;
  trustAnswers: number;
  questionMeta: Record<
    string,
    {
      question: string;
      base: number;
      answered: number;
      missing: number;
      activeOnly: boolean;
      multiple: boolean;
    }
  >;
  analyses: {
    toolBreadth: Row[];
    coUsage: { labels: string[]; base: number; counts: number[][] };
    occupationUsage: { label: string; base: number; counts: number[] }[];
    trustByFrequency: Row[];
    trustByPlan: Row[];
    socialByUse: { field: string; title: string; rows: Row[] }[];
    dominantAge: Row | null;
    summary: {
      daily: number;
      paid: number;
      highTrust: number;
      multiTool: number;
      averageTools: number | null;
    };
  };
};

export const COLUMN_MAP_EXACT: Record<string, string> = {
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
  'Zaman möhürü': 'timestamp',
};

const KNOWN_PURPOSES = [
  'Təhsil və imtahan hazırlığı',
  'Məlumat axtarışı və suallara cavab',
  'İş və peşəkar tapşırıqlar',
  'Şəkil və video yaradılması',
  'Tərcümə və dil öyrənmə',
  'Proqramlaşdırma və texniki dəstək',
  'Şəxsi məsləhət və münasibətlər',
  'Mətn və e-mail yazılması',
  'Alış-veriş və məhsul seçimi',
];

const ORDERS: Record<string, string[]> = {
  yas: ['18-dən kiçik', '18-24', '25-34', '35-44', '45+'],
  yas_birləşmiş: ['18-dən kiçik', '18-24', '25-34', '35+'],
  tezlik: [
    'Gündə bir neçə dəfə',
    'Gündə bir dəfə',
    'Həftədə bir neçə dəfə',
    'Ayda bir neçə dəfə',
    'Nadir hallarda',
  ],
  muddet: ['6 aydan az', '6-12 ay', '1-2 il', '3-4 il', '5 il və daha çox'],
  etibar: ['1.0', '2.0', '3.0', '4.0', '5.0'],
  odeme_heveski: ['0 AZN', '1-10 AZN', '11-30 AZN', '30 AZN-dən çox'],
  ai_istifade: ['Bəli', 'Eşitmişəm, amma istifadə etməmişəm', 'Xeyr'],
};

const AI_FIELDS = [
  'tezlik',
  'muddet',
  'odenisli',
  'etibar',
  'gizledir',
  'oz_isi',
  'sexsi',
  'ai_siz_gun',
];

const GENERAL_FIELDS = [
  'yas',
  'cins',
  'mesguliyyet',
  'sahe',
  'hekim',
  'usaq',
  'dost',
  'aqilli',
  'odeme_heveski',
  'ai_istifade',
];

export interface SurveyRecord {
  id: number;
  timestamp?: string;
  yas?: string;
  yas_birləşmiş?: string;
  cins?: string;
  mesguliyyet?: string;
  sahe?: string;
  ai_istifade?: string;
  muddet?: string;
  aletler?: string;
  meqsedler?: string;
  tezlik?: string;
  odenisli?: string;
  etibar?: number; // 1 to 5
  gizledir?: string;
  oz_isi?: string;
  sexsi?: string;
  ai_siz_gun?: string;
  aqilli?: string;
  odeme_heveski?: string;
  hekim?: string;
  usaq?: string;
  dost?: string;
  [key: string]: string | number | undefined;
}

export function parseCsv(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let entry = '';
  let insideQuote = false;

  const len = text.length;
  for (let i = 0; i < len; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (insideQuote) {
      if (c === '"') {
        if (next === '"') {
          entry += '"';
          i++; // skip next quote
        } else {
          insideQuote = false;
        }
      } else {
        entry += c;
      }
    } else {
      if (c === '"') {
        insideQuote = true;
      } else if (c === ',') {
        row.push(entry);
        entry = '';
      } else if (c === '\r') {
        // ignore CR or handle CRLF
        if (next === '\n') i++;
        row.push(entry);
        entry = '';
        lines.push(row);
        row = [];
      } else if (c === '\n') {
        row.push(entry);
        entry = '';
        lines.push(row);
        row = [];
      } else {
        entry += c;
      }
    }
  }
  if (entry.length > 0 || row.length > 0) {
    row.push(entry);
    lines.push(row);
  }
  return lines;
}

export function loadAndCleanData(csvContent: string = EMBEDDED_CSV): SurveyRecord[] {
  const table = parseCsv(csvContent.trim());
  if (table.length < 2) return [];

  const rawHeaders = table[0].map((h) => h.trim());
  const colKeys: string[] = rawHeaders.map((col) => {
    const cClean = col.trim();
    for (const [expectedQ, shortName] of Object.entries(COLUMN_MAP_EXACT)) {
      if (
        expectedQ.toLowerCase().includes(cClean.toLowerCase()) ||
        cClean.toLowerCase().includes(expectedQ.toLowerCase())
      ) {
        return shortName;
      }
    }
    return cClean;
  });

  const records: SurveyRecord[] = [];

  for (let r = 1; r < table.length; r++) {
    const row = table[r];
    if (row.length === 0 || (row.length === 1 && !row[0].trim())) continue;

    const record: SurveyRecord = { id: r - 1 };
    for (let c = 0; c < colKeys.length; c++) {
      const key = colKeys[c];
      let val = (row[c] || '').trim();
      if (!val || val === 'nan' || val === 'None') {
        continue;
      }

      // Normalizations
      if (key === 'odeme_heveski') {
        if (val === 'O AZN' || val === '0 azn' || val === 'O azn') {
          val = '0 AZN';
        }
      }

      if (key === 'etibar') {
        const num = parseFloat(val);
        if (!isNaN(num) && num >= 1 && num <= 5) {
          record.etibar = num;
        }
        continue;
      }

      record[key] = val;
    }

    // yas_birləşmiş
    if (record.yas) {
      if (record.yas === '35-44' || record.yas === '45+') {
        record.yas_birləşmiş = '35+';
      } else {
        record.yas_birləşmiş = record.yas;
      }
    }

    records.push(record);
  }

  return records;
}

function explodeTools(activeRecords: SurveyRecord[]) {
  const tools: { alet: string; respondent_id: number }[] = [];
  for (const r of activeRecords) {
    if (!r.aletler) continue;
    const parts = r.aletler.split(';').map((p) => p.trim()).filter(Boolean);
    const seen = new Set<string>();
    for (const part of parts) {
      const pLower = part.toLowerCase();
      let toolName = 'Digər';
      if (pLower.includes('chatgpt')) toolName = 'ChatGPT';
      else if (pLower.includes('gemini')) toolName = 'Gemini';
      else if (pLower.includes('claude')) toolName = 'Claude';
      else if (pLower.includes('copilot')) toolName = 'Copilot';
      else if (pLower.includes('deepseek')) toolName = 'DeepSeek';
      else if (pLower.includes('grok') || pLower.includes('grook')) toolName = 'Grok';
      else if (
        pLower.includes('dizayn') ||
        pLower.includes('kreativ') ||
        pLower.includes('şəkil')
      )
        toolName = 'Şəkil və video alətləri';
      else toolName = 'Digər';

      if (!seen.has(toolName)) {
        seen.add(toolName);
        tools.push({ alet: toolName, respondent_id: r.id });
      }
    }
  }
  return tools;
}

function explodePurposes(activeRecords: SurveyRecord[]) {
  const purposes: { meqsed: string; respondent_id: number }[] = [];
  for (const r of activeRecords) {
    if (!r.meqsedler) continue;
    const parts = r.meqsedler.split(';').map((p) => p.trim()).filter(Boolean);
    const seen = new Set<string>();
    for (const part of parts) {
      let matched: string | null = null;
      for (const kp of KNOWN_PURPOSES) {
        if (kp.toLowerCase() === part.toLowerCase()) {
          matched = kp;
          break;
        }
      }
      const finalName = matched || 'Digər';
      if (!seen.has(finalName)) {
        seen.add(finalName);
        purposes.push({ meqsed: finalName, respondent_id: r.id });
      }
    }
  }
  return purposes;
}

function orderRows(rows: Row[], field: string): Row[] {
  const order = ORDERS[field];
  if (!order) return rows;
  return [...rows].sort((a, b) => {
    const idxA = order.indexOf(a.label);
    const idxB = order.indexOf(b.label);
    const rankA = idxA !== -1 ? idxA : order.length;
    const rankB = idxB !== -1 ? idxB : order.length;
    return rankA - rankB;
  });
}

function makeDistribution(values: string[], base: number): Row[] {
  const counts: Record<string, number> = {};
  for (const v of values) {
    const key = v || 'Cavab yoxdur';
    counts[key] = (counts[key] || 0) + 1;
  }
  const rows: Row[] = Object.entries(counts).map(([label, count]) => ({
    label,
    count,
    base,
    percent: base > 0 ? Math.round((count / base) * 1000000) / 10000 : 0,
  }));
  return rows.sort((a, b) => b.count - a.count);
}

function computeKpis(frame: SurveyRecord[], active: SurveyRecord[], tools: { alet: string; respondent_id: number }[], purposes: { meqsed: string; respondent_id: number }[]) {
  const n_total = frame.length;
  const n_ai = active.length;
  const ai_pct = n_total > 0 ? (n_ai / n_total) * 100 : 0;

  let top_tool_name = 'Məlumat yoxdur';
  let top_tool_n = 0;
  let top_tool_pct = 0;

  if (tools.length > 0) {
    const toolCounts: Record<string, number> = {};
    for (const t of tools) toolCounts[t.alet] = (toolCounts[t.alet] || 0) + 1;
    const sortedTools = Object.entries(toolCounts).sort((a, b) => b[1] - a[1]);
    top_tool_name = sortedTools[0][0];
    top_tool_n = sortedTools[0][1];
    top_tool_pct = n_ai > 0 ? (top_tool_n / n_ai) * 100 : 0;
  }

  const validTrust = active.filter((r) => r.etibar !== undefined).map((r) => r.etibar as number);
  const avg_trust = validTrust.length > 0 ? validTrust.reduce((a, b) => a + b, 0) / validTrust.length : 0;

  let top_purp_name = 'Məlumat yoxdur';
  let top_purp_n = 0;
  let top_purp_pct = 0;

  if (purposes.length > 0) {
    const purpCounts: Record<string, number> = {};
    for (const p of purposes) purpCounts[p.meqsed] = (purpCounts[p.meqsed] || 0) + 1;
    const sortedPurps = Object.entries(purpCounts).sort((a, b) => b[1] - a[1]);
    top_purp_name = sortedPurps[0][0];
    top_purp_n = sortedPurps[0][1];
    top_purp_pct = n_ai > 0 ? (top_purp_n / n_ai) * 100 : 0;
  }

  return {
    n_total,
    n_ai,
    ai_pct,
    top_tool_name,
    top_tool_n,
    top_tool_pct,
    avg_trust,
    top_purp_name,
    top_purp_n,
    top_purp_pct,
  };
}

function computeKeyFindings(frame: SurveyRecord[], active: SurveyRecord[]) {
  const findings: { title: string; stat: string; sub: string; desc: string }[] = [];
  const n_total = frame.length;
  const n_ai = active.length;

  if (n_ai > 0) {
    const hidingCount = active.filter((r) => r.gizledir === 'Bəzən').length;
    const hidingPct = (hidingCount / n_ai) * 100;
    findings.push({
      title: 'İşdə və ya dərsdə gizlətmə',
      stat: `${hidingPct.toFixed(1)}%`,
      sub: `n=${hidingCount}/${n_ai}`,
      desc: `AI istifadəçilərinin ${hidingPct.toFixed(1)}%-i (n=${hidingCount}) işdə və ya təhsildə AI-dan yararlandığını bəzən gizlədir.`,
    });

    const ownWorkCount = active.filter(
      (r) => r.oz_isi === 'Bəli, bir-iki dəfə' || r.oz_isi === 'Bəli, dəfələrlə'
    ).length;
    const ownWorkPct = (ownWorkCount / n_ai) * 100;
    findings.push({
      title: 'AI işini "özününkü" təqdim etmə',
      stat: `${ownWorkPct.toFixed(1)}%`,
      sub: `n=${ownWorkCount}/${n_ai}`,
      desc: `AI istifadə edənlərin ${ownWorkPct.toFixed(1)}%-i (n=${ownWorkCount}) süni intellektin hazırladığı nəticəni öz işi kimi təqdim edib.`,
    });

    const personalCount = active.filter(
      (r) => r.sexsi === 'Tez-tez' || r.sexsi === 'Bir neçə dəfə'
    ).length;
    const personalPct = (personalCount / n_ai) * 100;
    findings.push({
      title: 'Şəxsi mövzularda AI-a güvən',
      stat: `${personalPct.toFixed(1)}%`,
      sub: `n=${personalCount}/${n_ai}`,
      desc: `AI istifadəçilərinin ${personalPct.toFixed(1)}%-i (n=${personalCount}) psixoloji, karyera və ya münasibət mövzularını AI ilə məsləhətləşir.`,
    });
  }

  if (n_total > 0) {
    const zeroPayCount = frame.filter((r) => r.odeme_heveski === '0 AZN').length;
    const zeroPayPct = (zeroPayCount / n_total) * 100;
    findings.push({
      title: 'Ödəniş etməyə meylsizlik',
      stat: `${zeroPayPct.toFixed(1)}%`,
      sub: `n=${zeroPayCount}/${n_total}`,
      desc: `Sorğuda iştirak edənlərin ${zeroPayPct.toFixed(1)}%-i (n=${zeroPayCount}) AI üçün aylıq büdcə ayırmaq istəmir (0 AZN).`,
    });
  }

  if (n_ai > 0) {
    const hardCount = active.filter(
      (r) => r.ai_siz_gun === 'Çətinliklə' || r.ai_siz_gun === 'Yox'
    ).length;
    const hardPct = (hardCount / n_ai) * 100;
    findings.push({
      title: 'AI-dan asılılıq dərəcəsi',
      stat: `${hardPct.toFixed(1)}%`,
      sub: `n=${hardCount}/${n_ai}`,
      desc: `İstifadəçilərin ${hardPct.toFixed(1)}%-i (n=${hardCount}) AI olmadan bir günü çətinliklə keçirə biləcəyini və ya keçirə bilməyəcəyini bildirir.`,
    });
  }

  return findings;
}

function computeAdditionalAnalyses(
  frame: SurveyRecord[],
  active: SurveyRecord[],
  tools: { alet: string; respondent_id: number }[]
) {
  const total = frame.length;
  const ai = active.length;

  // Breadth: number of tools per respondent
  const toolsByResp: Record<number, Set<string>> = {};
  for (const r of active) toolsByResp[r.id] = new Set();
  for (const t of tools) {
    if (toolsByResp[t.respondent_id]) toolsByResp[t.respondent_id].add(t.alet);
  }

  const toolCountsPerResp = Object.values(toolsByResp).map((s) => s.size);
  const breadthCounts: Record<number, number> = {};
  for (const c of toolCountsPerResp) {
    breadthCounts[c] = (breadthCounts[c] || 0) + 1;
  }
  const breadthRows: Row[] = Object.keys(breadthCounts)
    .map(Number)
    .sort((a, b) => a - b)
    .map((num) => ({
      label: `${num} alət`,
      count: breadthCounts[num],
      base: ai,
      percent: ai > 0 ? (breadthCounts[num] / ai) * 100 : 0,
    }));

  // Co-usage top 6
  const toolFreq: Record<string, number> = {};
  for (const t of tools) toolFreq[t.alet] = (toolFreq[t.alet] || 0) + 1;
  const top6 = Object.entries(toolFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map((e) => e[0]);

  const coCounts: number[][] = [];
  for (let i = 0; i < top6.length; i++) {
    const rowArr: number[] = [];
    const tA = top6[i];
    for (let j = 0; j < top6.length; j++) {
      const tB = top6[j];
      let shared = 0;
      for (const set of Object.values(toolsByResp)) {
        if (set.has(tA) && set.has(tB)) shared++;
      }
      rowArr.push(shared);
    }
    coCounts.push(rowArr);
  }

  // occupationUsage
  const occGroups: Record<string, { base: number; counts: [number, number, number] }> = {};
  for (const r of frame) {
    const occ = r.mesguliyyet || 'Cavab yoxdur';
    if (!occGroups[occ]) {
      occGroups[occ] = { base: 0, counts: [0, 0, 0] };
    }
    occGroups[occ].base++;
    if (r.ai_istifade === 'Bəli') occGroups[occ].counts[0]++;
    else if (r.ai_istifade === 'Eşitmişəm, amma istifadə etməmişəm') occGroups[occ].counts[1]++;
    else if (r.ai_istifade === 'Xeyr') occGroups[occ].counts[2]++;
  }

  const occupationUsage = Object.entries(occGroups)
    .map(([label, d]) => ({ label, base: d.base, counts: d.counts }))
    .sort((a, b) => b.base - a.base);

  // trustByFrequency
  const tfGroups: Record<string, { scores: number[]; base: number }> = {};
  for (const r of active) {
    const key = r.tezlik || 'Cavab yoxdur';
    if (!tfGroups[key]) tfGroups[key] = { scores: [], base: 0 };
    tfGroups[key].base++;
    if (r.etibar !== undefined) tfGroups[key].scores.push(r.etibar);
  }
  const tfRows: Row[] = Object.entries(tfGroups).map(([label, d]) => ({
    label,
    count: d.scores.length,
    base: d.base,
    score: d.scores.length > 0 ? Math.round((d.scores.reduce((a, b) => a + b, 0) / d.scores.length) * 10000) / 10000 : 0,
    percent: d.base > 0 ? (d.scores.length / d.base) * 100 : 0,
  }));
  const trustByFrequency = orderRows(tfRows, 'tezlik');

  // trustByPlan
  const tpGroups: Record<string, { scores: number[]; base: number }> = {};
  for (const r of active) {
    const key = r.odenisli || 'Cavab yoxdur';
    if (!tpGroups[key]) tpGroups[key] = { scores: [], base: 0 };
    tpGroups[key].base++;
    if (r.etibar !== undefined) tpGroups[key].scores.push(r.etibar);
  }
  const tpRows: Row[] = Object.entries(tpGroups).map(([label, d]) => ({
    label,
    count: d.scores.length,
    base: d.base,
    score: d.scores.length > 0 ? Math.round((d.scores.reduce((a, b) => a + b, 0) / d.scores.length) * 10000) / 10000 : 0,
    percent: d.base > 0 ? (d.scores.length / d.base) * 100 : 0,
  }));
  const trustByPlan = tpRows;

  // socialByUse
  const socialConfigs = [
    { field: 'hekim', title: 'İnsan həkimə üstünlük verir', positive: 'İnsan həkim' },
    { field: 'usaq', title: 'Müəllimə üstünlük verir', positive: 'Müəllim' },
    { field: 'dost', title: 'AI-a dost kimi baxır', positive: 'Dost kimi' },
  ];
  const socialByUse = socialConfigs.map(({ field, title, positive }) => {
    const nonActive = frame.filter((r) => r.ai_istifade !== 'Bəli');
    const aiCount = active.filter((r) => r[field] === positive).length;
    const nonAiCount = nonActive.filter((r) => r[field] === positive).length;

    const rows: Row[] = [
      {
        label: 'AI istifadə edənlər',
        count: aiCount,
        base: active.length,
        percent: active.length > 0 ? (aiCount / active.length) * 100 : 0,
      },
      {
        label: 'Digər respondentlər',
        count: nonAiCount,
        base: nonActive.length,
        percent: nonActive.length > 0 ? (nonAiCount / nonActive.length) * 100 : 0,
      },
    ];
    return { field, title, rows };
  });

  // dominantAge
  const ageCounts: Record<string, number> = {};
  for (const r of frame) {
    if (r.yas) ageCounts[r.yas] = (ageCounts[r.yas] || 0) + 1;
  }
  const sortedAges = Object.entries(ageCounts).sort((a, b) => b[1] - a[1]);
  const dominantAge: Row | null =
    sortedAges.length > 0
      ? {
          label: sortedAges[0][0],
          count: sortedAges[0][1],
          base: total,
          percent: total > 0 ? (sortedAges[0][1] / total) * 100 : 0,
        }
      : null;

  // Summary
  const daily = active.filter(
    (r) => r.tezlik === 'Gündə bir neçə dəfə' || r.tezlik === 'Gündə bir dəfə'
  ).length;
  const paid = active.filter((r) => r.odenisli === 'Bəli').length;
  const highTrust = active.filter((r) => r.etibar === 4 || r.etibar === 5).length;
  const multiTool = toolCountsPerResp.filter((c) => c >= 2).length;
  const averageTools =
    ai > 0
      ? Math.round(
          (toolCountsPerResp.reduce((a, b) => a + b, 0) / ai) * 1000
        ) / 1000
      : null;

  return {
    toolBreadth: breadthRows,
    coUsage: { labels: top6, base: ai, counts: coCounts },
    occupationUsage,
    trustByFrequency,
    trustByPlan,
    socialByUse,
    dominantAge,
    summary: { daily, paid, highTrust, multiTool, averageTools },
  };
}

let cachedRawRecords: SurveyRecord[] | null = null;

export function getRawRecords(): SurveyRecord[] {
  if (!cachedRawRecords) {
    cachedRawRecords = loadAndCleanData(EMBEDDED_CSV);
  }
  return cachedRawRecords;
}

export function computeDashboardData(
  filters: Record<string, string> = {}
): DashboardData {
  const original = getRawRecords();
  let frame = original;

  const filterFields = ['yas', 'mesguliyyet', 'sahe', 'ai_istifade'] as const;
  for (const f of filterFields) {
    const val = filters[f];
    if (val) {
      frame = frame.filter((r) => r[f] === val);
    }
  }

  const active = frame.filter((r) => r.ai_istifade === 'Bəli');
  const total = frame.length;
  const ai = active.length;

  const tools = explodeTools(active);
  const purposes = explodePurposes(active);

  const dists: Record<string, Row[]> = {};
  for (const field of AI_FIELDS) {
    const vals = active.map((r) =>
      field === 'etibar' && r.etibar !== undefined
        ? r.etibar.toFixed(1)
        : (r[field] as string) || ''
    );
    dists[field] = orderRows(makeDistribution(vals, ai), field);
  }
  for (const field of GENERAL_FIELDS) {
    const vals = frame.map((r) => (r[field] as string) || '');
    dists[field] = orderRows(makeDistribution(vals, total), field);
  }

  dists.tools = orderRows(
    makeDistribution(
      tools.map((t) => t.alet),
      ai
    ),
    'tools'
  );
  dists.purposes = orderRows(
    makeDistribution(
      purposes.map((p) => p.meqsed),
      ai
    ),
    'purposes'
  );

  const questions: Record<string, string> = {};
  for (const [q, short] of Object.entries(COLUMN_MAP_EXACT)) {
    questions[short] = q.trim();
  }

  const questionMeta: DashboardData['questionMeta'] = {};
  for (const field of Object.keys(dists)) {
    const sourceField =
      field === 'tools' ? 'aletler' : field === 'purposes' ? 'meqsedler' : field;
    const isAi =
      AI_FIELDS.includes(field) || field === 'tools' || field === 'purposes';
    const pop = isAi ? active : frame;
    const answered = pop.filter((r) => {
      const v = r[sourceField];
      return v !== undefined && v !== null && v !== '';
    }).length;

    questionMeta[field] = {
      question: questions[sourceField] || sourceField,
      base: pop.length,
      answered,
      missing: pop.length - answered,
      activeOnly: isAi,
      multiple: field === 'tools' || field === 'purposes',
    };
  }

  // ageGroups (yas_birləşmiş)
  const ageGroupMap: Record<string, { total: number; yes: number }> = {};
  for (const r of frame) {
    const label = r.yas_birləşmiş || 'Məlum deyil';
    if (!ageGroupMap[label]) ageGroupMap[label] = { total: 0, yes: 0 };
    ageGroupMap[label].total++;
    if (r.ai_istifade === 'Bəli') ageGroupMap[label].yes++;
  }
  const rawAgeGroups: Row[] = Object.entries(ageGroupMap).map(([label, d]) => ({
    label,
    count: d.yes,
    base: d.total,
    percent: d.total > 0 ? (d.yes / d.total) * 100 : 0,
  }));
  const ageGroups = orderRows(rawAgeGroups, 'yas_birləşmiş');

  // fieldTrust (sahe in active)
  const ftMap: Record<string, { scores: number[]; base: number }> = {};
  for (const r of active) {
    if (!r.sahe) continue;
    if (!ftMap[r.sahe]) ftMap[r.sahe] = { scores: [], base: 0 };
    ftMap[r.sahe].base++;
    if (r.etibar !== undefined) ftMap[r.sahe].scores.push(r.etibar);
  }
  const fieldTrust: Row[] = Object.entries(ftMap)
    .filter(([_, d]) => d.scores.length > 0)
    .map(([label, d]) => ({
      label,
      count: d.scores.length,
      base: d.base,
      score:
        Math.round((d.scores.reduce((a, b) => a + b, 0) / d.scores.length) * 1000) /
        1000,
      percent: d.base > 0 ? (d.scores.length / d.base) * 100 : 0,
    }))
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  // Options
  const options: Record<string, string[]> = {};
  for (const f of filterFields) {
    const set = new Set<string>();
    for (const r of original) {
      const v = r[f];
      if (typeof v === 'string' && v.trim()) set.add(v.trim());
    }
    options[f] = Array.from(set).sort();
  }

  // Last timestamp
  const tsVals = original
    .map((r) => r.timestamp)
    .filter(Boolean) as string[];
  const lastUpdate = tsVals.length > 0 ? tsVals[tsVals.length - 1] : 'Bilinmir';

  return {
    kpis: computeKpis(frame, active, tools, purposes),
    findings: computeKeyFindings(frame, active),
    distributions: dists,
    ageGroups,
    fieldTrust,
    questionMeta,
    analyses: computeAdditionalAnalyses(frame, active, tools),
    options,
    lastUpdate,
    source: 'Lokal məlumat bazası',
    sourceTotal: original.length,
    trustAnswers: active.filter((r) => r.etibar !== undefined).length,
  };
}

export function generateExportCsv(payload: DashboardData): string {
  const rows: (string | number)[][] = [
    ['Bölmə / Sual', 'Kateqoriya', 'Say', 'Baza', 'Faiz (%)', 'Orta bal'],
  ];

  for (const [section, items] of Object.entries(payload.distributions)) {
    const title = payload.questionMeta[section]?.question || section;
    for (const r of items) {
      rows.push([title, r.label, r.count, r.base, r.percent.toFixed(2), '']);
    }
  }

  for (const r of payload.analyses.toolBreadth) {
    rows.push(['Bir istifadəçinin seçdiyi alət sayı', r.label, r.count, r.base, r.percent.toFixed(2), '']);
  }

  const co = payload.analyses.coUsage;
  for (let i = 0; i < co.labels.length; i++) {
    for (let j = i + 1; j < co.labels.length; j++) {
      const count = co.counts[i][j];
      const pct = co.base ? ((count / co.base) * 100).toFixed(2) : '0';
      rows.push(['Birlikdə seçilən alətlər', `${co.labels[i]} + ${co.labels[j]}`, count, co.base, pct, '']);
    }
  }

  for (const group of payload.analyses.occupationUsage) {
    const statuses = ['İstifadə edir', 'Eşidib, istifadə etməyib', 'İstifadə etmir'];
    for (let idx = 0; idx < statuses.length; idx++) {
      const count = group.counts[idx];
      const pct = group.base ? ((count / group.base) * 100).toFixed(2) : '0';
      rows.push([`Məşğuliyyət: ${group.label}`, statuses[idx], count, group.base, pct, '']);
    }
  }

  for (const r of payload.analyses.trustByFrequency) {
    rows.push(['İstifadə tezliyi və etibar', r.label, r.count, r.base, '', r.score ?? '']);
  }

  for (const r of payload.analyses.trustByPlan) {
    rows.push(['Ödənişli plan və etibar', r.label, r.count, r.base, '', r.score ?? '']);
  }

  for (const r of payload.fieldTrust) {
    rows.push(['Sahə və etibar', r.label, r.count, r.base, '', r.score ?? '']);
  }

  for (const r of payload.ageGroups) {
    rows.push(['Yaş qrupu üzrə AI istifadəsi', r.label, r.count, r.base, r.percent.toFixed(2), '']);
  }

  for (const item of payload.analyses.socialByUse) {
    for (const r of item.rows) {
      rows.push([item.title, r.label, r.count, r.base, r.percent.toFixed(2), '']);
    }
  }

  return rows
    .map((r) =>
      r
        .map((val) => {
          const str = String(val ?? '');
          return str.includes(',') || str.includes('"') || str.includes('\n')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(',')
    )
    .join('\r\n');
}
