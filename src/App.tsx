import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  CircleHelp,
  Database,
  FileBarChart2,
  Filter,
  GraduationCap,
  HeartHandshake,
  Layers,
  LayoutDashboard,
  Loader2,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Search,
  ShieldCheck,
  Sun,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoBubble } from "@/components/InfoBubble";
import { StyledSelect } from "@/components/StyledSelect";
import {
  computeDashboardData,
  generateExportCsv,
  type DashboardData,
} from "@/lib/surveyEngine";

export type Row = {
  label: string;
  count: number;
  base: number;
  percent: number;
  score?: number;
};
export type Data = {
  kpis: {
    n_total: number;
    n_ai: number;
    ai_pct: number;
    avg_trust: number;
    top_tool_name: string;
    top_tool_n: number;
    top_tool_pct: number;
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
const pages: {
  id: string;
  label: string;
  icon: LucideIcon;
  subtitle: string;
}[] = [
  {
    id: "overview",
    label: "Ümumi mənzərə",
    icon: LayoutDashboard,
    subtitle: "Sorğuda kimlər iştirak edib və AI nə qədər istifadə olunur?",
  },
  {
    id: "tools",
    label: "Alətlər və məqsədlər",
    icon: BarChart3,
    subtitle: "Ən çox seçilən AI alətləri və əsas istifadə məqsədləri.",
  },
  {
    id: "trust",
    label: "Etibar və seçimlər",
    icon: ShieldCheck,
    subtitle: "AI cavablarına etibar və insanla AI arasında seçim.",
  },
];
const meta: Record<string, { file: string; company: string }> = {
  ChatGPT: { file: "chatgpt", company: "OpenAI" },
  Gemini: { file: "gemini", company: "Google" },
  Claude: { file: "claude", company: "Anthropic" },
  Copilot: { file: "copilot", company: "Microsoft" },
  DeepSeek: { file: "deepseek", company: "DeepSeek" },
  Grok: { file: "grok", company: "xAI" },
  "Şəkil və video alətləri": { file: "creative", company: "Kreativ alətlər" },
  Digər: { file: "other", company: "Digər alətlər" },
};
const colors = [
  "var(--lavender)",
  "var(--mint)",
  "var(--amber)",
  "var(--blue)",
  "var(--pink)",
  "var(--muted)",
];
const fmt = (n: number, digits = 1) =>
  n.toLocaleString("az-AZ", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
const pct = (n: number) => `${fmt(n)}%`;
const initialPage = () => {
  const requested = location.hash.slice(1);
  const aliases: Record<string, string> = {
    habits: "tools",
    demographics: "overview",
    choices: "trust",
    comparisons: "trust",
  };
  return pages.some((page) => page.id === requested)
    ? requested
    : aliases[requested] || "overview";
};
const filterLabels: Record<string, string> = {
  yas: "Yaş qrupu",
  mesguliyyet: "Məşğuliyyət",
  sahe: "Sahə",
  ai_istifade: "AI istifadə statusu",
};
const panelHelp: Record<string, string> = {
  "Ən çox istifadə olunan AI alətləri":
    "Hər faiz AI-dan istifadə edən respondentlərin neçə faizinin həmin aləti seçdiyini göstərir. Bir respondent bir neçə alət seçə bilər; faizlər 100%-dən çox toplana bilər. Bu, bazar payı deyil.",
  "AI istifadəsinin bölgüsü":
    "Bütün respondentlərin AI istifadə statusu. “Bəli” hazırda süni intellektdən istifadə etdiyini bildirən respondentlərdir.",
  "Sorğudan əsas müşahidələr":
    "Davranış sualları AI-dan istifadə edən respondentlər, ödəniş istəyi isə bütün respondentlər üzrə hesablanır. Hər sətrin say və bazasına baxın; bunlar respondentlərin öz cavablarıdır.",
  "Tədqiqat haqqında":
    "Mənbədəki ümumi nümunə filtrlənmiş nümunədən fərqlənə bilər. Son cavab mənbədəki ən yeni sorğu tarixidir; səhifənin son açılma vaxtı deyil.",
  "AI cavablarına etibar":
    "1 aşağı, 5 yüksək etibardır. Orta bal yalnız 1–5 aralığındakı etibarlı rəqəmli cavablardan hesablanır. Etibar AI cavablarının faktiki düzgünlüyü deyil.",
  "Yaş qrupları üzrə AI istifadəsi":
    "Hər faiz həmin yaş qrupundakı respondentlərin payıdır, bütün sorğunun payı deyil. Kiçik nümunələri birləşdirmək üçün 35–44 və 45+ qrupları 35+ kimi göstərilir.",
  "Sahələr üzrə orta etibar":
    "Hər sahədə etibarlı rəqəmli cavabların ortasıdır. Qrup ölçüləri fərqlidir. Bu sıralama statistik əhəmiyyət və ya bütün sahə barədə nəticə demək deyil.",
  "Alətlərin tam müqayisəsi":
    "Say hər aləti seçmiş fərqli respondentlərin sayıdır. Məxrəc AI-dan istifadə edən respondentlərdir (n=108). Axtarış yalnız bu cədvəli daraldır, səhifənin əsas bazasını dəyişmir.",
};
function Logo({ name, large = false }: { name: string; large?: boolean }) {
  const m = meta[name];
  return (
    <span className={`tool-logo ${large ? "large" : ""}`}>
      {m ? (
        <img src={`/logos/${m.file}.svg`} alt="" />
      ) : (
        <BarChart3 size={20} />
      )}
    </span>
  );
}
function TipButton({
  label,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" aria-label={label} {...props}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
function Panel({
  title,
  subtitle,
  icon: Icon,
  children,
  className = "",
  action,
  help,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  help?: React.ReactNode;
}) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-heading">
        <div className="panel-title-wrap">
          {Icon && (
            <span className="section-icon">
              <Icon size={18} />
            </span>
          )}
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>
        <div className="panel-actions">
          {action}
          {(help || panelHelp[title]) && (
            <InfoBubble label={title}>{help || panelHelp[title]}</InfoBubble>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
function Empty({ text = "Bu seçim üçün cavab yoxdur." }: { text?: string }) {
  return (
    <div className="empty">
      <Database size={27} />
      <p>{text}</p>
    </div>
  );
}
const questionGroups: Record<string, string[]> = {
  overview: ["ai_istifade", "yas", "cins", "mesguliyyet", "sahe"],
  tools: ["tools", "purposes", "tezlik", "muddet", "odenisli"],
  trust: [
    "etibar",
    "gizledir",
    "oz_isi",
    "sexsi",
    "ai_siz_gun",
    "aqilli",
    "odeme_heveski",
    "hekim",
    "usaq",
    "dost",
  ],
};

function AllResponses({ data, page }: { data: Data; page: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState("");

  const fields = questionGroups[page] || [];

  const filteredFields = useMemo(() => {
    if (!search.trim()) return fields;
    const query = search.toLowerCase().trim();
    return fields.filter((field) => {
      const meta = data.questionMeta[field];
      if (!meta) return false;
      const questionMatch = meta.question.toLowerCase().includes(query);
      const optionsMatch = (data.distributions[field] || []).some((r) =>
        r.label.toLowerCase().includes(query),
      );
      return questionMatch || optionsMatch;
    });
  }, [fields, data, search]);

  return (
    <section
      className="all-responses-section"
      aria-label="Bütün cavablar və detallı bölgü"
    >
      <button
        type="button"
        className={`all-responses-toggle ${isOpen ? "all-responses-toggle--open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="all-responses-toggle__left">
          <span className="all-responses-icon">
            <Layers size={20} />
          </span>
          <div>
            <div className="all-responses-title-row">
              <h3>Bütün cavablar və detallı bölgü</h3>
              <span className="all-responses-badge">{fields.length} sual</span>
            </div>
            <p className="all-responses-subtitle">
              Sorğudakı hər sual üzrə respondentlərin tam cavab paylanması,
              saylar və faiz göstəriciləri.
            </p>
          </div>
        </div>

        <div className="all-responses-toggle__right">
          <span className="toggle-label">
            {isOpen ? "Bölməni bağla" : "Ətraflı göstər"}
          </span>
          <ChevronDown
            size={18}
            className={`toggle-chevron ${isOpen ? "toggle-chevron--rotated" : ""}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="all-responses-body">
          {/* Toolbar: Search input and question count */}
          <div className="all-responses-toolbar">
            <div className="all-responses-search">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Suallarda və ya cavablarda axtar..."
                aria-label="Suallarda axtar"
              />
              {search && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearch("")}
                  aria-label="Axtarışı təmizlə"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="all-responses-count-badge">
              <span>{filteredFields.length} sual göstərilir</span>
            </div>
          </div>

          {/* Question Cards Grid */}
          {filteredFields.length > 0 ? (
            <div className="all-responses-grid">
              {filteredFields.map((field) => {
                const meta = data.questionMeta[field];
                const rows = data.distributions[field] || [];
                const originalIndex = fields.indexOf(field);
                const maxCount =
                  rows.length > 0 ? Math.max(...rows.map((r) => r.count)) : 0;

                return (
                  <article
                    className="response-card"
                    key={field}
                    data-question={field}
                  >
                    <header className="response-card__header">
                      <div className="response-card__top">
                        <span className="response-card__num">
                          #{String(originalIndex + 1).padStart(2, "0")}
                        </span>
                        <div className="response-card__tags">
                          <span className="tag tag--stat">
                            baza: n={meta.base} respondent · {meta.answered} cavab
                            {meta.missing > 0
                              ? ` · ${meta.missing} cavabsız`
                              : ""}
                          </span>
                          {meta.multiple && (
                            <span className="tag tag--multiple">
                              Çoxseçimli
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="response-card__title">{meta.question}</h4>
                    </header>

                    {rows.length > 0 ? (
                      <div className="response-card__bars">
                        {rows.map((row) => {
                          const isLeader =
                            maxCount > 0 && row.count === maxCount;
                          const displayLabel =
                            field === "etibar" &&
                            Number.isFinite(Number(row.label))
                              ? `${Number(row.label)} / 5 bal`
                              : row.label;

                          return (
                            <div
                              key={row.label}
                              className={`response-bar-row ${isLeader ? "response-bar-row--leader" : ""}`}
                            >
                              <div className="response-bar-row__meta">
                                <div className="response-bar-row__label-group">
                                  <span className="response-bar-row__label">
                                    {displayLabel}
                                  </span>
                                  {isLeader && (
                                    <span className="leader-pill">
                                      Lider seçim
                                    </span>
                                  )}
                                </div>
                                <div className="response-bar-row__numbers">
                                  <span className="response-bar-row__count">
                                    {row.count} / {row.base}
                                  </span>
                                  <span className="response-bar-row__percent">
                                    {pct(row.percent)}
                                  </span>
                                </div>
                              </div>

                              <div className="response-bar-row__track">
                                <div
                                  className={`response-bar-row__fill ${isLeader ? "response-bar-row__fill--leader" : ""}`}
                                  style={{
                                    width: `${Math.min(100, Math.max(0, row.percent))}%`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="response-card__empty">
                        <Database size={20} />
                        <p>Bu filtr parametri üçün cavab tapılmadı.</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="all-responses-empty">
              <Search size={28} />
              <h4>Axtarışa uyğun sual tapılmadı</h4>
              <p>
                &ldquo;{search}&rdquo; sorğusu üzrə heç bir sual və ya cavab
                variantı uyğun gəlmir.
              </p>
              <button
                type="button"
                className="reset-search-btn"
                onClick={() => setSearch("")}
              >
                Axtarışı sıfırla
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ToolCards({ rows }: { rows: Row[] }) {
  if (!rows.length) return <Empty />;
  return (
    <div className="podium-grid">
      {rows.slice(0, 3).map((row, index) => (
        <article className={`podium podium-${index}`} key={row.label}>
          <div className="podium-top">
            <span className="rank">
              {index === 0 ? "1-ci" : index === 1 ? "2-ci" : "3-cü"}
              <small>yer</small>
            </span>
            <span className="tag">Respondent seçimi</span>
          </div>
          <div className="podium-name">
            <Logo name={row.label} large />
            <div>
              <h2>{row.label}</h2>
              <p>{meta[row.label]?.company || "Digər alətlər"}</p>
            </div>
          </div>
          <strong className="podium-value">{pct(row.percent)}</strong>
          <p className="podium-base">
            {row.count} / {row.base} respondent
          </p>
        </article>
      ))}
    </div>
  );
}
function Bars({
  rows,
  tools = false,
  rating = false,
  multicolor = false,
}: {
  rows: Row[];
  tools?: boolean;
  rating?: boolean;
  multicolor?: boolean;
}) {
  if (!rows.length) return <Empty />;
  return (
    <div className={`bar-list ${tools ? "tool-bars" : ""}`}>
      {rows.map((r, i) => (
        <div className="bar-row" key={r.label}>
          {tools && <Logo name={r.label} />}
          <div className="bar-content">
            <div className="bar-label">
              <span>{r.label}</span>
              <strong>
                {rating ? `${fmt(r.score || 0, 2)} / 5` : pct(r.percent)}
              </strong>
            </div>
            <div className="bar-track">
              <div
                style={{
                  width: `${Math.min(100, rating ? (r.score || 0) * 20 : r.percent)}%`,
                  background: multicolor
                    ? colors[i % colors.length]
                    : undefined,
                }}
              />
            </div>
            <span className="bar-base">
              {rating
                ? `${r.count} etibarlı cavab · qrup: n=${r.base}`
                : `${r.count} cavab · baza: n=${r.base}`}
              {r.base < 10 ? " · kiçik nümunə" : ""}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
function Donut({
  rows,
  value,
  caption,
}: {
  rows: Row[];
  value: string;
  caption: string;
}) {
  const id = useId();
  const statusColor = (label: string) =>
    ({
      Bəli: "var(--lavender)",
      "Eşitmişəm, amma istifadə etməmişəm": "var(--mint)",
      Xeyr: "var(--amber)",
    })[label] || "var(--muted)";
  let offset = 0;
  const total = rows.reduce((s, r) => s + r.count, 0);
  return (
    <>
      <div className="donut-wrap">
        <svg viewBox="0 0 220 220" role="img" aria-labelledby={id}>
          <title id={id}>
            {caption}: {value}.{" "}
            {rows.map((r) => `${r.label}: ${r.count}`).join("; ")}
          </title>
          <circle
            cx="110"
            cy="110"
            r="84"
            fill="none"
            stroke="var(--track)"
            strokeWidth="20"
          />
          {rows.map((r, i) => {
            const length = total ? (r.count / total) * 527.79 : 0;
            const start = offset;
            offset += length;
            return (
              <circle
                key={r.label}
                cx="110"
                cy="110"
                r="84"
                fill="none"
                stroke={statusColor(r.label)}
                strokeWidth="20"
                strokeDasharray={`${Math.max(0, length - (length > 4 ? 3 : 0))} ${527.79 - Math.max(0, length - (length > 4 ? 3 : 0))}`}
                strokeDashoffset={-start}
                transform="rotate(-90 110 110)"
              />
            );
          })}
        </svg>
        <div className="donut-center">
          <strong>{value}</strong>
          <span>{caption}</span>
        </div>
      </div>
      <div className="legend">
        {rows.map((r, i) => (
          <div key={r.label}>
            <span className="legend-label">
              <i style={{ background: statusColor(r.label) }} />
              {r.label}
            </span>
            <span>
              {r.count} <small>({pct(r.percent)})</small>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
function Methodology({
  data,
  minimized = false,
}: {
  data: Data | null;
  minimized?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="method-button"
          aria-label="Metodologiya"
          title={minimized ? "Metodologiya" : undefined}
        >
          <BookOpen size={17} />{" "}
          <span className="method-label">Metodologiya</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="method-dialog">
        <DialogHeader>
          <DialogTitle>Sorğunu necə oxumalı?</DialogTitle>
          <DialogDescription>
            Nəticələrin bazası və tədqiqatın sərhədləri.
          </DialogDescription>
        </DialogHeader>
        <div className="method-copy">
          <h3>İki fərqli baza</h3>
          <p>
            Alət, məqsəd, tezlik, təcrübə, etibar və davranış sualları yalnız
            AI-dan istifadə etdiyini bildirən respondentlərə əsaslanır.
            Demoqrafiya, sosial seçimlər və ödəniş istəyi bütün respondentlər
            üzrə hesablanır. Filtrlər hər iki bazanı yeniləyir.
          </p>
          <h3>Çoxseçimli cavablar</h3>
          <p>
            Alət və məqsəd suallarında bir neçə seçim mümkündür. Eyni şəxsin
            eyni seçimi yalnız bir dəfə sayılır. Buna görə faizlərin cəmi
            100%-dən çox ola bilər.
          </p>
          <h3>Nümunənin sərhədləri</h3>
          <p>
            Bu sorğu iştirakçıların öz cavablarını göstərir. Təsadüfi seçilmiş
            milli nümunə olduğu təsdiqlənməyib; nəticələr bütün Azərbaycan
            əhalisinə şamil edilmir. 10-dan az cavabı olan qrupları ehtiyatla
            şərh edin.
          </p>
          <h3>Etibar balı və məxfilik</h3>
          <p>
            Orta etibar yalnız etibarlı rəqəmli cavablar üzrə hesablanır.
            Cavabsız seçimlər ayrıca göstərilir. Brauzerə fərdi respondent
            qeydləri göndərilmir; CSV hesabatı ümumiləşdirilmiş nəticələri
            ehtiva edir.
          </p>
          <div className="method-source">
            <Database size={17} />
            {data?.source || "CSV"} · {data?.sourceTotal ?? "—"} cavab · son
            cavab: {data?.lastUpdate || "—"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<Data | null>(() => {
    try {
      return computeDashboardData() as unknown as Data;
    } catch {
      return null;
    }
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [minimized, setMinimized] = useState(() => {
    try {
      return localStorage.getItem("ai-sidebar") === "minimized";
    } catch {
      return false;
    }
  });
  const lastRefresh = useRef(0);
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  const activePage = pages.find((p) => p.id === page)!;
  const activeOnlyPage = page === "tools";
  useEffect(() => {
    try {
      localStorage.setItem("ai-sidebar", minimized ? "minimized" : "expanded");
    } catch {}
  }, [minimized]);
  const applied = Object.values(filters).filter(Boolean).length;
  const query = useMemo(
    () =>
      new URLSearchParams(
        Object.entries(filters).filter(([, v]) => v),
      ).toString(),
    [filters],
  );
  useEffect(() => {
    const onHash = () => {
      setPage(initialPage());
      setMobileNav(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    if (!mobileNav) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    (document.querySelector(".close-nav") as HTMLElement)?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileNav(false);
      if (event.key === "Tab") {
        const elements = [
          ...document.querySelectorAll<HTMLElement>(
            ".sidebar a, .sidebar button",
          ),
        ].filter((el) => el.getClientRects().length);
        const first = elements[0],
          last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [mobileNav]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", dark ? "#090912" : "#f8fafc");
    try {
      localStorage.setItem("ai-theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);
  useEffect(() => {
    const controller = new AbortController();
    setBusy(true);
    setError("");
    const forceRefresh = lastRefresh.current !== reload;
    lastRefresh.current = reload;
    fetch(`/api/dashboard?${query}${forceRefresh ? "&refresh=1" : ""}`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok)
          throw new Error(
            "Server cavab vermədi, lokal məlumat bazasından istifadə edilir.",
          );
        return r.json();
      })
      .then((remoteData) => {
        setData(remoteData);
        setError("");
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        // Graceful fallback to client-side survey engine
        try {
          const fallbackData = computeDashboardData(filters);
          setData(fallbackData as unknown as Data);
          setError("");
        } catch (fallbackErr) {
          setError(
            "Məlumatlar yüklənmədi. Mənbəni yoxlayıb yenidən cəhd edin.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setBusy(false);
      });
    return () => controller.abort();
  }, [query, reload, filters]);
  const navigate = (id: string) => {
    location.hash = id;
    setMobileNav(false);
  };
  const handleExport = (e: React.MouseEvent) => {
    if (data) {
      e.preventDefault();
      try {
        const csvStr = generateExportCsv(data as unknown as DashboardData);
        const blob = new Blob(["\uFEFF" + csvStr], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const filterSuffix = query
          ? "_" + query.replace(/[^a-zA-Z0-9]/g, "_")
          : "";
        a.download = `ai_istifadesi_hesabat${filterSuffix}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch {
        window.location.href = `/api/export?${query}`;
      }
    }
  };

  return (
    <TooltipProvider delayDuration={250} skipDelayDuration={400}>
      <a className="skip-link" href="#content">
        Məzmunu keç
      </a>
      <div className="app-frame">
        {mobileNav && (
          <button
            className="nav-scrim"
            onClick={() => setMobileNav(false)}
            aria-label="Menyunu bağla"
          />
        )}
        <aside
          className={`sidebar ${mobileNav ? "open" : ""} ${minimized ? "sidebar--minimized" : ""}`}
        >
          <a
            href="#overview"
            className="brand"
            aria-label="AI İstifadəsi, ümumi baxış"
          >
            <span className="brand-mark">
              <BarChart3 size={23} strokeWidth={2.4} />
            </span>
            <span className="brand-name">
              AI İstifadəsi
              <span className="brand-caption">Sorğu analitikası</span>
            </span>
          </a>
          <TipButton
            className="sidebar-toggle"
            label={minimized ? "Yan paneli genişləndir" : "Yan paneli kiçilt"}
            aria-expanded={!minimized}
            onClick={() => setMinimized((value) => !value)}
          >
            {minimized ? (
              <PanelLeftOpen size={17} />
            ) : (
              <PanelLeftClose size={17} />
            )}
            <span>Paneli kiçilt</span>
          </TipButton>
          <button
            className="close-nav"
            aria-label="Menyunu bağla"
            onClick={() => setMobileNav(false)}
          >
            <X />
          </button>
          <nav aria-label="Əsas naviqasiya">
            {pages.map((p) => (
              <Tooltip key={p.id}>
                <TooltipTrigger asChild>
                  <a
                    href={`#${p.id}`}
                    aria-label={p.label}
                    aria-current={page === p.id ? "page" : undefined}
                    onClick={() => setMobileNav(false)}
                  >
                    <p.icon size={18} />
                    <span className="nav-label">{p.label}</span>
                    {p.id === "overview" && <span className="nav-dot" />}
                  </a>
                </TooltipTrigger>
                {minimized && (
                  <TooltipContent side="right" sideOffset={12}>
                    {p.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <Methodology data={data} minimized={minimized} />
            <div className="sidebar-source">
              <span className="status-dot" />{" "}
              <span className="source-label">Sorğu nəticələri</span>{" "}
              <span>v2.1</span>
            </div>
          </div>
        </aside>
        <div className="workspace" inert={mobileNav}>
          <header className="topbar">
            <div className="breadcrumb">
              <Button
                className="mobile-menu"
                variant="ghost"
                size="icon"
                onClick={() => setMobileNav(true)}
                aria-label="Menyunu aç"
              >
                <Menu size={20} />
              </Button>
              <span>Analitik panel</span>
              <span className="slash">/</span>
              <strong>{activePage.label}</strong>
            </div>
            <div className="top-actions">
              <TipButton
                label={dark ? "İşıqlı rejimə keç" : "Qaranlıq rejimə keç"}
                onClick={() => setDark(!dark)}
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </TipButton>
              <TipButton
                label="Məlumatları yenilə"
                disabled={busy}
                onClick={() => setReload((v) => v + 1)}
              >
                <RefreshCw size={17} className={busy ? "spin" : ""} />
              </TipButton>
              <Button className="export-button" onClick={handleExport} asChild>
                <a
                  href={`/api/export?${query}`}
                  download
                  aria-label="CSV hesabatı"
                  onClick={handleExport}
                >
                  <ArrowDownToLine size={16} />
                  <span>CSV hesabatı</span>
                </a>
              </Button>
            </div>
          </header>
          <main id="content">
            <div className="page-heading">
              <div>
                <h1>{activePage.label}</h1>
                <p>{activePage.subtitle}</p>
              </div>
              <Button
                variant="outline"
                className={applied ? "filter-button active" : "filter-button"}
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                aria-controls="filters"
              >
                <Filter size={16} />
                Filtrlər
                {applied > 0 && <span className="filter-count">{applied}</span>}
                <ChevronDown size={14} />
              </Button>
            </div>
            {showFilters && (
              <section
                className="filter-panel"
                id="filters"
                aria-label="Sorğu filtrləri"
              >
                {[
                  ["yas", "Yaş qrupu"],
                  ["mesguliyyet", "Məşğuliyyət"],
                  ["sahe", "Sahə"],
                  ["ai_istifade", "AI istifadə statusu"],
                ].map(([key, label]) => (
                  <label key={key}>
                    {label}
                    <StyledSelect
                      label={label}
                      value={filters[key] || ""}
                      onChange={(value) =>
                        setFilters((f) => ({ ...f, [key]: value }))
                      }
                      options={(data?.options[key] || []).map((value) => ({
                        value,
                        label: value,
                      }))}
                      all
                    />
                  </label>
                ))}
                <InfoBubble label="Filtrlər necə işləyir?">
                  Bu dörd filtr bütün səhifələrin məlumatlarını və CSV
                  hesabatını birlikdə dəyişir. Baza seçilmiş respondentlərdir;
                  müvafiq suallar AI istifadə edən respondentlərin payını
                  göstərir. Bir neçə filtr birlikdə tətbiq olunur. Sıfırla bütün
                  seçimləri silir.
                </InfoBubble>
                <Button
                  variant="ghost"
                  disabled={!applied}
                  onClick={() => setFilters({})}
                >
                  <X size={15} />
                  Sıfırla
                </Button>
              </section>
            )}
            <div className="live-region" role="status" aria-live="polite">
              {busy
                ? "Məlumatlar yüklənir…"
                : error
                  ? ""
                  : `${data?.kpis.n_total || 0} cavab göstərilir.`}
            </div>
            {error ? (
              <div className="error-state" role="alert">
                <CircleHelp size={32} />
                <h2>Məlumat əldə edilə bilmədi</h2>
                <p>{error}</p>
                <Button onClick={() => setReload((v) => v + 1)}>
                  <RefreshCw size={16} />
                  Yenidən cəhd et
                </Button>
              </div>
            ) : !data ? (
              <div className="loading-state">
                <Loader2 className="spin" size={28} />
                <p>Sorğu nəticələri yüklənir…</p>
              </div>
            ) : (
              <div
                aria-busy={busy}
                className={busy ? "data-content is-loading" : "data-content"}
              >
                {applied > 0 && (
                  <div className="filter-summary">
                    <span>
                      <Filter size={14} />
                      {data.kpis.n_total} / {data.sourceTotal} cavab seçilib
                    </span>
                    <button onClick={() => setFilters({})}>
                      Bütün filtrləri sil <X size={13} />
                    </button>
                  </div>
                )}
                {applied > 0 && (
                  <div
                    className="active-filter-chips"
                    aria-label="Aktiv filtrlər"
                  >
                    {Object.entries(filters)
                      .filter(([, value]) => value)
                      .map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() =>
                            setFilters((previous) => ({
                              ...previous,
                              [key]: "",
                            }))
                          }
                          aria-label={`${filterLabels[key]} filtrini sil: ${value}`}
                        >
                          <span>
                            {filterLabels[key]}: <strong>{value}</strong>
                          </span>
                          <X size={13} />
                        </button>
                      ))}
                  </div>
                )}
                <div className="scope-strip">
                  <span>
                    <Users size={14} />
                    {activeOnlyPage
                      ? `${data.kpis.n_ai} respondent (AI istifadə edən)`
                      : `${data.kpis.n_total} respondent`}{" "}
                    bu görünüşün əsas bazasıdır.
                  </span>
                  <InfoBubble label="Baza nədir?">
                    Baza faizin hesablandığı respondent sayıdır. Məsələn, 54 /
                    108 = 50%. Bu seçimdə cəmi {data.kpis.n_total} respondent və
                    onların içində {data.kpis.n_ai} nəfər AI istifadə edən var.
                    Müxtəlif bazalara aid faizləri toplamaq və ya eyni insan
                    sayları kimi oxumaq olmaz.
                  </InfoBubble>
                </div>
                {activeOnlyPage &&
                  data.kpis.n_total > 0 &&
                  data.kpis.n_ai === 0 && (
                    <div className="sample-warning">
                      <CircleHelp size={17} />
                      <span>
                        Seçilmiş nümunədə AI istifadə edən respondent yoxdur.
                        Bu bölmənin sualları yalnız AI-dan istifadə etdiyini
                        bildirən respondentlərə ünvanlanıb.
                      </span>
                      <button
                        onClick={() =>
                          setFilters((previous) => ({
                            ...previous,
                            ai_istifade: "",
                          }))
                        }
                      >
                        AI status filtrini sil
                      </button>
                    </div>
                  )}
                {data.kpis.n_total < 10 && (
                  <div className="sample-warning">
                    <CircleHelp size={17} />
                    {data.kpis.n_total === 0
                      ? "Bu filtrlərə uyğun cavab yoxdur. Filtrləri dəyişin və ya sıfırlayın."
                      : "Kiçik nümunə: 10-dan az cavab var. Nəticələri ehtiyatla şərh edin."}
                  </div>
                )}
                {page === "overview" && (
                  <>
                    <div className="metrics">
                      <Metric
                        icon={Users}
                        label="Sorğu iştirakçıları"
                        value={`${data.kpis.n_total}`}
                        detail="Bütün seçilmiş respondentlər"
                        badge="Nümunə"
                        tone="lavender"
                      />
                      <Metric
                        icon={Activity}
                        label="AI istifadə edənlər"
                        value={data.kpis.n_total ? pct(data.kpis.ai_pct) : "—"}
                        detail={`${data.kpis.n_ai} / ${data.kpis.n_total} respondent`}
                        badge="İstifadə"
                        tone="mint"
                      />
                      <Metric
                        icon={ShieldCheck}
                        label="Orta etibar balı"
                        value={
                          data.trustAnswers ? fmt(data.kpis.avg_trust, 2) : "—"
                        }
                        suffix="/ 5"
                        detail={`${data.trustAnswers} respondentin qiymətləndirməsi`}
                        badge="Etibar"
                        tone="amber"
                      />
                    </div>
                    <div className="presentation-grid">
                      <Panel
                        title="AI istifadəsinin bölgüsü"
                        subtitle={`Bütün respondentlər · n=${data.kpis.n_total}`}
                        icon={Activity}
                      >
                        {data.kpis.n_total ? (
                          <Donut
                            rows={data.distributions.ai_istifade}
                            value={pct(data.kpis.ai_pct)}
                            caption="AI istifadə edir"
                          />
                        ) : (
                          <Empty />
                        )}
                      </Panel>
                      <Panel
                        title="İki əsas müşahidə"
                        subtitle="Sorğunun gündəlik istifadə və ödəniş nəticələri"
                        icon={FileBarChart2}
                      >
                        <div className="presentation-facts">
                          <div>
                            <strong>
                              {data.kpis.n_ai
                                ? pct(
                                    (data.analyses.summary.daily /
                                      data.kpis.n_ai) *
                                      100,
                                  )
                                : "—"}
                            </strong>
                            <h3>Hər gün AI istifadə edir</h3>
                            <p>
                              {data.analyses.summary.daily} / {data.kpis.n_ai}{" "}
                              respondent · gündə bir və ya bir neçə dəfə.
                            </p>
                          </div>
                          <div>
                            <strong>
                              {data.kpis.n_total
                                ? pct(
                                    ((data.distributions.odeme_heveski.find(
                                      (row) => row.label === "0 AZN",
                                    )?.count || 0) /
                                      data.kpis.n_total) *
                                      100,
                                  )
                                : "—"}
                            </strong>
                            <h3>AI üçün ödəniş etmək istəmir</h3>
                            <p>
                              {data.distributions.odeme_heveski.find(
                                (row) => row.label === "0 AZN",
                              )?.count || 0}{" "}
                              / {data.kpis.n_total} respondent · aylıq büdcə
                              olaraq 0 AZN seçib.
                            </p>
                          </div>
                        </div>
                      </Panel>
                    </div>
                    <p className="presentation-note">
                      {data.analyses.dominantAge && (
                        <>
                          {data.analyses.dominantAge.count} /{" "}
                          {data.analyses.dominantAge.base} respondent{" "}
                          {data.analyses.dominantAge.label} yaş
                          qrupundadır.{" "}
                        </>
                      )}
                      Bu sorğu iştirakçılarının nəticələridir; bütün Azərbaycan
                      əhalisini təmsil etmir.
                    </p>
                  </>
                )}
                {page === "tools" && (
                  <>
                    <ToolCards rows={data.distributions.tools} />
                    <div className="presentation-grid tool-details-grid">
                      <Panel
                        title="Alətlərin tam müqayisəsi"
                        subtitle={`Bütün alət və kateqoriyalar · n=${data.kpis.n_ai} respondent`}
                        icon={BarChart3}
                        help={panelHelp["Ən çox istifadə olunan AI alətləri"]}
                      >
                        {data.distributions.tools.length ? (
                          <div className="table-scroll tool-comparison">
                            <table>
                              <thead>
                                <tr>
                                  <th scope="col">Alət</th>
                                  <th scope="col">Şirkət / kateqoriya</th>
                                  <th scope="col">Respondent sayı</th>
                                  <th scope="col">Seçim payı</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.distributions.tools.map((row) => (
                                  <tr key={row.label}>
                                    <th scope="row">
                                      <span className="table-tool">
                                        <Logo name={row.label} />
                                        {row.label}
                                      </span>
                                    </th>
                                    <td>
                                      {meta[row.label]?.company ||
                                        "Digər alətlər"}
                                    </td>
                                    <td>
                                      {row.count} / {row.base}
                                    </td>
                                    <td>
                                      <span className="table-share">
                                        <span className="mini-track">
                                          <i
                                            style={{ width: `${row.percent}%` }}
                                          />
                                        </span>
                                        {pct(row.percent)}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <Empty />
                        )}
                      </Panel>
                      <Panel
                        title="Əsas istifadə məqsədləri"
                        subtitle={`Ən çox seçilən 4 məqsəd · n=${data.kpis.n_ai}`}
                        icon={GraduationCap}
                        help="Bir respondent bir neçə məqsəd seçə bilər. Hər faiz AI-dan istifadə edən respondentlərin həmin məqsədi seçən hissəsidir."
                      >
                        <Bars rows={data.distributions.purposes.slice(0, 4)} />
                      </Panel>
                    </div>
                    <p className="presentation-note">
                      Hər iki sual çoxseçimlidir: eyni şəxs bir neçə alət və
                      məqsəd seçə bilər. Buna görə faizlərin cəmi 100%-dən çox
                      ola bilər.
                    </p>
                  </>
                )}
                {page === "trust" && (
                  <>
                    <div className="presentation-grid">
                      <Panel
                        title="AI cavablarına etibar"
                        subtitle={`${data.trustAnswers} etibarlı cavab · 1 aşağı, 5 yüksək etibar`}
                        icon={ShieldCheck}
                      >
                        <div className="trust-summary">
                          <strong>
                            {data.trustAnswers
                              ? fmt(data.kpis.avg_trust, 2)
                              : "—"}
                            <small> / 5</small>
                          </strong>
                          <span>Orta etibar balı</span>
                        </div>
                        <TrustChart rows={data.distributions.etibar} />
                        <details className="data-details">
                          <summary>Rəqəmləri göstər</summary>
                          <Bars rows={data.distributions.etibar} />
                        </details>
                      </Panel>
                      <Panel
                        title="İnsan, yoxsa AI?"
                        subtitle={`Bütün respondentlər · n=${data.kpis.n_total}`}
                        icon={HeartHandshake}
                        help="Həkim, müəllim və AI-a münasibət üç ayrı sualdır. Hər faizin bazası bütün seçilmiş respondentlərdir; bu üç nəticəni toplamaq olmaz."
                      >
                        <Bars
                          rows={[
                            ["hekim", "İnsan həkim", "İnsan həkimə inanır"],
                            ["usaq", "Müəllim", "Uşağı üçün müəllim seçir"],
                            ["dost", "Dost kimi", "AI-a dost kimi baxır"],
                          ]
                            .filter(() => data.kpis.n_total > 0)
                            .map(([field, answer, label]) => ({
                              ...(data.distributions[field].find(
                                (row) => row.label === answer,
                              ) || {
                                count: 0,
                                base: data.kpis.n_total,
                                percent: 0,
                              }),
                              label,
                            }))}
                        />
                      </Panel>
                    </div>
                    <p className="presentation-note">
                      Etibar balı yalnız AI-dan istifadə edən respondentlərə,
                      sosial seçimlər isə bütün respondentlərə əsaslanır. Etibar
                      AI cavablarının faktiki düzgünlüyünü ölçmür.
                    </p>
                  </>
                )}
                <AllResponses data={data} page={page} />
                <div className="presentation-nav">
                  <span>
                    {pages.findIndex((item) => item.id === page) + 1} /{" "}
                    {pages.length}
                  </span>
                  <div>
                    {page !== "overview" && (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          navigate(
                            pages[
                              pages.findIndex((item) => item.id === page) - 1
                            ].id,
                          )
                        }
                      >
                        Geri
                      </Button>
                    )}
                    {page !== "trust" && (
                      <Button
                        onClick={() =>
                          navigate(
                            pages[
                              pages.findIndex((item) => item.id === page) + 1
                            ].id,
                          )
                        }
                      >
                        Növbəti <ArrowRight size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
            <footer>
              <span>Azərbaycanda süni intellekt istifadəsi</span>
              <span>
                <ShieldCheck size={13} />
                Ümumiləşdirilmiş sorğu nəticələri
              </span>
              <button
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: matchMedia("(prefers-reduced-motion: reduce)")
                      .matches
                      ? "instant"
                      : "smooth",
                  })
                }
              >
                Yuxarı qayıt
              </button>
            </footer>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
function Metric({
  icon: Icon,
  label,
  value,
  suffix,
  detail,
  badge,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  suffix?: string;
  detail: string;
  badge: string;
  tone: string;
}) {
  return (
    <section className={`metric metric-${tone}`}>
      <div className="metric-top">
        <span className="metric-icon">
          <Icon size={20} />
        </span>
        <h2>{label}</h2>
        <InfoBubble label={label}>
          {label === "Sorğu iştirakçıları"
            ? "Cari filtrlərə uyğun respondent sayıdır. Bu sorğu təsadüfi milli nümunə kimi təsdiqlənməyib."
            : label === "AI istifadə edənlər"
              ? "AI alətlərindən istifadə sualına “Bəli” cavabını verənlərin bütün seçilmiş respondentlərə nisbətidir."
              : "1–5 etibar şkalasının yalnız etibarlı cavablar üzrə ədədi ortasıdır. 1 aşağı, 5 yüksək etibar deməkdir. Bu, AI cavablarının düzgünlük faizi deyil."}
        </InfoBubble>
        <span className="metric-badge">{badge}</span>
      </div>
      <div className="metric-value">
        {value}
        {suffix && <small>{suffix}</small>}
      </div>
      <p>{detail}</p>
      <div className="metric-decoration" aria-hidden="true" />
    </section>
  );
}
function TrustChart({ rows }: { rows: Row[] }) {
  if (!rows.length) return <Empty />;
  const ordered = [1, 2, 3, 4, 5].map((n) => ({
    label: `${n}`,
    count: rows.find((r) => Number(r.label) === n)?.count || 0,
  }));
  return (
    <div className="trust-chart">
      <ResponsiveContainer width="100%" height={210}>
        <BarChart
          data={ordered}
          margin={{ top: 12, right: 12, bottom: 0, left: -25 }}
        >
          <CartesianGrid vertical={false} stroke="var(--line)" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 12 }}
          />
          <ChartTooltip
            cursor={{ fill: "var(--track)" }}
            contentStyle={{
              background: "var(--popover)",
              color: "var(--text)",
              border: "1px solid var(--line)",
              borderRadius: 12,
            }}
            formatter={(value) => [`${value} cavab`, "Say"]}
            labelFormatter={(label) => `Etibar balı: ${label}`}
          />
          <Bar
            dataKey="count"
            fill="var(--lavender)"
            radius={[8, 8, 0, 0]}
            maxBarSize={44}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
