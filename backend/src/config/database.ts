import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

export default prisma;

// Gestione connessione in caso di hot-reload in development
if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  if (global.prisma) {
    // @ts-ignore
    prisma = global.prisma;
  } else {
    // @ts-ignore
    global.prisma = prisma;
  }
}
