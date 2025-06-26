import type { NextApiRequest, NextApiResponse } from 'next';
import { getTraitDetails } from '@/app/services/detallefenotipoonto';

export const handleGetTraitDetails = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { traitId } = req.query;

    const id = parseInt(traitId as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'traitId debe ser un número válido.' });
    }

    const trait = await getTraitDetails(id);

    if (!trait) {
      return res.status(404).json({ error: 'Fenotipo no encontrado.' });
    }
/*Yo como usuario quiero ver los detalles del fenotipo en la ontología y su ID con un enlace a la
ontología, para entender mejor el significado y las relaciones del fenotipo.*/
    res.status(200).json({
      id: trait.id,
      label: trait.label,
      description: trait.description,
      ontologyUrl: trait.URL,
    });
  } catch (error) {
    console.error('Error en TraitController:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
