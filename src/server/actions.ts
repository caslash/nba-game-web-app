'use server';

import { Context } from '@/database/prisma.context';
import { Prisma } from '@prisma/client';
import 'reflect-metadata';
import { container } from 'tsyringe';
import '../database/prisma.symbol';

export async function getPlayers<T extends Prisma.PlayerFindManyArgs>(
  args?: Prisma.SelectSubset<T, Prisma.PlayerFindManyArgs<any>>,
  ctx: Context = container.resolve(Context),
) {
  return await ctx.prisma.player.findMany(args);
}

export async function getPlayer<T extends Prisma.PlayerFindFirstArgs>(
  args?: Prisma.SelectSubset<T, Prisma.PlayerFindFirstArgs<any>>,
  ctx: Context = container.resolve(Context),
) {
  return await ctx.prisma.player.findFirst(args);
}

export async function getRandomPlayer(
  where?: Prisma.PlayerWhereInput,
  ctx: Context = container.resolve(Context),
) {
  const playerIds = (await getPlayers({ where: where, select: { id: true } }, ctx)).map(
    (player) => player.id,
  );
  const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];
  const randomPlayer = await getPlayer({ where: { id: { equals: randomId } } }, ctx);

  return randomPlayer;
}

export async function getPlayerCount(ctx: Context = container.resolve(Context)) {
  return await ctx.prisma.player.count();
}
