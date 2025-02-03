import { PrismaClient } from '@prisma/client';
import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

@injectable()
export class Context {
  constructor(
    @inject('PrismaClient')
    public prisma: PrismaClient,
  ) {}
}
