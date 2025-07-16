import type { NextApiRequest, NextApiResponse } from 'next';
import { getPrsModelsByAncestry } from '@/app/services/AncestrySelectorService';
import type { AncestrySelector } from '@/types/AncestrySelector'

// Tipo para la respuesta de la API
export type PrsModelResponseData = {
  message?: string;
  prsModels?: AncestrySelector[]; 
  error?: string;
};

// Tipo para el cuerpo de la solicitud
interface RequestBody {
  ancestryLabel: string;
}

export const handleGetPrsModelsByAncestry = async (
  req: NextApiRequest,
  res: NextApiResponse<PrsModelResponseData>
): Promise<void> => {
  try {
    const { ancestryLabel } = req.body as RequestBody;

    if (!ancestryLabel || typeof ancestryLabel !== 'string') {
      return res.status(400).json({ error: 'No se ingresó ninguna ancestría, ingresa una para mostrar los modelos PRS asociados' });
    }

    const prsModels = await getPrsModelsByAncestry(ancestryLabel);

    if (!prsModels || prsModels.length === 0) {
      return res.status(404).json({
        message: `No se encontraron modelos PRS para la ancestría "${ancestryLabel}".`
      });
    }

    res.status(200).json({
      message: `Se encontraron ${prsModels.length} modelos PRS para ancestría "${ancestryLabel}"`,
      prsModels
    });
  } catch (error) {
    console.error('Error en controlador: handleGetPrsModelsByAncestry', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Error interno al obtener los modelos PRS'
    });
  }
};