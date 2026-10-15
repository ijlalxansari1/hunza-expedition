import fs from "fs";
import path from "path";
import { EnquiryFormData } from "./validations/enquiry";

export interface StoredEnquiry extends EnquiryFormData {
  referenceId: string;
  submittedAt: string;
  status: "new" | "under_review" | "preparing_quotation" | "quotation_sent" | "confirmed_manual" | "closed" | "not_feasible";
  internalNotes: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const ENQUIRIES_FILE = path.join(DATA_DIR, "enquiries.json");

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function generateReferenceId(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `HX-${year}-${randomSuffix}`;
}

export async function saveEnquiry(formData: EnquiryFormData): Promise<{ success: boolean; referenceId: string }> {
  ensureDirectoryExists();

  const referenceId = generateReferenceId();
  const newRecord: StoredEnquiry = {
    ...formData,
    referenceId,
    submittedAt: new Date().toISOString(),
    status: "new",
    internalNotes: "Received via online Custom Journey Builder.",
  };

  let existing: StoredEnquiry[] = [];
  try {
    if (fs.existsSync(ENQUIRIES_FILE)) {
      const content = fs.readFileSync(ENQUIRIES_FILE, "utf-8");
      existing = JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading existing enquiries:", err);
    existing = [];
  }

  existing.unshift(newRecord);

  try {
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(existing, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing enquiry to disk:", err);
  }

  // Business notification delivery / dev audit log
  logNotification(newRecord);

  return { success: true, referenceId };
}

function logNotification(enquiry: StoredEnquiry) {
  const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL || "enquiries@hunzaexpeditions.com";
  console.log("==================================================================");
  console.log(`[HUNZA EXPEDITIONS - NEW ENQUIRY NOTIFICATION]`);
  console.log(`Reference: ${enquiry.referenceId}`);
  console.log(`To Business Inbox: ${notificationEmail}`);
  console.log(`Customer: ${enquiry.fullName} (${enquiry.email})`);
  console.log(`Destinations: ${enquiry.selectedDestinations.join(", ")}`);
  console.log(`Duration: ${enquiry.durationDays} days | Travellers: ${enquiry.adultsCount} adults, ${enquiry.childrenCount} children`);
  console.log(`Preferred Contact: ${enquiry.preferredContact} | Phone: ${enquiry.phone || "Not provided"}`);
  console.log(`Interests: ${enquiry.selectedInterests.join(", ") || "General exploration"}`);
  console.log(`Special Requests: ${enquiry.specialRequests || "None"}`);
  console.log(`Status: ${enquiry.status}`);
  console.log("==================================================================");
}
