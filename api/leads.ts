import { fetchSmsSettings, sendReservationMms, type SmsStatus } from "./_sms";
import { getSupabaseClient, readPayload, type VercelRequest, type VercelResponse } from "./_supabase";

type LeadSubmission = {
  id: string;
  name: string;
  phone: string;
  type: string;
  visitDate: string;
  visitTime: string;
  createdAt: string;
  source: string;
  smsStatus: SmsStatus;
  smsSentAt: string | null;
  smsError: string | null;
  smsMessageId: string | null;
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
  sms_status: SmsStatus | null;
  sms_sent_at: string | null;
  sms_error: string | null;
  sms_message_id: string | null;
};

type LeadInput = {
  name: string;
  phone: string;
  type: string;
  visitDate: string;
  visitTime: string;
};

const tableName = "sokcho_the228_leads";
const selectColumns =
  "id,name,phone,type,visit_date,visit_time,created_at,source,sms_status,sms_sent_at,sms_error,sms_message_id";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return typeof error === "string" ? error : "문자 발송 준비 중 오류가 발생했습니다.";
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
    smsStatus: row.sms_status ?? "not_configured",
    smsSentAt: row.sms_sent_at,
    smsError: row.sms_error,
    smsMessageId: row.sms_message_id,
  };
}

function parsePayload(payload: unknown): LeadInput | null {
  const data = readPayload(payload);
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

      const lead = toLead(data as LeadRow);
      const smsResult = await (async () => {
        try {
          const smsSettings = await fetchSmsSettings(supabase);
          return await sendReservationMms(input, smsSettings);
        } catch (smsError) {
          return {
            status: "failed" as SmsStatus,
            sentAt: null,
            error: getErrorMessage(smsError),
            messageId: null,
          };
        }
      })();
      const { data: updatedData, error: updateError } = await supabase
        .from(tableName)
        .update({
          sms_status: smsResult.status,
          sms_sent_at: smsResult.sentAt,
          sms_error: smsResult.error,
          sms_message_id: smsResult.messageId,
        })
        .eq("id", lead.id)
        .select(selectColumns)
        .single();

      if (updateError) {
        response.status(201).json({
          lead: {
            ...lead,
            smsStatus: smsResult.status,
            smsSentAt: smsResult.sentAt,
            smsError: updateError.message || smsResult.error,
            smsMessageId: smsResult.messageId,
          },
        });
        return;
      }

      response.status(201).json({ lead: toLead(updatedData as LeadRow) });
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
