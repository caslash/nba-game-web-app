import { Prisma } from '@prisma/client';
import { z } from 'zod';

const firstAllNBA: Prisma.PlayerWhereInput = {
  AND: [
    {
      team_history: {
        contains: ',',
      },
    },
    {
      from_year: {
        gte: 1980,
      },
    },
    {
      OR: [
        {
          player_accolades: {
            accolades: {
              path: ['PlayerAwards'],
              array_contains: [
                {
                  SUBTYPE2: 'KIANT',
                  ALL_NBA_TEAM_NUMBER: '1',
                },
              ],
            },
          },
        },
      ],
    },
  ],
};

const allNBA: Prisma.PlayerWhereInput = {
  AND: [
    {
      team_history: {
        contains: ',',
      },
    },
    {
      from_year: {
        gte: 1980,
      },
    },
    {
      OR: [
        {
          player_accolades: {
            accolades: {
              path: ['PlayerAwards'],
              array_contains: [
                {
                  SUBTYPE2: 'KIANT',
                  ALL_NBA_TEAM_NUMBER: '1',
                },
              ],
            },
          },
        },
        {
          player_accolades: {
            accolades: {
              path: ['PlayerAwards'],
              array_contains: [
                {
                  SUBTYPE2: 'KIANT',
                  ALL_NBA_TEAM_NUMBER: '2',
                },
              ],
            },
          },
        },
        {
          player_accolades: {
            accolades: {
              path: ['PlayerAwards'],
              array_contains: [
                {
                  SUBTYPE2: 'KIANT',
                  ALL_NBA_TEAM_NUMBER: '3',
                },
              ],
            },
          },
        },
      ],
    },
  ],
};

const currentPlayers: Prisma.PlayerWhereInput = {
  is_active: {
    equals: true,
  },
};

export class GameDifficulties {
  static firstAllNBA: GameDifficulty = {
    name: 'firstallnba',
    display_name: '1st Team All-NBA Players',
    description: 'Every player that has appeared on the All-NBA 1st team.',
    filter: firstAllNBA,
  };

  static allNBA: GameDifficulty = {
    name: 'allnba',
    display_name: 'All-NBA Players',
    description: 'Every player that had appeard on any All-NBA team.',
    filter: allNBA,
  };

  static currentPlayers: GameDifficulty = {
    name: 'currentplayers',
    display_name: 'Current Players',
    description: 'Every player currently on an NBA roster',
    filter: currentPlayers,
  };

  static allPlayers: GameDifficulty = {
    name: 'allplayers',
    display_name: 'All Players',
    description: 'Every. Single. Player. Ever.',
    filter: {},
  };

  static allModes: GameDifficulty[] = [
    GameDifficulties.firstAllNBA,
    GameDifficulties.allNBA,
    GameDifficulties.currentPlayers,
    GameDifficulties.allPlayers,
  ];
}

export interface GameDifficulty {
  name: string;
  display_name: string;
  description: string;
  filter: Prisma.PlayerWhereInput;
}

const gameDifficultyNames = GameDifficulties.allModes.map((mode) => mode.name);

export const GameDifficultySchema = z
  .enum([gameDifficultyNames[0], ...gameDifficultyNames.slice(1)])
  .transform((val) => {
    const difficulty = GameDifficulties.allModes.find((mode) => mode.name === val);
    return difficulty!;
  });
