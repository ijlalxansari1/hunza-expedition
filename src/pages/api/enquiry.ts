// pages/api/enquiry.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { rateLimiter } from '@/lib/rateLimiter';
import { saveEnquiry } from '@/lib/enquiryStore';
import { enquirySchema } from '@/lib/validations/enquiry';

const applyRateLimit = rateLimiter as unknown as (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (error?: unknown) => void,
) => void;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  applyRateLimit(req, res, (error) => {
    if (error) {
      console.error('Error applying enquiry rate limit:', error);
      return res.status(500).json({ success: false, message: 'Unable to process enquiry.' });
    }
    if (res.writableEnded) return;

    void submitEnquiry(req, res);
  });
}

async function submitEnquiry(req: NextApiRequest, res: NextApiResponse) {
  const result = enquirySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.flatten().fieldErrors,
      message: 'Please complete the required fields accurately.',
    });
  }

  try {
    const { referenceId } = await saveEnquiry(result.data);
    return res.status(200).json({
      success: true,
      referenceId,
      message: 'Your journey enquiry has been received for manual review.',
    });
  } catch (error) {
    console.error('Error processing enquiry submission:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while saving your enquiry.',
    });
  }
}
