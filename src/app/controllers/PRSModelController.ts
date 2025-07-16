import type { NextApiRequest, NextApiResponse } from 'next';
import { getPrsModelsByTraits } from '@/app/services/PRSModelservice';

// Interfaces para los tipos de datos
interface TraitRelation {
  traitId: number;
  prsModelId: number;
  trait: {
    id: number;
    label: string;

  };
}

interface PrsModelWithRelations {
  id: number;
  name: string;
  numberOfSNP?: number | null;
  pgscId?: string | null;
  pgscURL?: string | null;
  publicationId: number;
  traits: TraitRelation[];
  publication: {
    title: string;
    author: string;
    journal: string;
    year: number;
    PMID?: string | null;
    DOI?: string | null;
  };
  broadAncestryCategories: any[];
  modelEvaluations: any[];
}

// Tipo para la respuesta de la API
export type PrsModelResponseData = {
  message?: string;
  prsModels?: PrsModelWithRelations[];
  error?: string;
};

// Tipo para el cuerpo de la solicitud
interface RequestBody {
  traitIds: number[];
}

export const handleGetPrsModelsByTraits = async (
  req: NextApiRequest,
  res: NextApiResponse<PrsModelResponseData>
): Promise<void> => {
  try {

    const { traitIds } = req.body as RequestBody;
    

    if (!traitIds || !Array.isArray(traitIds) || traitIds.length === 0) {
      return res.status(400).json({ 
        error: 'Se requiere un array no vacío de IDs de traits' 
      });
    }

    // Validar que todos los elementos son números
    if (traitIds.some(id => typeof id !== 'number')) {
      return res.status(400).json({ 
        error: 'Todos los IDs de traits deben ser números' 
      });
    }

    const prsModels = await getPrsModelsByTraits(traitIds);
    
    // Enviar respuesta exitosa
    res.status(200).json({ 
      prsModels,
      message: `Se encontraron ${prsModels.length} modelos PRS asociados con los traits seleccionados`
    });
  } catch (error) {
    console.error("API Controller Error fetching PRS models:", error);
    
    // Enviar respuesta de error
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch PRS models' 
    });
  }
};