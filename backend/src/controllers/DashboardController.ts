import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ResponseFormatter } from '../utils/ResponseFormatter';
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';

const prisma = new PrismaClient();

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

export class DashboardController {
  /**
   * Get dashboard statistics
   */
  static async getStats(_req: Request, res: Response) {
    try {
      const today = new Date();
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);
      const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // Lunedì
      const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 });

      // Statistiche pazienti
      const [totalPatients, activePatients] = await Promise.all([
        prisma.patient.count(),
        prisma.patient.count({
          where: {
            deletedAt: null, // Pazienti non eliminati
          },
        }),
      ]);

      // Statistiche sedute
      const [todaySessions, weekSessions] = await Promise.all([
        prisma.therapySession.count({
          where: {
            sessionDate: {
              gte: startOfToday,
              lte: endOfToday,
            },
          },
        }),
        prisma.therapySession.count({
          where: {
            sessionDate: {
              gte: startOfThisWeek,
              lte: endOfThisWeek,
            },
          },
        }),
      ]);

      // Statistiche terapie
      const [activeTherapies, completedTherapies] = await Promise.all([
        prisma.therapy.count({
          where: {
            status: 'IN_PROGRESS',
          },
        }),
        prisma.therapy.count({
          where: {
            status: 'COMPLETED',
          },
        }),
      ]);

      // Statistiche cartelle cliniche
      const [openRecords, totalRecords] = await Promise.all([
        prisma.clinicalRecord.count({
          where: {
            closedAt: null, // Cartelle non chiuse
          },
        }),
        prisma.clinicalRecord.count(),
      ]);

      const stats = {
        totalPatients,
        activePatients,
        todaySessions,
        weekSessions,
        activeTherapies,
        completedTherapies,
        openRecords,
        totalRecords,
      };

      return ResponseFormatter.success(res, stats);
    } catch (error) {
      return ResponseFormatter.error(res, error);
    }
  }

  /**
   * Get today's sessions
   */
  static async getTodaySessions(_req: Request, res: Response) {
    try {
      const today = new Date();
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);

      const sessions = await prisma.therapySession.findMany({
        where: {
          sessionDate: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
        include: {
          therapy: {
            include: {
              clinicalRecord: {
                include: {
                  patient: true,
                },
              },
              therapyType: true,
            },
          },
          therapist: true,
        },
        orderBy: {
          sessionDate: 'asc',
        },
      });

      const formattedSessions = sessions.map(session => ({
        id: session.id,
        time: new Date(session.sessionDate).toLocaleTimeString('it-IT', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        patientName: `${session.therapy.clinicalRecord.patient.firstName} ${session.therapy.clinicalRecord.patient.lastName}`,
        therapyType: session.therapy.therapyType.name,
        therapist: `${session.therapist.firstName} ${session.therapist.lastName}`,
        room: 'Sala 1', // Campo non presente nello schema
        status: session.status,
      }));

      return ResponseFormatter.success(res, formattedSessions);
    } catch (error) {
      return ResponseFormatter.error(res, error);
    }
  }

  /**
   * Get therapy statistics
   */
  static async getTherapyStats(_req: Request, res: Response) {
    try {
      // Conta le terapie per tipo
      const therapyStats = await prisma.therapy.groupBy({
        by: ['therapyTypeId'],
        _count: {
          id: true,
        },
      });

      // Ottieni i dettagli dei tipi di terapia
      const therapyTypes = await prisma.therapyType.findMany({
        where: {
          id: {
            in: therapyStats.map(stat => stat.therapyTypeId),
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      // Calcola il totale
      const total = therapyStats.reduce((sum, stat) => sum + stat._count.id, 0);

      // Combina i dati e calcola le percentuali
      const stats = therapyStats
        .map(stat => {
          const therapyType = therapyTypes.find(t => t.id === stat.therapyTypeId);
          return {
            name: therapyType?.name || 'Sconosciuto',
            count: stat._count.id,
            percentage: Math.round((stat._count.id / total) * 100),
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 7); // Top 7 terapie

      // Se ci sono più di 7 tipi, aggiungi "Altri"
      if (therapyStats.length > 7) {
        const othersCount = therapyStats
          .slice(7)
          .reduce((sum, stat) => sum + stat._count.id, 0);
        
        stats.push({
          name: 'Altri',
          count: othersCount,
          percentage: Math.round((othersCount / total) * 100),
        });
      }

      return ResponseFormatter.success(res, stats);
    } catch (error) {
      return ResponseFormatter.error(res, error);
    }
  }

  /**
   * Get recent activities
   */
  static async getRecentActivities(_req: Request, res: Response) {
    try {
      // Ultime attività (ultimi pazienti, terapie, cartelle)
      const activities: Activity[] = [];

      // Ultimi pazienti aggiunti
      const recentPatients = await prisma.patient.findMany({
        take: 2,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          createdAt: true,
        },
      });

      recentPatients.forEach(patient => {
        activities.push({
          id: `patient-${patient.id}`,
          type: 'patient_added',
          description: `Nuovo paziente: ${patient.firstName} ${patient.lastName}`,
          timestamp: patient.createdAt.toISOString(),
          user: 'Sistema',
        });
      });

      // Ultime terapie completate
      const recentTherapies = await prisma.therapy.findMany({
        where: {
          status: 'COMPLETED',
        },
        take: 2,
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          clinicalRecord: {
            include: {
              patient: true,
            },
          },
          therapyType: true,
        },
      });

      recentTherapies.forEach(therapy => {
        activities.push({
          id: `therapy-${therapy.id}`,
          type: 'therapy_completed',
          description: `Terapia completata: ${therapy.clinicalRecord.patient.firstName} ${therapy.clinicalRecord.patient.lastName} - ${therapy.therapyType.name}`,
          timestamp: therapy.updatedAt.toISOString(),
          user: 'Sistema',
        });
      });

      // Ultime cartelle cliniche create
      const recentRecords = await prisma.clinicalRecord.findMany({
        take: 2,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          patient: true,
          createdBy: true,
        },
      });

      recentRecords.forEach(record => {
        activities.push({
          id: `record-${record.id}`,
          type: 'record_created',
          description: `Nuova cartella clinica: ${record.patient.firstName} ${record.patient.lastName}`,
          timestamp: record.createdAt.toISOString(),
          user: `Dr. ${record.createdBy.lastName}`,
        });
      });

      // Ordina per timestamp e prendi le prime 5
      activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return ResponseFormatter.success(res, activities.slice(0, 5));
    } catch (error) {
      return ResponseFormatter.error(res, error);
    }
  }
}
