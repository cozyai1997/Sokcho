import path from "node:path";
import { fileURLToPath } from "node:url";
import { SolapiMessageService } from "solapi";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagePath = path.resolve(__dirname, "..", "public", "assets", "sms-coupon-mms.jpg");
const apiKey = process.env.SOLAPI_API_KEY?.trim();
const apiSecret = process.env.SOLAPI_API_SECRET?.trim();

if (!apiKey || !apiSecret) {
  console.error("SOLAPI_API_KEY and SOLAPI_API_SECRET environment variables are required.");
  process.exit(1);
}

const messageService = new SolapiMessageService(apiKey, apiSecret);
const result = await messageService.uploadFile(imagePath, "MMS", "sokcho-the228-coupon");
const imageId = result?.fileId ?? result?.imageId ?? result?.id;

if (!imageId) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

console.log(`SOLAPI MMS imageId: ${imageId}`);
