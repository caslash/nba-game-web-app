import { Player } from '@prisma/client';
import { fromPromise } from 'xstate';

import { getRandomPlayer } from '@/server/actions';

export const generateRound = fromPromise(
  async ({ input }: { input: any }): Promise<Player | undefined> => {
    return await getRandomPlayer({
      is_active: { equals: true },
      team_history: { contains: ',' },
    });
  },
);

export const processGuess = fromPromise(async ({ input }) => {});

export const notifyCorrectGuess = fromPromise(async ({ input }) => {});

export const notifyIncorrectGuess = fromPromise(async ({ input }) => {});
