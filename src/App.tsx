import {
  ArrowRight,
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Download,
  HardHat,
  House,
  MapPin,
  Mountain,
  Phone,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Train,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type UnitKey = "84A" | "84E" | "98" | "101";
type LeadSubmission = {
  id: string;
  name: string;
  phone: string;
  type: string;
  visitDate?: string;
  visitTime?: string;
  createdAt: string;
  source: string;
};

type LeadInput = {
  name: string;
  phone: string;
  type: string;
  visitDate: string;
  visitTime: string;
};

type VisitTimeOption = {
  value: string;
  label: string;
  status?: string;
  disabled?: boolean;
};

const navItems = [
  { label: "사업안내", href: "#summary" },
  { label: "입지안내", href: "#premium" },
  { label: "단지안내", href: "#life" },
  { label: "세대안내", href: "#unit" },
  { label: "분양안내", href: "#lead" },
  { label: "고객센터", href: "#lead" },
];

const heroStats = [
  { value: "228", label: "총 세대수", detail: "속초 최대규모 테라스 하우스", icon: Building2 },
  { value: "15", label: "총 동수", detail: "지하2층~지상4층", icon: House },
  { value: "84~101㎡", label: "주택형", detail: "실속형부터 대형 평면까지", icon: Compass },
  { value: "속초IC 약 1km", label: "교통특권", detail: "광역 접근성 강화", icon: Train },
];

const premiumCards = [
  {
    title: "교통특권",
    body: "속초IC 약 1km, 속초KTX 예정지 인접과 양양고속도로를 통한 광역 이동성",
    icon: Train,
  },
  {
    title: "에코특권",
    body: "3면 숲세권, 설악산 조망, 동해를 가까이 누리는 희소한 주거 환경",
    icon: Mountain,
  },
  {
    title: "생활특권",
    body: "이마트, 속초문화예술회관, 의료원, 학교 등 풍부한 생활 인프라",
    icon: MapPin,
  },
  {
    title: "설계특권",
    body: "남향 위주 배치와 복층·루프탑·썬큰 테라스 일부세대 특화 설계",
    icon: House,
  },
];

const valueCards = [
  {
    title: "쾌속 교통망",
    body: "속초IC, KTX, 동해북부선 기대감이 더하는 미래 교통 프리미엄",
    image: "/assets/Rapid transportation network.png",
  },
  {
    title: "설악 힐링 입지",
    body: "설악산과 동해가 가까운 입지에서 누리는 사계절 휴식",
    image: "/assets/sea-mountain-panorama.jpg?v=20260526094252",
  },
  {
    title: "테라스하우스 특화",
    body: "복층·루프탑·썬큰 테라스가 완성하는 여유로운 주거 경험",
    image: "/assets/complex-wide.jpg",
  },
];

const lifeCards = [
  {
    title: "SPECIAL SPACE",
    body: "삶의 여유로움을 누리는 특별한 테라스와 다락 공간",
    image: "/assets/interior-overview.jpg",
  },
  {
    title: "COMMUNITY",
    body: "오직 228세대에게 허락된 고품격 커뮤니티 시설",
    image: "/assets/community-main.jpg",
  },
];

const unitPlans: Record<
  UnitKey,
  { label: string; title: string; body: string; households: string; image: string }
> = {
  "84A": {
    label: "84㎡ A",
    title: "편안함까지 빌트인한 세련된 공간",
    body: "테라스와 팬트리 중심의 실속형 평면으로 일상 동선과 수납 효율을 높였습니다.",
    households: "총 17세대",
    image: "/assets/unit-84a-plan.jpg",
  },
  "84E": {
    label: "84㎡ E",
    title: "취향을 더하는 다락 특화 평면",
    body: "다락 공간과 개성 있는 입체 동선으로 가족의 라이프스타일을 넓게 담습니다.",
    households: "총 46세대",
    image: "/assets/unit-84e-loft.jpg",
  },
  "98": {
    label: "98㎡",
    title: "심플한 모더니즘의 여유",
    body: "넓어진 주방과 거실, 팬트리 구성을 통해 깔끔한 생활감을 완성합니다.",
    households: "총 27세대",
    image: "/assets/unit-98-plan.jpg",
  },
  "101": {
    label: "101㎡",
    title: "라이프스타일에 맞춘 최적화 공간",
    body: "지상층과 지하층을 아우르는 입체 평면으로 프라이빗한 주거 가치를 제안합니다.",
    households: "A/B 타입",
    image: "/assets/unit-101-plan.jpg",
  },
};

const unitOrder: UnitKey[] = ["84A", "84E", "98", "101"];
const launchVideoUrl = "https://www.youtube.com/embed/zlkLa8TpfUI?autoplay=1&mute=1&playsinline=1&rel=0";
const inquiryPhone = "010-7939-7089";
const inquiryPhoneHref = `tel:${inquiryPhone.replace(/-/g, "")}`;
const naverMapUrl = "https://naver.me/xFLzjQKa";
const leadStorageKey = "sokcho-the228-leads";
const visitTimeOptions: VisitTimeOption[] = [
  { value: "10:00", label: "오전 10시" },
  { value: "11:00", label: "오전 11시" },
  { value: "12:00", label: "오후 12시" },
  { value: "13:00", label: "오후 1시" },
  { value: "14:00", label: "오후 2시" },
  { value: "15:00", label: "오후 3시" },
  { value: "16:00", label: "오후 4시" },
  { value: "17:00", label: "오후 5시" },
  { value: "18:00", label: "오후 6시" },
  { value: "19:00", label: "오후 7시" },
];

function readLocalLeads(): LeadSubmission[] {
  try {
    const raw = window.localStorage.getItem(leadStorageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalLeads(leads: LeadSubmission[]) {
  window.localStorage.setItem(leadStorageKey, JSON.stringify(leads));
}

async function fetchLeads(): Promise<LeadSubmission[]> {
  try {
    const response = await fetch("/api/leads");
    if (!response.ok) {
      throw new Error("API unavailable");
    }
    const data = await response.json();
    return Array.isArray(data.leads) ? data.leads : [];
  } catch {
    return readLocalLeads();
  }
}

async function saveLead(input: LeadInput): Promise<LeadSubmission> {
  try {
    const response = await fetch("/api/leads", {
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("API unavailable");
    }
    const data = await response.json();
    return data.lead;
  } catch {
    const lead: LeadSubmission = {
      ...input,
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
      source: "browser-storage",
    };
    writeLocalLeads([lead, ...readLocalLeads()]);
    return lead;
  }
}

async function clearLeads() {
  try {
    const response = await fetch("/api/leads", { method: "DELETE" });
    if (!response.ok) {
      throw new Error("API unavailable");
    }
  } finally {
    writeLocalLeads([]);
  }
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getTodayDateValue() {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().slice(0, 10);
}

function getVisitTimeLabel(value?: string) {
  return visitTimeOptions.find((option) => option.value === value)?.label ?? value ?? "";
}

function formatVisitDate(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

function formatVisitSchedule(lead: LeadSubmission) {
  const schedule = [formatVisitDate(lead.visitDate), getVisitTimeLabel(lead.visitTime)].filter(Boolean).join(" ");
  return schedule || "-";
}

function downloadCsv(leads: LeadSubmission[]) {
  const headers = ["접수일시", "이름", "연락처", "방문 일정", "관심 타입", "저장 위치"];
  const rows = leads.map((lead) => [
    formatDateTime(lead.createdAt),
    lead.name,
    lead.phone,
    formatVisitSchedule(lead),
    lead.type,
    lead.source,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `sokcho-the228-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function scrollToHash(hash: string) {
  const element = document.querySelector(hash);
  element?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="속초 중앙하이츠 THE 228 홈">
        <img className="brand-logo" src="/assets/Sokcho-logo.png" alt="속초 중앙하이츠 THE 228" />
        <span className="brand-copy">
          <span>SOKCHO JUNGANG HEIGHTS</span>
          <strong>THE228 SOKCHO</strong>
        </span>
      </a>
      <nav className="nav-links" aria-label="주요 메뉴">
        {navItems.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <button className="header-cta" onClick={() => scrollToHash("#lead")}>
        방문예약 등록
      </button>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" />
      <div className="hero-content">
        <p className="hero-brand">SOKCHO JUNGANG HEIGHTS THE 228</p>
        <h1>
          설악과 동해가 내린
          <br />
          속초 중앙하이츠
          <br />
          <span>THE 228</span>
        </h1>
        <p className="hero-copy">
          속초 최대규모 228세대, 숲과 바다를 가까이 누리는 럭셔리 테라스 하우스의 탄생
        </p>
        <div className="hero-actions">
          <button className="btn btn-gold" onClick={() => scrollToHash("#summary")}>
            사업개요 보기 <ArrowRight size={18} />
          </button>
          <button className="btn btn-ghost" onClick={() => scrollToHash("#lead")}>
            상담신청
          </button>
        </div>
      </div>
      <div className="hero-statbar" aria-label="핵심 사업 정보">
        {heroStats.map(({ value, label, detail, icon: Icon }) => (
          <article key={label}>
            <Icon size={30} aria-hidden="true" />
            <strong>{value}</strong>
            <span>{label}</span>
            <p>{detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Summary() {
  return (
    <section className="section summary" id="summary">
      <div className="section-grid">
        <div className="section-copy">
          <span className="section-label">SUMMARY</span>
          <h2>자연이 만든 빛나는 작품이 되다</h2>
          <p>
            테라스에서 바라보는 설악의 조망과 집을 나서면 바로 만나는 속초 앞바다.
            지금껏 경험하지 못한 프리미엄 힐링 라이프가 시작됩니다.
          </p>
          <div className="summary-metrics">
            <div><strong>228</strong><span>총 세대수</span></div>
            <div><strong>15</strong><span>총 동수</span></div>
            <div><strong>84~101㎡</strong><span>주택형</span></div>
            <div><strong>즉시</strong><span>입주 가능</span></div>
          </div>
        </div>
        <div className="summary-media">
          <img src="/assets/Sokcho-life.png" alt="속초 중앙하이츠 THE 228 단지 조감도" />
          <div className="media-caption">SOKCHO THE 228 · 설악과 동해가 가까운 자리</div>
        </div>
      </div>
    </section>
  );
}

function Premium() {
  return (
    <section className="section premium" id="premium">
      <div className="section-heading">
        <span className="section-label">PREMIUM 4</span>
        <h2>속초 중앙하이츠 THE 228이 선사하는 네 가지 프리미엄</h2>
      </div>
      <div className="premium-grid">
        {premiumCards.map(({ title, body, icon: Icon }) => (
          <article className="premium-card" key={title}>
            <Icon size={36} aria-hidden="true" />
            <div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ValueSection() {
  return (
    <section className="value-band">
      <div className="section-heading inverse">
        <span className="section-label">THE 228 PREMIUM VALUE</span>
        <h2>동해와 설악, 속초의 미래가 만나는 자리</h2>
      </div>
      <div className="value-cards">
        {valueCards.map((card) => (
          <article className="value-card" key={card.title}>
            <img src={card.image} alt={`${card.title} 이미지`} />
            <div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="value-numbers" aria-label="프리미엄 요약 수치">
        <div><strong>228</strong><span>세대</span></div>
        <div><strong>84~101㎡</strong><span>주택형</span></div>
        <div><strong>3면</strong><span>숲세권</span></div>
        <div><strong>THE228</strong><span>브랜드</span></div>
      </div>
    </section>
  );
}

function LifeSection() {
  return (
    <section className="section life" id="life">
      <div className="life-top">
        <div className="section-copy">
          <span className="section-label">PREMIUM LIFE</span>
          <h2>다양한 테마공간 배치로 여유를 더한 명품 테라스하우스</h2>
          <p>
            특화된 단지설계와 숲을 품은 조경 설계로 트렌디한 생활과 자연이 주는
            여유를 동시에 누릴 수 있습니다.
          </p>
        </div>
        <img src="/assets/complex-wide.jpg" alt="속초 중앙하이츠 THE 228 단지 전경" />
      </div>
      <div className="life-cards">
        {lifeCards.map((card) => (
          <article key={card.title}>
            <img src={card.image} alt={`${card.title} 이미지`} />
            <div>
              <span>{card.title}</span>
              <h3>{card.body}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function UnitPlan() {
  const [selected, setSelected] = useState<UnitKey>("84A");
  const unitKeys = useMemo(() => unitOrder, []);
  const unit = unitPlans[selected];

  return (
    <section className="section unit" id="unit">
      <div className="section-heading">
        <span className="section-label">UNIT PLAN</span>
        <h2>84㎡부터 101㎡까지, 테라스와 다락을 더한 실용적 공간 설계</h2>
      </div>
      <div className="unit-layout">
        <div className="unit-tabs" role="tablist" aria-label="세대 타입 선택">
          {unitKeys.map((key) => (
            <button
              key={key}
              className={key === selected ? "active" : ""}
              onClick={() => setSelected(key)}
              role="tab"
              aria-selected={key === selected}
            >
              {unitPlans[key].label}
            </button>
          ))}
        </div>
        <div className="unit-card">
          <div className="unit-copy">
            <span>{unit.households}</span>
            <h3>{unit.label} TYPE</h3>
            <p>{unit.title}</p>
            <small>{unit.body}</small>
            <button className="link-button" onClick={() => scrollToHash("#lead")}>
              평면 상담하기 <ChevronRight size={16} />
            </button>
          </div>
          <div className="unit-image">
            <img src={unit.image} alt={`${unit.label} 평면도`} />
          </div>
        </div>
      </div>
    </section>
  );
}

function LeadSection() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [draftVisitTime, setDraftVisitTime] = useState("");
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const todayDateValue = useMemo(() => getTodayDateValue(), []);
  const selectedVisitTimeLabel = getVisitTimeLabel(visitTime);

  useEffect(() => {
    if (!isTimeModalOpen) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsTimeModalOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTimeModalOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const type = String(formData.get("type") ?? "").trim();
    const visitDateValue = String(formData.get("visitDate") ?? "").trim();
    const visitTimeValue = String(formData.get("visitTime") ?? "").trim();

    if (!visitDateValue || !visitTimeValue) {
      setSubmitted(false);
      setSubmitError("방문 희망 날짜와 시간을 선택해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await saveLead({ name, phone, type, visitDate: visitDateValue, visitTime: visitTimeValue });
      setSubmitted(true);
      setVisitDate("");
      setVisitTime("");
      setDraftVisitTime("");
      form.reset();
    } catch {
      setSubmitted(false);
      setSubmitError("접수 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="lead" id="lead">
      <div className="lead-copy">
        <span className="section-label">CONTACT</span>
        <h2>속초가 아껴둔 그 자리에서 당신이 꿈꾸던 삶이 시작됩니다</h2>
        <p>속초 중앙하이츠 THE 228의 프리미엄을 지금 확인하세요.</p>
        <div className="lead-points">
          <span><Phone size={18} /> {inquiryPhone}</span>
          <span><CalendarDays size={18} /> 방문 상담 예약</span>
          <span><ShieldCheck size={18} /> 개인정보 동의 후 접수</span>
        </div>
      </div>
      <form className="lead-form" onSubmit={handleSubmit}>
        <label>
          이름
          <input name="name" placeholder="홍길동" required />
        </label>
        <label>
          연락처
          <input name="phone" placeholder="010-0000-0000" required inputMode="tel" />
        </label>
        <div className="schedule-field">
          <div className="schedule-grid">
            <label>
              방문 날짜
              <input
                name="visitDate"
                type="date"
                min={todayDateValue}
                value={visitDate}
                onChange={(event) => {
                  setVisitDate(event.currentTarget.value);
                  setSubmitted(false);
                }}
                required
              />
            </label>
            <div className="time-field">
              <span>방문 시간</span>
              <input name="visitTime" type="hidden" value={visitTime} readOnly />
              <button
                className={`time-select-button${visitTime ? " selected" : ""}`}
                type="button"
                aria-haspopup="dialog"
                aria-expanded={isTimeModalOpen}
                onClick={() => {
                  setDraftVisitTime(visitTime);
                  setIsTimeModalOpen(true);
                  setSubmitted(false);
                }}
              >
                <span>{selectedVisitTimeLabel || "시간 선택"}</span>
                <Clock size={18} />
              </button>
            </div>
          </div>
        </div>
        <label>
          관심 타입
          <select name="type" defaultValue="84㎡">
            <option>84㎡</option>
            <option>98㎡</option>
            <option>101㎡</option>
            <option>상담 후 결정</option>
          </select>
        </label>
        <label className="agree">
          <input type="checkbox" required />
          개인정보 수집 및 이용에 동의합니다.
        </label>
        <button className="btn btn-gold" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "저장 중" : "방문예약 등록"} <ArrowRight size={18} />
        </button>
        {isTimeModalOpen && (
          <div
            className="time-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="visit-time-title"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setIsTimeModalOpen(false);
              }
            }}
          >
            <div className="time-modal-panel">
              <div className="time-modal-head">
                <h3 id="visit-time-title">방문 희망 시간 선택</h3>
                <p>방문을 희망하시는 시간을 선택해 주세요.</p>
              </div>
              <div className="time-options" role="radiogroup" aria-label="방문 희망 시간">
                {visitTimeOptions.map((option) => (
                  <button
                    className={`time-option${draftVisitTime === option.value ? " active" : ""}`}
                    type="button"
                    key={option.value}
                    disabled={option.disabled}
                    role="radio"
                    aria-checked={draftVisitTime === option.value}
                    onClick={() => setDraftVisitTime(option.value)}
                  >
                    <span className="time-radio" aria-hidden="true" />
                    <span className="time-label">{option.label}</span>
                    {option.status && <span className="time-status">{option.status}</span>}
                  </button>
                ))}
              </div>
              <div className="time-actions">
                <button className="time-cancel" type="button" onClick={() => setIsTimeModalOpen(false)}>
                  취소
                </button>
                <button
                  className="time-complete"
                  type="button"
                  disabled={!draftVisitTime}
                  onClick={() => {
                    setVisitTime(draftVisitTime);
                    setIsTimeModalOpen(false);
                  }}
                >
                  완료
                </button>
              </div>
            </div>
          </div>
        )}
        {submitError && (
          <p className="form-error" role="alert">
            {submitError}
          </p>
        )}
        {submitted && (
          <p className="form-success" role="status">
            <CheckCircle2 size={18} /> 접수가 완료되었습니다. 확인 후 안내드리겠습니다.
          </p>
        )}
      </form>
    </section>
  );
}

function FloatingQuick() {
  return (
    <div className="floating-quick" aria-label="빠른 메뉴">
      <a href={inquiryPhoneHref} aria-label="전화 상담">
        <Phone size={28} />
      </a>
      <a href={naverMapUrl} target="_blank" rel="noreferrer" aria-label="네이버 지도 열기">
        <MapPin size={28} />
      </a>
      <button className="floating-reservation" type="button" onClick={() => scrollToHash("#lead")} aria-label="방문예약">
        <span>방문예약</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function AdminPage() {
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminMessage, setAdminMessage] = useState("");

  async function loadLeads() {
    setIsLoading(true);
    setAdminMessage("");
    try {
      setLeads(await fetchLeads());
    } finally {
      setIsLoading(false);
    }
  }

  async function handleClear() {
    const confirmed = window.confirm("저장된 관심고객 접수 내역을 모두 삭제할까요?");
    if (!confirmed) {
      return;
    }

    await clearLeads();
    setLeads([]);
    setAdminMessage("접수 내역을 삭제했습니다.");
  }

  useEffect(() => {
    void loadLeads();
  }, []);

  const latestLead = leads[0];
  const today = new Date().toDateString();
  const todayCount = leads.filter((lead) => new Date(lead.createdAt).toDateString() === today).length;

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-top">
          <div>
            <span className="section-label">ADMIN</span>
            <h1>관심고객 접수 관리</h1>
            <p>랜딩페이지에서 등록된 상담 신청 내역을 확인합니다.</p>
          </div>
          <button className="admin-back" type="button" onClick={() => { window.location.hash = "#top"; }}>
            <ArrowLeft size={18} /> 현장 페이지
          </button>
        </div>

        <div className="admin-stats">
          <article>
            <span>전체 접수</span>
            <strong>{leads.length}</strong>
          </article>
          <article>
            <span>오늘 접수</span>
            <strong>{todayCount}</strong>
          </article>
          <article>
            <span>최근 접수</span>
            <strong>{latestLead ? formatDateTime(latestLead.createdAt) : "-"}</strong>
          </article>
        </div>

        <div className="admin-toolbar">
          <button type="button" onClick={loadLeads}>
            <RefreshCw size={17} /> 새로고침
          </button>
          <button type="button" onClick={() => downloadCsv(leads)} disabled={leads.length === 0}>
            <Download size={17} /> CSV 다운로드
          </button>
          <button className="admin-danger" type="button" onClick={handleClear} disabled={leads.length === 0}>
            <Trash2 size={17} /> 전체 삭제
          </button>
        </div>

        {adminMessage && <p className="admin-message">{adminMessage}</p>}

        <div className="admin-table-wrap">
          {isLoading ? (
            <div className="admin-empty">접수 내역을 불러오는 중입니다.</div>
          ) : leads.length === 0 ? (
            <div className="admin-empty">아직 저장된 관심고객 접수 내역이 없습니다.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>접수일시</th>
                  <th>이름</th>
                  <th>연락처</th>
                  <th>방문 일정</th>
                  <th>관심 타입</th>
                  <th>저장 위치</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{formatDateTime(lead.createdAt)}</td>
                    <td>{lead.name}</td>
                    <td><a href={`tel:${lead.phone}`}>{lead.phone}</a></td>
                    <td>{formatVisitSchedule(lead)}</td>
                    <td><span className="admin-chip">{lead.type}</span></td>
                    <td>{lead.source === "browser-storage" ? "브라우저 임시 저장" : "관리자 페이지 저장"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="admin-note">
          접수 내역은 관리자 페이지 저장 방식으로 보관되며, 배포된 사이트에서도 이 화면에서 확인할 수 있습니다.
        </p>
      </section>
    </main>
  );
}

function LaunchVideoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="video-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="launch-video-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="video-modal-panel">
        <div className="video-modal-header">
          <div>
            <span>THE 228 VIDEO</span>
            <h2 id="launch-video-title">속초 중앙하이츠 THE 228 영상</h2>
          </div>
          <button className="video-modal-close" type="button" onClick={onClose} aria-label="영상 팝업 닫기">
            <X size={22} />
          </button>
        </div>
        <div className="video-modal-frame">
          <iframe
            src={launchVideoUrl}
            title="속초 중앙하이츠 THE 228 YouTube Shorts"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <button className="video-modal-dismiss" type="button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export function App() {
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || "#top");
  const [showLaunchVideo, setShowLaunchVideo] = useState(() => window.location.hash !== "#admin");
  const isAdminPage = currentHash === "#admin";

  useEffect(() => {
    function handleHashChange() {
      const nextHash = window.location.hash || "#top";
      setCurrentHash(nextHash);
      if (nextHash === "#admin") {
        setShowLaunchVideo(false);
      }
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (!showLaunchVideo || isAdminPage) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowLaunchVideo(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAdminPage, showLaunchVideo]);

  if (isAdminPage) {
    return <AdminPage />;
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Summary />
        <Premium />
        <ValueSection />
        <LifeSection />
        <UnitPlan />
        <LeadSection />
      </main>
      <FloatingQuick />
      {showLaunchVideo && <LaunchVideoModal onClose={() => setShowLaunchVideo(false)} />}
      <footer className="site-footer">
        <div className="footer-inner">
          <img className="footer-logo" src="/assets/Sokcho-logo.png" alt="속초 중앙하이츠 THE 228" />

          <dl className="footer-info">
            <div>
              <dt><Building2 size={20} /> 현장명</dt>
              <dd>속초 중앙하이츠 THE228</dd>
            </div>
            <div>
              <dt><MapPin size={21} /> 현장주소</dt>
              <dd>강원도 속초시 장사동 일원</dd>
            </div>
            <div>
              <dt><HardHat size={21} /> 시공</dt>
              <dd>중앙하이츠</dd>
            </div>
          </dl>

          <div className="footer-contact">
            <span>방문예약·문의</span>
            <a href={inquiryPhoneHref}>{inquiryPhone}</a>
          </div>

          <div className="footer-notice">
            <p>* 본 홈페이지의 내용은 소비자의 이해를 돕기 위한 것으로<br />실제와 차이가 있을 수 있으며, 견본주택을 방문하셔서 직접 확인하시기 바랍니다.</p>
            <p>Copyrights © 2026 속초 중앙하이츠 THE228. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
