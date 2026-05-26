import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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

const leadsFile = path.resolve(__dirname, "data", "leads.json");

async function readLeads(): Promise<LeadSubmission[]> {
  try {
    const contents = await readFile(leadsFile, "utf-8");
    const parsed = JSON.parse(contents);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLeads(leads: LeadSubmission[]) {
  await mkdir(path.dirname(leadsFile), { recursive: true });
  await writeFile(leadsFile, JSON.stringify(leads, null, 2), "utf-8");
}

function sendJson(response: ServerResponse, status: number, payload: unknown) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

function readBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: "local-lead-storage-api",
      configureServer(server) {
        server.middlewares.use("/api/leads", async (request, response) => {
          try {
            if (request.method === "GET") {
              sendJson(response, 200, { leads: await readLeads() });
              return;
            }

            if (request.method === "POST") {
              const payload = JSON.parse(await readBody(request));
              const name = String(payload.name ?? "").trim();
              const phone = String(payload.phone ?? "").trim();
              const type = String(payload.type ?? "").trim();
              const visitDate = String(payload.visitDate ?? "").trim();
              const visitTime = String(payload.visitTime ?? "").trim();

              if (!name || !phone || !type || !visitDate || !visitTime) {
                sendJson(response, 400, { message: "필수 입력값이 누락되었습니다." });
                return;
              }

              const lead: LeadSubmission = {
                id: crypto.randomUUID(),
                name,
                phone,
                type,
                visitDate,
                visitTime,
                createdAt: new Date().toISOString(),
                source: "landing-page",
              };

              const leads = await readLeads();
              await writeLeads([lead, ...leads]);
              sendJson(response, 201, { lead });
              return;
            }

            if (request.method === "DELETE") {
              await writeLeads([]);
              sendJson(response, 200, { leads: [] });
              return;
            }

            response.statusCode = 405;
            response.end();
          } catch (error) {
            sendJson(response, 500, {
              message: error instanceof Error ? error.message : "저장 중 오류가 발생했습니다.",
            });
          }
        });
      },
    },
  ],
});
