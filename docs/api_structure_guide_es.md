# Guía para Crear Endpoints de API en Next.js (Estructura en Capas)

Esta guía explica cómo estructurar los endpoints de API en una aplicación Next.js utilizando una arquitectura en capas (Ruta -> Controlador -> Servicio), basada en el ejemplo implementado para `/api/traits`.

primero se debe hacer servicio -> controlador -> ruta
## Motivación

Separar la lógica de tu API en capas distintas mejora la organización, facilita las pruebas y hace que el código sea más mantenible a medida que la aplicación crece.

## Las Capas

1.  **Capa de Ruta (API Route Handler):**
    *   **Ubicación:** Dentro del directorio `src/pages/api/`. La estructura de archivos aquí define las rutas URL de tu API.
    *   **Archivo Ejemplo:** `src/pages/api/traits/index.ts` (maneja la ruta `/api/traits`).
    *   **Responsabilidad:**
        *   Recibir la solicitud HTTP (`req`).
        *   Determinar el método HTTP (GET, POST, PUT, DELETE, etc.).
        *   **Delegar** el manejo de la lógica específica de la solicitud a la capa de Controlador apropiada.
        *   No contiene lógica de negocio ni acceso directo a datos.
    *   **Código Ejemplo (`src/pages/api/traits/index.ts`):**
        ```typescript
        import type { NextApiRequest, NextApiResponse } from 'next';
        // Importa el manejador específico y el tipo de datos del controlador
        import { handleGetAllTraits, ResponseData } from '@/app/controllers/traitController';

        export default async function handler(
          req: NextApiRequest,
          res: NextApiResponse<ResponseData>
        ) {
          // Verifica el método HTTP
          if (req.method === 'GET') {
            // Delega el manejo al controlador
            await handleGetAllTraits(req, res);
          } else {
            // Maneja otros métodos (ej. no permitidos)
            res.setHeader('Allow', ['GET']);
            res.status(405).json({ message: `Method ${req.method} Not Allowed` });
          }
        }
        ```

2.  **Capa de Controlador (Controller):**
    *   **Ubicación:** Se sugiere un directorio como `src/app/controllers/`.
    *   **Archivo Ejemplo:** `src/app/controllers/traitController.ts`.
    *   **Responsabilidad:**
        *   Recibe `req` y `res` desde la capa de Ruta.
        *   Puede realizar validaciones básicas de la solicitud (aunque validaciones complejas podrían ir en el servicio).
        *   Llama a los métodos apropiados de la capa de Servicio para ejecutar la lógica de negocio o acceder a los datos.
        *   Maneja la respuesta HTTP: formatea los datos recibidos del servicio y los envía de vuelta al cliente (`res.status(...).json(...)`).
        *   Maneja los errores que puedan ocurrir durante la llamada al servicio y envía respuestas de error adecuadas.
    *   **Código Ejemplo (`src/app/controllers/traitController.ts`):**
        ```typescript
        import type { NextApiRequest, NextApiResponse } from 'next';
        import { getAllTraits } from '@/app/services/traitService';
        import { Trait } from '@prisma/client';

        // Exporta el tipo de datos para usarlo en la capa de Ruta
        export type ResponseData = {
          message?: string;
          traits?: Trait[];
          error?: string;
        };

        export const handleGetAllTraits = async (
          req: NextApiRequest,
          res: NextApiResponse<ResponseData>
        ): Promise<void> => {
          try {
            // Llama al servicio para obtener los datos
            const traits = await getAllTraits();
            // Envía la respuesta exitosa
            res.status(200).json({ traits });
          } catch (error) {
            console.error("API Controller Error fetching traits:", error);
            // Envía la respuesta de error
            res.status(500).json({ error: 'Failed to fetch traits' });
          }
        };
        ```

3.  **Capa de Servicio (Service):**
    *   **Ubicación:** Se sugiere un directorio como `src/app/services/`.
    *   **Archivo Ejemplo:** `src/app/services/traitService.ts`.
    *   **Responsabilidad:**
        *   Contiene la lógica de negocio principal.
        *   Interactúa con la capa de acceso a datos (Repositorio, ORM como Prisma, etc.) para obtener o modificar datos.
        *   Puede llamar a otras APIs externas si es necesario.
        *   Realiza transformaciones o cálculos sobre los datos.
        *   Devuelve los datos (o errores) a la capa de Controlador.
    *   **Código Ejemplo (Conceptual - `src/app/services/traitService.ts`):**
        ```typescript
        import prisma from '@/utils/prisma'; // Asumiendo que tienes configurado Prisma
        import { Trait } from '@prisma/client';

        /**
         * Obtiene todos los traits de la base de datos.
         */
        export const getAllTraits = async (): Promise<Trait[]> => {
          try {
            const traits = await prisma.trait.findMany();
            return traits;
          } catch (error) {
            console.error("Service Error fetching traits:", error);
            // Relanza el error para que el controlador lo maneje
            throw new Error('Failed to retrieve traits from database.');
          }
        };

        // Otras funciones del servicio (getTraitById, createTrait, etc.) irían aquí
        ```

## Flujo de una Solicitud GET /api/traits

1.  El cliente envía una solicitud `GET` a `/api/traits`.
2.  Next.js dirige la solicitud al manejador en `src/pages/api/traits/index.ts`.
3.  El manejador verifica que el método es `GET` y llama a `handleGetAllTraits` en `src/app/controllers/traitController.ts`, pasando `req` y `res`.
4.  `handleGetAllTraits` llama a `getAllTraits` en `src/app/services/traitService.ts`.
5.  `getAllTraits` usa Prisma (o tu método de acceso a datos) para buscar todos los `Trait` en la base de datos.
6.  El servicio devuelve la lista de `Trait` (o lanza un error) al controlador.
7.  El controlador recibe los datos (o el error).
    *   Si tiene éxito, formatea la respuesta JSON con los `Trait` y la envía con estado 200 (`res.status(200).json({ traits })`).
    *   Si hay un error, registra el error y envía una respuesta JSON con estado 500 (`res.status(500).json({ error: '...' })`).
8.  La respuesta HTTP es enviada de vuelta al cliente.

Este enfoque modular ayuda a mantener tu código base organizado y escalable.
