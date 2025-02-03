import { PrismaClient } from '@prisma/client';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { prisma } from './prisma.implementation';

container.register<PrismaClient>('PrismaClient', {
  useValue: prisma,
});
