import { createClient } from "@supabase/supabase-js";

type LeadSubmission = {
  id: string;
  name: string;
  phone: string;
  type: string;
  visitDate: string;
  visitTime: string;
  createdAt: string;
  source: string;
};

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  type: string;
  visit_date: string;
  visit_time: string;
  created_at: string;
  source: string;
};

type LeadInput = {
  name: string;
  phone: string;
  type: string;
  visitDate: string;
  visitTime: string;
};

type VercelRequest = {
  method?: string;
  body?: unknown;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (payload: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
};

const tableName = "sokcho_the228_leads";
const selectColumns = "id,name,phone,type,visit_date,visit_time,created_at,source";

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} 환경변수가 설정되지 않았습니다.`);
  }
  return value;
}

function getSupabaseClient() {
  return createClient(getRequiredEnv("SUPABASE_URL"), getRequiredEnv("SUPABASE_PUBLISHABLE_KEY"), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        "x-sokcho-admin-token": getRequiredEnv("SUPABASE_ADMIN_TOKEN"),
      },
    },
  });
}

function toLead(row: LeadRow): LeadSubmission {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    type: row.type,
    visitDate: row.visit_date,
    visitTime: row.visit_time,
    createdAt: row.created_at,
    source: row.source,
  };
}

function parsePayload(payload: unknown): LeadInput | null {
  const data = typeof payload === "string" ? parseJson(payload) : payload;
  const record = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const name = String(record.name ?? "").trim();
  const phone = String(record.phone ?? "").trim();
  const type = String(record.type ?? "").trim();
  const visitDate = String(record.visitDate ?? "").trim();
  const visitTime = String(record.visitTime ?? "").trim();

  if (!name || !phone || !type || !visitDate || !visitTime) {
    return null;
  }

  return { name, phone, type, visitDate, visitTime };
}

function parseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  try {
    const supabase = getSupabaseClient();

    if (request.method === "GET") {
      const { data, error } = await supabase
        .from(tableName)
        .select(selectColumns)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      response.status(200).json({ leads: (data ?? []).map((row) => toLead(row as LeadRow)) });
      return;
    }

    if (request.method === "POST") {
      const input = parsePayload(request.body);

      if (!input) {
        response.status(400).json({ message: "필수 입력값이 누락되었습니다." });
        return;
      }

      const { data, error } = await supabase
        .from(tableName)
        .insert({
          name: input.name,
          phone: input.phone,
          type: input.type,
          visit_date: input.visitDate,
          visit_time: input.visitTime,
          source: "landing-page",
        })
        .select(selectColumns)
        .single();

      if (error) {
        throw error;
      }

      response.status(201).json({ lead: toLead(data as LeadRow) });
      return;
    }

    if (request.method === "DELETE") {
      const { error } = await supabase.from(tableName).delete().neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) {
        throw error;
      }

      response.status(200).json({ leads: [] });
      return;
    }

    response.setHeader("Allow", "GET, POST, DELETE");
    response.status(405).json({ message: "허용되지 않는 요청입니다." });
  } catch (error) {
    response.status(500).json({
      message: error instanceof Error ? error.message : "요청 처리 중 오류가 발생했습니다.",
    });
  }
}
