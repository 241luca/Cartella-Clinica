import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ResponseFormatter } from '../utils/ResponseFormatter';

const prisma = new PrismaClient();

// Schema per creare un tipo di terapia
const createTherapyTypeSchema = z.object({
  code: z.string().min(2).max(20),
  name: z.string().min(3),
  category: z.string(),
  description: z.string().optional(),
  defaultDuration: z.number().min(5).default(30),
  defaultSessions: z.number().min(1).default(10),
  requiresDoctor: z.boolean().default(false),
  requiresEquipment: z.boolean().default(false),
  parametersSchema: z.record(z.any()).optional(),
});

// Schema per aggiornare un tipo di terapia
const updateTherapyTypeSchema = createTherapyTypeSchema.partial();

export class TherapyTypeController {
  // GET /api/therapy-types - Lista tutti i tipi di terapia
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, isActive = true } = req.query;
      
      const where: any = {};
      
      if (category) {
        where.category = category;
      }
      
      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const therapyTypes = await prisma.therapyType.findMany({
        where,
        orderBy: [
          { category: 'asc' },
          { name: 'asc' }
        ],
      });

      ResponseFormatter.success(res, therapyTypes, 'Tipi di terapia recuperati con successo');
    } catch (error) {
      next(error);
    }
  }

  // GET /api/therapy-types/:id - Dettaglio tipo di terapia
  static async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const therapyType = await prisma.therapyType.findUnique({
        where: { id },
        include: {
          _count: {
            select: { therapies: true }
          }
        },
      });

      if (!therapyType) {
        ResponseFormatter.notFound(res, 'Tipo di terapia non trovato');
        return;
      }

      ResponseFormatter.success(res, therapyType, 'Tipo di terapia recuperato con successo');
    } catch (error) {
      next(error);
    }
  }

  // POST /api/therapy-types - Crea nuovo tipo di terapia
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createTherapyTypeSchema.parse(req.body);

      // Verifica che il codice non esista già
      const existing = await prisma.therapyType.findUnique({
        where: { code: validatedData.code },
      });

      if (existing) {
        ResponseFormatter.conflict(res, 'Codice tipo terapia già esistente');
        return;
      }

      const therapyType = await prisma.therapyType.create({
        data: validatedData,
      });

      ResponseFormatter.created(res, therapyType, 'Tipo di terapia creato con successo');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseFormatter.validationError(res, error.errors, 'Dati tipo terapia non validi');
        return;
      }
      next(error);
    }
  }

  // PUT /api/therapy-types/:id - Aggiorna tipo di terapia
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateTherapyTypeSchema.parse(req.body);

      const existing = await prisma.therapyType.findUnique({
        where: { id },
      });

      if (!existing) {
        ResponseFormatter.notFound(res, 'Tipo di terapia non trovato');
        return;
      }

      // Se si sta cambiando il codice, verifica che non esista già
      if (validatedData.code && validatedData.code !== existing.code) {
        const codeExists = await prisma.therapyType.findUnique({
          where: { code: validatedData.code },
        });

        if (codeExists) {
          ResponseFormatter.conflict(res, 'Codice tipo terapia già in uso');
          return;
        }
      }

      const therapyType = await prisma.therapyType.update({
        where: { id },
        data: validatedData,
      });

      ResponseFormatter.updated(res, therapyType, 'Tipo di terapia aggiornato con successo');
    } catch (error) {
      if (error instanceof z.ZodError) {
        ResponseFormatter.validationError(res, error.errors, 'Dati tipo terapia non validi');
        return;
      }
      next(error);
    }
  }

  // DELETE /api/therapy-types/:id - Disattiva tipo di terapia
  static async deactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const therapyType = await prisma.therapyType.findUnique({
        where: { id },
        include: {
          _count: {
            select: { therapies: true }
          }
        },
      });

      if (!therapyType) {
        ResponseFormatter.notFound(res, 'Tipo di terapia non trovato');
        return;
      }

      // Non permettere disattivazione se ci sono terapie attive
      if (therapyType._count.therapies > 0) {
        const activeTherapies = await prisma.therapy.count({
          where: {
            therapyTypeId: id,
            status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
          }
        });

        if (activeTherapies > 0) {
          ResponseFormatter.conflict(res, 'Impossibile disattivare tipo con terapie attive');
          return;
        }
      }

      const updated = await prisma.therapyType.update({
        where: { id },
        data: { isActive: false },
      });

      ResponseFormatter.success(res, updated, 'Tipo di terapia disattivato con successo');
    } catch (error) {
      next(error);
    }
  }

  // POST /api/therapy-types/:id/activate - Riattiva tipo di terapia
  static async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const therapyType = await prisma.therapyType.findUnique({
        where: { id },
      });

      if (!therapyType) {
        ResponseFormatter.notFound(res, 'Tipo di terapia non trovato');
        return;
      }

      const updated = await prisma.therapyType.update({
        where: { id },
        data: { isActive: true },
      });

      ResponseFormatter.success(res, updated, 'Tipo di terapia riattivato con successo');
    } catch (error) {
      next(error);
    }
  }

  // GET /api/therapy-types/categories - Lista categorie disponibili
  static async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const therapyTypes = await prisma.therapyType.findMany({
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' },
      });

      const categories = therapyTypes.map(t => t.category);

      ResponseFormatter.success(res, categories, 'Categorie recuperate con successo');
    } catch (error) {
      next(error);
    }
  }
}
