import {
  Activity,
  BarChart3,
  Layers3,
  Network,
  ShieldCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Data, Row } from "@/App";
import { InfoBubble } from "./InfoBubble";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const fmt = (n: number, digits = 1) =>
  n.toLocaleString("az-AZ", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
const palette = [
  "var(--lavender)",
  "var(--mint)",
  "var(--amber)",
  "var(--blue)",
  "var(--pink)",
  "var(--muted)",
];
function Section({
  title,
  sub,
  info,
  icon: Icon,
  children,
}: {
  title: string;
  sub: string;
  info: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="panel research-visual">
      <div className="panel-heading">
        <div className="panel-title-wrap">
          <span className="section-icon">
            <Icon size={18} />
          </span>
          <div>
            <h2>{title}</h2>
            <p>{sub}</p>
          </div>
        </div>
        <InfoBubble label={title}>{info}</InfoBubble>
      </div>
      {children}
    </section>
  );
}
function NoData() {
  return <p className="visual-empty">Bu qrafik üçün uyğun cavab yoxdur.</p>;
}

export function InsightStrip({ data }: { data: Data }) {
  const s = data.analyses.summary,
    ai = data.kpis.n_ai;
  return (
    <section
      className="insight-strip"
      aria-label="İstifadəçi vərdişlərinin xülasəsi"
    >
      {[
        {
          title: "Hər gün istifadə edir",
          count: s.daily,
          icon: Activity,
          help: "“Gündə bir neçə dəfə” və “Gündə bir dəfə” cavablarının cəmi. Baza: seçilmiş AI istifadəçiləri.",
        },
        {
          title: "Ödənişli planı var",
          count: s.paid,
          icon: Wallet,
          help: "Ödənişli versiya sualına “Bəli” cavabı verənlər. Ödəniş etmək istəyi ilə eyni göstərici deyil.",
        },
        {
          title: "İki və ya daha çox alət",
          count: s.multiTool,
          icon: Layers3,
          help: "Hər respondent üzrə təkrarsız alət kateqoriyalarının sayı. Şəkil/video alətləri və Digər ayrıca bir kateqoriya sayılır.",
        },
        {
          title: "4 və ya 5 etibar balı",
          count: s.highTrust,
          icon: ShieldCheck,
          help: "1–5 şkalasında 4 və ya 5 seçən AI istifadəçiləri. Bu, AI cavablarının faktiki düzgünlüyünü ölçmür.",
        },
      ].map((item) => (
        <div className="insight-fact" key={item.title}>
          <item.icon size={17} />
          <div>
            <span>
              {item.title}
              <InfoBubble label={item.title}>
                {item.help} n={ai}.
              </InfoBubble>
            </span>
            <strong>
              {ai ? `${fmt((item.count / ai) * 100)}%` : "—"}
              <small>
                {item.count} / {ai} nəfər
              </small>
            </strong>
          </div>
        </div>
      ))}
    </section>
  );
}

export function ToolBreadth({ data }: { data: Data }) {
  const rows = data.analyses.toolBreadth;
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <Section
      title="Bir istifadəçi neçə alət seçir?"
      sub={`AI istifadəçiləri · n=${data.kpis.n_ai} · orta: ${data.kpis.n_ai ? fmt(data.analyses.summary.averageTools || 0) : "—"} kateqoriya`}
      icon={Layers3}
      info="Hər sütun göstərilən sayda fərqli alət kateqoriyası seçmiş insanları göstərir. Alət adları bir respondent daxilində təkrarsız sayılır; Şəkil/video və Digər ayrıca kateqoriyalardır."
    >
      {!rows.length ? (
        <NoData />
      ) : (
        <>
          <div
            className="histogram"
            style={{
              gridTemplateColumns: `repeat(${rows.length},minmax(0,1fr))`,
            }}
          >
            {rows.map((r) => (
              <div className="histogram-column" key={r.label}>
                <div className="histogram-plot">
                  <div
                    className="histogram-bar"
                    style={{ height: `${(r.count / max) * 100}%` }}
                  >
                    <strong>{r.count}</strong>
                  </div>
                </div>
                <span>{r.label}</span>
                <small>{fmt(r.percent)}%</small>
              </div>
            ))}
          </div>
          <p className="visual-caption">
            Sütun hündürlüyü respondent sayını göstərir. Faizlərin cəmi
            100%-dir.
          </p>
        </>
      )}
    </Section>
  );
}

export function CoUsage({ data }: { data: Data }) {
  const co = data.analyses.coUsage;
  const name = (label: string) =>
    label === "Şəkil və video alətləri" ? "Şəkil / video" : label;
  return (
    <Section
      title="Birlikdə seçilən alətlər"
      sub={`Ən çox seçilən 6 kateqoriya · baza: ${co.base} AI istifadəçisi`}
      icon={Network}
      info="Hər kəsişmə hər iki aləti seçmiş respondentlərin sayıdır. İkiqat sayma yoxdur. Diaqonal xanalar alətin ümumi istifadəçi sayıdır; faiz bütün seçilmiş AI istifadəçilərinə görə hesablanır. Bu, tətbiqlər arasında keçidi və ya inteqrasiyanı göstərmir."
    >
      {!co.labels.length ? (
        <NoData />
      ) : (
        <>
          <div className="matrix-scroll">
            <table className="co-matrix">
              <caption className="sr-only">
                Eyni respondent tərəfindən birlikdə seçilən alətlər
              </caption>
              <thead>
                <tr>
                  <th scope="col">Alət</th>
                  {co.labels.map((label) => (
                    <th scope="col" key={label}>
                      {name(label)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {co.labels.map((label, i) => (
                  <tr key={label}>
                    <th scope="row">{name(label)}</th>
                    {co.labels.map((other, j) => (
                      <td key={other}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={
                                i === j ? "matrix-cell diagonal" : "matrix-cell"
                              }
                              style={{
                                background: `color-mix(in srgb,var(--lavender) ${co.base ? 6 + (co.counts[i][j] / co.base) * 28 : 0}%,var(--panel))`,
                              }}
                              aria-label={`${label}${i === j ? " cəmi" : ` və ${other}`}: ${co.counts[i][j]} / ${co.base}`}
                            >
                              <strong>{co.counts[i][j]}</strong>
                              <small>
                                {i === j
                                  ? "cəmi"
                                  : `${fmt(co.base ? (co.counts[i][j] / co.base) * 100 : 0)}%`}
                              </small>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {label}
                            {i === j ? " cəmi" : ` + ${other}`}:{" "}
                            {co.counts[i][j]} / {co.base} nəfər
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="visual-caption">
            Daha güclü lavanda rəngi daha çox ortaq seçim deməkdir. Eyni cütlük cədvəlin
            hər iki tərəfində görünür; onları toplamayın.
          </p>
        </>
      )}
    </Section>
  );
}

export function OccupationUsage({ data }: { data: Data }) {
  const statuses = [
    "İstifadə edir",
    "Eşidib, istifadə etməyib",
    "İstifadə etmir",
  ];
  return (
    <Section
      title="Məşğuliyyətə görə AI istifadəsi"
      sub="Hər zolaq bir məşğuliyyət qrupunun 100%-idir."
      icon={Users}
      info="Faiz həmin məşğuliyyət qrupunun daxilində hesablanır. Müxtəlif ölçülü qrupların saylarını birbaşa müqayisə etmək olmaz. Bu fərqlər səbəb-nəticə əlaqəsini sübut etmir."
    >
      {!data.analyses.occupationUsage.length ? (
        <NoData />
      ) : (
        <>
          <div className="stack-legend">
            {statuses.map((label, i) => (
              <span key={label}>
                <i style={{ background: palette[i] }} />
                {label}
              </span>
            ))}
          </div>
          <div className="group-stack-list">
            {data.analyses.occupationUsage.map((group) => (
              <div key={group.label}>
                <div className="group-stack-heading">
                  <span>{group.label}</span>
                  <small>
                    n={group.base}
                    {group.base < 10 ? " · kiçik nümunə" : ""}
                  </small>
                </div>
                <div
                  className="group-stack"
                  role="img"
                  aria-label={group.counts
                    .map(
                      (count, i) => `${statuses[i]}: ${count} / ${group.base}`,
                    )
                    .join("; ")}
                >
                  {group.counts.map(
                    (count, i) =>
                      count > 0 && (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <button
                              style={{
                                width: `${(count / group.base) * 100}%`,
                                background: palette[i],
                              }}
                              aria-label={`${statuses[i]}: ${count} / ${group.base}, ${fmt((count / group.base) * 100)}%`}
                            >
                              {count / group.base > 0.16
                                ? `${fmt((count / group.base) * 100, 0)}%`
                                : ""}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {statuses[i]}: {count} / {group.base} (
                            {fmt((count / group.base) * 100)}%)
                          </TooltipContent>
                        </Tooltip>
                      ),
                  )}
                </div>
                <div className="group-stack-values">
                  {group.counts.map((count, i) => (
                    <span key={i}>
                      <i style={{ background: palette[i] }} />
                      {count} nəfər · {fmt((count / group.base) * 100)}%
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Section>
  );
}

export function TrustComparison({
  rows,
  title,
  sub,
}: {
  rows: Row[];
  title: string;
  sub: string;
}) {
  return (
    <Section
      title={title}
      sub={sub}
      icon={ShieldCheck}
      info="Nöqtə qrupun 1–5 şkalasındakı orta etibarını göstərir. n yalnız etibarlı rəqəmli cavablardır. Xətt etibar intervalı deyil; şkalanın bələdçisidir. Qruplar arasındakı fərq statistik əhəmiyyət və ya səbəb-nəticə iddiası deyil."
    >
      {!rows.length ? (
        <NoData />
      ) : (
        <>
          <div className="dot-scale">
            <span>1 aşağı · 5 yüksək etibar</span>
            <div>
              {[1, 2, 3, 4, 5].map((value) => (
                <span key={value}>{value}</span>
              ))}
            </div>
            <span>Orta bal</span>
          </div>
          <div className="dot-list">
            {rows.map((row) => (
              <div className="dot-row" key={row.label}>
                <div>
                  <span>{row.label}</span>
                  <small>
                    n={row.count}
                    {row.count < 10 ? " · kiçik nümunə" : ""}
                  </small>
                </div>
                <div
                  className="dot-track"
                  role="img"
                  aria-label={`${row.label}: ${fmt(row.score || 0, 2)} / 5, ${row.count} cavab`}
                >
                  <i
                    style={{ left: `${(((row.score || 1) - 1) / 4) * 100}%` }}
                  />
                </div>
                <strong>
                  {fmt(row.score || 0, 2)}
                  <small> / 5</small>
                </strong>
              </div>
            ))}
          </div>
          <p className="visual-caption">
            Nöqtə orta baldır; xətt 1–5 şkalasıdır, etibar intervalı deyil.
            Qrupların fərqi təsviridir. 10-dan az cavabı olan qruplar ayrıca
            işarələnib.
          </p>
        </>
      )}
    </Section>
  );
}

export function SocialComparison({ data }: { data: Data }) {
  return (
    <Section
      title="AI istifadəçiləri və digər respondentlər"
      sub="Hər faiz öz qrupunun daxilində hesablanır."
      icon={BarChart3}
      info="AI istifadə edənlər “Bəli” seçənlərdir. Digər respondentlər “Xeyr” və “Eşitmişəm, amma istifadə etməmişəm” cavablarını birləşdirir. Bunlar qruplar arasındakı təsviri fərqlərdir; istifadə etməyin münasibəti dəyişdirdiyini sübut etmir."
    >
      {!data.kpis.n_total ? (
        <NoData />
      ) : (
        <div className="social-comparisons">
          {data.analyses.socialByUse.map((item) => (
            <div key={item.field}>
              <h3>{item.title}</h3>
              {item.rows.map((row, i) => (
                <div className="social-row" key={row.label}>
                  <span>
                    <i style={{ background: palette[i] }} />
                    {row.label}
                    <small>
                      n={row.base}
                      {row.base < 10 ? " · kiçik nümunə" : ""}
                    </small>
                  </span>
                  <div className="bar-track">
                    <div
                      style={{
                        width: `${row.percent}%`,
                        background: palette[i],
                      }}
                    />
                  </div>
                  <strong>
                    {row.base ? `${fmt(row.percent)}%` : "—"}
                    <small>
                      {row.count} / {row.base}
                    </small>
                  </strong>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

export function StackedDistribution({ rows }: { rows: Row[] }) {
  if (!rows.length) return <NoData />;
  return (
    <div className="choice-distribution">
      <div
        className="choice-stack"
        role="img"
        aria-label={rows
          .map(
            (row) =>
              `${row.label}: ${row.count} / ${row.base}, ${fmt(row.percent)}%`,
          )
          .join("; ")}
      >
        {rows.map((row, i) => (
          <div
            key={row.label}
            style={{
              width: `${row.percent}%`,
              background: palette[i % palette.length],
            }}
          />
        ))}
      </div>
      <div className="choice-legend">
        {rows.map((row, i) => (
          <div key={row.label}>
            <i style={{ background: palette[i % palette.length] }} />
            <span>
              {row.label}
              <small>
                {row.count} / {row.base} nəfər
              </small>
            </span>
            <strong>{fmt(row.percent)}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
