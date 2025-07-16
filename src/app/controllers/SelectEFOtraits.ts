import type { NextApiRequest, NextApiResponse } from 'next';
import { getTraitIdsWithEfoId } from '../services/SelectEFOtraitsServices';

export const handleGetTraitIdsWithEfoId = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Verifica que se haya proporcionado al menos un efoId
    const efoIdsParam = req.query.efoIds;

    if (!efoIdsParam) {
      return res.status(400).json({ error: 'Debe proporcionar uno o más efoIds.' });
    }

    const efoIds = Array.isArray(efoIdsParam)
      ? efoIdsParam
      : efoIdsParam.split(',').map((id) => id.trim());

    const traitIds = await getTraitIdsWithEfoId(efoIds);

    res.status(200).json(traitIds);
  } catch (error) {
    console.error('Error en TraitController:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};