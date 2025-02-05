'use server';

import { Context } from '@/database/prisma.context';
import { Player, Prisma } from '@prisma/client';
import 'reflect-metadata';
import { container } from 'tsyringe';
import '../database/prisma.symbol';

export async function getPlayers<T extends Prisma.PlayerFindManyArgs>({
  args,
  ctx = container.resolve(Context),
}: { args?: Prisma.SelectSubset<T, Prisma.PlayerFindManyArgs<any>>; ctx?: Context } = {}) {
  try {
    return await ctx.prisma.player.findMany(args);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getPlayer<T extends Prisma.PlayerFindFirstArgs>({
  args,
  ctx = container.resolve(Context),
}: {
  args?: Prisma.SelectSubset<T, Prisma.PlayerFindFirstArgs<any>>;
  ctx?: Context;
} = {}) {
  try {
    return await ctx.prisma.player.findFirst(args);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getPlayerCount({
  ctx = container.resolve(Context),
}: { ctx?: Context } = {}): Promise<number> {
  try {
    return await ctx.prisma.player.count();
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getRandomPlayer({
  where,
  ctx = container.resolve(Context),
}: { where?: Prisma.PlayerWhereInput; ctx?: Context } = {}): Promise<Player | null> {
  const playerIds = (await getPlayers({ args: { where: where, select: { id: true } }, ctx })).map(
    (player) => player.id,
  );
  const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];
  const randomPlayer = await getPlayer({ args: { where: { id: { equals: randomId } } }, ctx });

  return randomPlayer;
}
