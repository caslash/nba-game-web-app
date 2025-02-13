'use server';

import prisma from '@/database/prismaClient';
import { Player, Prisma } from '@prisma/client';

export async function getPlayers<T extends Prisma.PlayerFindManyArgs>(
  args?: Prisma.SelectSubset<T, Prisma.PlayerFindManyArgs<any>>,
) {
  return await prisma.player.findMany(args);
}

export async function getPlayer<T extends Prisma.PlayerFindFirstArgs>(
  args?: Prisma.SelectSubset<T, Prisma.PlayerFindFirstArgs<any>>,
) {
  return await prisma.player.findFirst(args);
}

export async function getRandomPlayer(
  where?: Prisma.PlayerWhereInput,
): Promise<Player | undefined> {
  const playerIds = (await getPlayers({ where: where, select: { id: true } })).map(
    (player) => player.id,
  );
  const randomId = playerIds[Math.floor(Math.random() * playerIds.length)];
  const randomPlayer = await getPlayer({ where: { id: { equals: randomId } } });

  return randomPlayer ?? undefined;
}

export async function getPlayerCount() {
  return await prisma.player.count();
}
