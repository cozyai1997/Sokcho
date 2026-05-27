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
  Plus,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Train,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type UnitKey = "84A" | "84B" | "84C" | "84D" | "84E" | "84F" | "84G" | "93" | "98" | "101A" | "101B";
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

type UnitSummaryItem = {
  label: string;
  value: string;
  note?: string;
};

type UnitPlanInfo = {
  label: string;
  title: string;
  body: string;
  households: string;
  image: string;
  loftDetailImage?: string;
  summary: UnitSummaryItem[];
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

const unitPlans: Record<UnitKey, UnitPlanInfo> = {
  "84A": {
    label: "84A",
    title: "실사용 약 122.18㎡ 기본형",
    body: "3층 배치, 전용 84.96㎡에 발코니 서비스 면적을 더한 실속형 타입입니다.",
    households: "총 17세대",
    image: "/assets/unit-84a-pdf.jpg?v=20260526-top-safe",
    summary: [
      { label: "층", value: "3층" },
      { label: "세대수", value: "17세대" },
      { label: "전용면적", value: "84.9649㎡", note: "25.70평" },
      { label: "공급면적", value: "104.7567㎡", note: "31.69평" },
      { label: "서비스면적", value: "37.2216㎡", note: "11.26평" },
      { label: "실사용면적", value: "122.1865㎡", note: "36.96평" },
    ],
  },
  "84B": {
    label: "84B",
    title: "실사용 약 131.51㎡ 테라스형",
    body: "2층 배치, 발코니와 테라스 서비스 면적을 함께 누리는 확장감 있는 타입입니다.",
    households: "총 17세대",
    image: "/assets/unit-84b-pdf.jpg?v=20260526-top-safe",
    summary: [
      { label: "층", value: "2층" },
      { label: "세대수", value: "17세대" },
      { label: "전용면적", value: "84.9649㎡", note: "25.70평" },
      { label: "공급면적", value: "104.7567㎡", note: "31.69평" },
      { label: "서비스면적", value: "46.5513㎡", note: "14.08평" },
      { label: "실사용면적", value: "131.5162㎡", note: "39.78평" },
    ],
  },
  "84C": {
    label: "84C",
    title: "실사용 약 132.33㎡ 테라스형",
    body: "2층 일부 세대에 계획된 희소 타입으로 테라스 활용도를 높인 평면입니다.",
    households: "총 2세대",
    image: "/assets/unit-84c-pdf.jpg?v=20260526-top-safe",
    summary: [
      { label: "층", value: "2층" },
      { label: "세대수", value: "2세대" },
      { label: "전용면적", value: "84.9649㎡", note: "25.70평" },
      { label: "공급면적", value: "104.7567㎡", note: "31.69평" },
      { label: "서비스면적", value: "47.3722㎡", note: "14.33평" },
      { label: "실사용면적", value: "132.3371㎡", note: "40.03평" },
    ],
  },
  "84D": {
    label: "84D",
    title: "실사용 약 140.98㎡ 와이드형",
    body: "3층 배치, 넓은 테라스 서비스 면적으로 여유로운 외부공간을 더했습니다.",
    households: "총 27세대",
    image: "/assets/unit-84d-pdf.jpg?v=20260526-top-safe",
    summary: [
      { label: "층", value: "3층" },
      { label: "세대수", value: "27세대" },
      { label: "전용면적", value: "84.9649㎡", note: "25.70평" },
      { label: "공급면적", value: "104.7567㎡", note: "31.69평" },
      { label: "서비스면적", value: "56.0250㎡", note: "16.95평" },
      { label: "실사용면적", value: "140.9899㎡", note: "42.65평" },
    ],
  },
  "84E": {
    label: "84E",
    title: "실사용 약 241.64㎡ 다락 특화형",
    body: "3~4층 배치, 테라스와 다락을 모두 더한 대표 복층 특화 타입입니다.",
    households: "총 46세대",
    image: "/assets/unit-84e-pdf.jpg?v=20260526-top-safe",
    loftDetailImage: "/assets/unit-84e-loft-detail.jpg?v=20260526-loft-detail",
    summary: [
      { label: "층", value: "3~4층" },
      { label: "세대수", value: "46세대" },
      { label: "전용면적", value: "84.9649㎡", note: "25.70평" },
      { label: "공급면적", value: "104.7567㎡", note: "31.69평" },
      { label: "서비스면적", value: "156.6839㎡", note: "47.40평" },
      { label: "실사용면적", value: "241.6488㎡", note: "73.10평" },
    ],
  },
  "84F": {
    label: "84F",
    title: "실사용 약 116.23㎡ 저층형",
    body: "1~3층에 고르게 배치된 타입으로 실용적인 발코니 서비스 면적을 갖췄습니다.",
    households: "총 14세대",
    image: "/assets/unit-84f-pdf.jpg?v=20260526-top-safe",
    summary: [
      { label: "층", value: "1~3층" },
      { label: "세대수", value: "14세대" },
      { label: "전용면적", value: "84.9048㎡", note: "25.68평" },
      { label: "공급면적", value: "104.9426㎡", note: "31.75평" },
      { label: "서비스면적", value: "31.3350㎡", note: "9.48평" },
      { label: "실사용면적", value: "116.2398㎡", note: "35.16평" },
    ],
  },
  "84G": {
    label: "84G",
    title: "실사용 약 224.68㎡ 다락 특화형",
    body: "3~4층 배치, 테라스와 다락이 더해져 입체적인 라이프스타일을 담는 타입입니다.",
    households: "총 5세대",
    image: "/assets/unit-84g-pdf.jpg?v=20260526-top-safe",
    loftDetailImage: "/assets/unit-84g-loft-detail.jpg?v=20260526-loft-detail",
    summary: [
      { label: "층", value: "3~4층" },
      { label: "세대수", value: "5세대" },
      { label: "전용면적", value: "84.9048㎡", note: "25.68평" },
      { label: "공급면적", value: "104.9426㎡", note: "31.75평" },
      { label: "서비스면적", value: "139.7830㎡", note: "42.28평" },
      { label: "실사용면적", value: "224.6878㎡", note: "67.97평" },
    ],
  },
  "93": {
    label: "93",
    title: "실사용 약 132.64㎡ 중대형",
    body: "1층 배치, 전용 93.68㎡에 발코니 서비스 면적을 더한 여유형 타입입니다.",
    households: "총 19세대",
    image: "/assets/unit-93-pdf.jpg?v=20260526-top-safe",
    summary: [
      { label: "층", value: "1층" },
      { label: "세대수", value: "19세대" },
      { label: "전용면적", value: "93.6819㎡", note: "28.34평" },
      { label: "공급면적", value: "114.9213㎡", note: "34.76평" },
      { label: "서비스면적", value: "38.9616㎡", note: "11.79평" },
      { label: "실사용면적", value: "132.6435㎡", note: "40.12평" },
    ],
  },
  "98": {
    label: "98",
    title: "실사용 약 162.30㎡ 테라스형",
    body: "2층 배치, 넓어진 주거 면적과 테라스 서비스 면적이 조화를 이루는 타입입니다.",
    households: "총 27세대",
    image: "/assets/unit-98-pdf.jpg?v=20260526-top-safe",
    summary: [
      { label: "층", value: "2층" },
      { label: "세대수", value: "27세대" },
      { label: "전용면적", value: "98.8419㎡", note: "29.90평" },
      { label: "공급면적", value: "121.0783㎡", note: "36.63평" },
      { label: "서비스면적", value: "63.4646㎡", note: "19.20평" },
      { label: "실사용면적", value: "162.3065㎡", note: "49.10평" },
    ],
  },
  "101A": {
    label: "101A",
    title: "실사용 약 146.05㎡ 대형 타입",
    body: "1층 배치, 전용 101.31㎡ 기반의 여유로운 공간감과 서비스 면적을 갖췄습니다.",
    households: "총 27세대",
    image: "/assets/unit-101a-pdf.jpg?v=20260526-top-safe",
    summary: [
      { label: "층", value: "1층" },
      { label: "세대수", value: "27세대" },
      { label: "전용면적", value: "101.3143㎡", note: "30.65평" },
      { label: "공급면적", value: "127.7227㎡", note: "38.64평" },
      { label: "서비스면적", value: "44.7428㎡", note: "13.53평" },
      { label: "실사용면적", value: "146.0571㎡", note: "44.18평" },
    ],
  },
  "101B": {
    label: "101B",
    title: "실사용 약 165.64㎡ 대형 타입",
    body: "1층 배치, 전용 101.30㎡에 넓은 테라스 서비스 면적을 더한 타입입니다.",
    households: "총 27세대",
    image: "/assets/unit-101b-pdf.jpg?v=20260526-top-safe",
    summary: [
      { label: "층", value: "1층" },
      { label: "세대수", value: "27세대" },
      { label: "전용면적", value: "101.3045㎡", note: "30.64평" },
      { label: "공급면적", value: "126.5834㎡", note: "38.29평" },
      { label: "서비스면적", value: "64.3372㎡", note: "19.46평" },
      { label: "실사용면적", value: "165.6417㎡", note: "50.11평" },
    ],
  },
};

const unitOrder: UnitKey[] = ["84A", "84B", "84C", "84D", "84E", "84F", "84G", "93", "98", "101A", "101B"];
const leadTypeOptions = [...unitOrder, "상담 후 결정"];
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
      <a className="header-cta header-phone" href={inquiryPhoneHref} aria-label={`전화 상담 ${inquiryPhone}`}>
        <Phone size={17} />
        {inquiryPhone}
      </a>
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

function BenefitsBanner() {
  return (
    <section className="benefit-banner" aria-label="속초 중앙하이츠 THE 228 혜택 안내">
      <img
        src="/assets/sokcho-benefits-banner.png?v=20260526"
        alt="속초 중앙하이츠 THE 228 계약금 0원, 잔금 30% 3년 유예, 즉시 입주 가능, 발코니 확장비 무상, 세컨드 홈 특례혜택 안내"
      />
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
  const [isPlanVisible, setIsPlanVisible] = useState(false);
  const [isLoftDetailVisible, setIsLoftDetailVisible] = useState(false);
  const unitKeys = useMemo(() => unitOrder, []);
  const unit = unitPlans[selected];

  useEffect(() => {
    setIsLoftDetailVisible(false);

    if (!isPlanVisible || !unit.loftDetailImage) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setIsLoftDetailVisible((visible) => !visible);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [isPlanVisible, unit.loftDetailImage]);

  const handleShowPlan = () => {
    setIsLoftDetailVisible(false);
    setIsPlanVisible(true);
    window.requestAnimationFrame(() => {
      document.getElementById("unit-plan-detail")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

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
              onClick={() => {
                setSelected(key);
                setIsPlanVisible(false);
                setIsLoftDetailVisible(false);
              }}
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
            <button
              className="link-button"
              onClick={handleShowPlan}
              aria-controls="unit-plan-detail"
              aria-expanded={isPlanVisible}
            >
              상세보기 <ChevronRight size={16} />
            </button>
          </div>
          <div
            className={`unit-image ${isPlanVisible ? "is-visible" : "is-placeholder"}`}
            id="unit-plan-detail"
            aria-label={isPlanVisible ? `${unit.label} 평면도` : `${unit.label} 세대 평면 정보`}
          >
            {isPlanVisible ? (
              unit.loftDetailImage ? (
                <figure
                  className={`unit-plan-cycle ${isLoftDetailVisible ? "show-loft" : ""}`}
                  aria-label={`${unit.label} ${isLoftDetailVisible ? "다락 상세정보" : "기본 평면도"} 자동 전환`}
                  aria-live="polite"
                >
                  <img
                    className="unit-plan-main"
                    src={unit.image}
                    alt={`${unit.label} 기본 평면도`}
                    aria-hidden={isLoftDetailVisible}
                  />
                  <img
                    className="unit-plan-loft"
                    src={unit.loftDetailImage}
                    alt={`${unit.label} 다락 상세정보`}
                    aria-hidden={!isLoftDetailVisible}
                  />
                  <figcaption>
                    <span className="main-label">기본 평면도</span>
                    <span className="loft-label">다락 상세정보</span>
                  </figcaption>
                </figure>
              ) : (
                <img src={unit.image} alt={`${unit.label} 평면도`} />
              )
            ) : (
              <div className="unit-placeholder">
                <div className="unit-summary-head">
                  <House size={34} />
                  <div>
                    <span>요약정보</span>
                    <strong>{unit.label} TYPE</strong>
                  </div>
                </div>
                <dl className="unit-summary-grid">
                  {unit.summary.map((item) => (
                    <div key={item.label}>
                      <dt>{item.label}</dt>
                      <dd>
                        {item.value}
                        {item.note && <small>{item.note}</small>}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
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
        <figure className="lead-benefit-visual">
          <img
            src="/assets/gift.png?v=20260527"
            alt="방문 상담만 해도 사은품 증정, 방문 고객 한정 혜택 안내"
          />
        </figure>
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
          <select name="type" defaultValue="84A">
            {leadTypeOptions.map((type) => (
              <option key={type}>{type}</option>
            ))}
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
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [isGiftCta, setIsGiftCta] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIsGiftCta((current) => !current);
    }, 2800);

    return () => window.clearInterval(timer);
  }, []);

  const handleShare = async () => {
    const shareUrl = window.location.href.split("#")[0];
    const shareData = {
      title: "속초 중앙하이츠 THE 228",
      text: "속초 중앙하이츠 THE 228 방문예약 안내",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareMessage("공유 완료");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage("URL 복사 완료");
      } else {
        setShareMessage("URL 복사를 지원하지 않습니다");
      }
    } catch {
      setShareMessage("공유 취소");
    }

    window.setTimeout(() => setShareMessage(""), 1800);
  };

  const reservationLabel = isGiftCta ? "사은품증정" : "방문예약";

  return (
    <div className={`floating-quick ${isQuickOpen ? "is-open" : ""}`} aria-label="빠른 메뉴">
      <div className="floating-expand" id="floating-expand-menu" aria-hidden={!isQuickOpen}>
        <a className="floating-action" href={inquiryPhoneHref} aria-label="전화 상담">
          <Phone size={25} />
          <span>전화</span>
        </a>
        <a className="floating-action" href={naverMapUrl} target="_blank" rel="noreferrer" aria-label="네이버 지도 열기">
          <MapPin size={25} />
          <span>위치</span>
        </a>
        <button className="floating-action" type="button" onClick={handleShare} aria-label="URL 공유">
          <Share2 size={25} />
          <span>공유</span>
        </button>
      </div>
      {shareMessage && (
        <span className="floating-share-status" role="status">
          {shareMessage}
        </span>
      )}
      <button
        className="floating-toggle"
        type="button"
        onClick={() => setIsQuickOpen((open) => !open)}
        aria-controls="floating-expand-menu"
        aria-expanded={isQuickOpen}
        aria-label={isQuickOpen ? "빠른 메뉴 닫기" : "빠른 메뉴 열기"}
      >
        {isQuickOpen ? <X size={30} /> : <Plus size={32} />}
      </button>
      <button
        className={`floating-reservation ${isGiftCta ? "is-gift" : ""}`}
        type="button"
        onClick={() => scrollToHash("#lead")}
        aria-label={reservationLabel}
      >
        <span key={reservationLabel}>{reservationLabel}</span>
        {isGiftCta ? <Sparkles size={18} /> : <ChevronRight size={18} />}
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
        <BenefitsBanner />
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
