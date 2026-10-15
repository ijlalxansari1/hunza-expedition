import { NextRequest, NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validations/enquiry";
import { saveEnquiry } from "@/lib/enquiryStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod Validation & Anti-Spam Check
    const result = enquirySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
          message: "Please complete the required fields accurately.",
        },
        { status: 400 }
      );
    }

    // Anti-spam honeypot check: website_field must be empty
    if (result.data.website_field && result.data.website_field.length > 0) {
      return NextResponse.json(
        { success: false, message: "Submission rejected." },
        { status: 400 }
      );
    }

    // 2. Save enquiry and generate unique reference
    const { referenceId } = await saveEnquiry(result.data);

    return NextResponse.json({
      success: true,
      referenceId,
      message: "Your journey enquiry has been received for manual review.",
    });
  } catch (error) {
    console.error("Error processing enquiry submission:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while saving your enquiry. Please contact us directly.",
      },
      { status: 500 }
    );
  }
}
