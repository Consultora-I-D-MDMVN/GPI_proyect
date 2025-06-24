import type { NextApiRequest, NextApiResponse } from 'next';
import { handleGetPrsModelsByAncestry, PrsModelResponseData } from '@/app/controllers/AncestrySelectorController';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PrsModelResponseData>
) {
  if (req.method === 'POST') {
    await handleGetPrsModelsByAncestry(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({
      error: `Método ${req.method} no permitido. Utilice POST.`,
    });
  }
}