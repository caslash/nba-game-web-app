import { Player } from '@prisma/client';
import { Socket } from 'socket.io';
import { Actor, AnyStateMachine, createActor, enqueueActions, fromPromise, setup } from 'xstate';

import { generateRound } from '@/server/lib/statemachineactors';

export function createGameMachine(socket: Socket, roomId: string): Actor<AnyStateMachine> {
  const gameMachine = setup({
    types: {} as {
      context: {
        socket: Socket;
        roomId: string;
        gameState: { round: number; score: number; currentPlayer: Player | undefined };
      };
    },
    actions: {
      waitForPlayers: ({ context }) => {
        const { socket, roomId } = context;
        socket.to(roomId).emit('waiting_for_players');
      },
      sendPlayerToClient: ({ context }) => {
        const { socket, roomId, gameState } = context;
        const { round, score, currentPlayer } = gameState;

        const team_history = currentPlayer?.team_history?.split(',');

        socket.to(roomId).emit('next_round', { round, score, team_history });
      },
    },
    actors: {
      generateRound,
      processGuess: fromPromise(async ({ input }) => {}),
      notifyCorrectGuess: fromPromise(async ({ input }) => {}),
      notifyIncorrectGuess: fromPromise(async ({ input }) => {}),
    },
    guards: {
      isCorrect: ({ context, event }) => {
        //Do something
        return true;
      },
    },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QDsBGBDAtFdBbMmu6AxgBYCWyYAdORADZgDEAwgPIByHAoiwCoBtAAwBdRKAAOAe1jkALuSnJxIAB6IAjAGYh1AGwAWAKwAOAEymNAdi16hegDQgAnojMBOA9Stnr7jWa+QlpaRgC+YU5oWDj4hCQUVNSxYACCxAoAbswAIgCSAMrsXLyCoirSsgpKKuoI2rqGphYm1rb2Tq4IZgZe7kLuZiaGWhoaJkJC4ZEg0dh4BERklDQp6Vk0AO7o8gBiUgBOAAr06M5gB7BMBXypAEplYkgglfKKys91RuPU4watZiEBh6o0cLkQRgMWmoPQMVns5m+eisegiUQw8ziS0SqwW63I2WosDk6AOCmQUAA4gsmMInpIZG8ap9ECZejCzIZ3ForBojEJhlZOhD2VZ-noQv8UbyrGjZhiUvFlkk1hkCaswFQDuhyVA7lIAK7ICBMCBKGiUTJSADWNDmiuxK2SeLVhJgWp1lD1huNCEtUmInqUdLpFUZ1Q+oDq2ls1BMRj0iYMQjMVkhBncwoQUI03is+fjiLMWgscvtCyVOOd+HxhO2e0OlINcCuLAAMnluBw+AB9SkAVW4BQKoeerwjtU0tis1B5aYs7QCaazfMaxnjEv87gLBjLCorjpVLo21AkBwDLa9TZbtPKY-D70nCG+Jl+bIBQJBGjBXV6ug0-ihIE9hQgYiZ7jEB4JE6qonmeF6wLIFLXohtIaPSLwPsyUYQj8fwfsCOY-m47h6NQkLWMEAxGNyJgmFoEGYos0FHjWro0MQhwHGAGQoVco4MlUj4sggbJeIEXI8qugpZlC7jUL0gxCGKPi2MWDEzOWWIsbibEnpQnEHNxvHNqhZpJP6trUFpzHKrpaTsbQyCGcZch8X6yBWoGEYhneglMpGaiaBoQKzu4Rg+BYnIARYWYeEY3juJ4Nh6O4rSjBEmlSBAcAqDZlYrGGQnYUFCCYMRZU9IxDo6bQDBgEVAVPsCcX8voRjqWmkL9Nysqafu2l2dWDkbI1E4iamXjxoMei+EYWgTJMRhZhKs6BOFUw0UlxjTOikGDVWsHqtQ9ZyPsxynOclxjcJOEIFoBi5sivQAQmj08pm4LPoC1CTAEcITGlejDNVUFDUdhLEqSurUvgN0lXUwO6B4wLFhMj1WGyWYdbof1DNyUIpgBoMHTBx7He6FyehS+pGhA8OBdGIXyVo4WRR1egxctX3AvJabfl1xgAQ9JO2Yd5N1jsZ2NqZ8D3sVjOaJCuM+K0+Zphm3NdB4ZFs0IAF0fmEpmKLBWsSNx3wcQl7IbLDNPiWZhxjRnJzQtkxTCuNG-FYpEmPCiaDElJv9ftYtk3px0uTxbl2-LTUiUjMKeIE7sY1jPMaF48LjL4vs7YMu6h0xZv2bWFrOVxMd8fbIliRykm8vyMlfamuZTICdEpsEqbuJlYRAA */
    id: `nba-game-machine-${roomId}`,
    initial: 'idle',
    context: {
      socket,
      roomId,
      gameState: {
        round: 0,
        score: 0,
        currentPlayer: undefined,
      },
    },
    states: {
      idle: {
        on: {
          CONNECT: 'gameActive',
        },
      },

      gameActive: {
        initial: 'waitForPlayers',
        on: {
          DISCONNECT: 'idle',
        },
        states: {
          waitForPlayers: {
            entry: enqueueActions(({ event, enqueue }) => {
              enqueue.assign({ socket: event.socket });
              enqueue('waitForPlayers');
            }),
            on: {
              START: 'startingGame',
            },
          },
          startingGame: {
            always: { target: 'generatingRound' },
          },
          generatingRound: {
            invoke: {
              src: 'generateRound',
              onDone: {
                target: 'waitForGuess',
                actions: enqueueActions(({ context, event, enqueue }) => {
                  enqueue.assign({
                    gameState: {
                      round: context.gameState.round + 1,
                      score: context.gameState.score,
                      currentPlayer: event.output,
                    },
                  });
                  enqueue('sendPlayerToClient');
                }),
              },
            },
          },
          waitForGuess: {
            on: {
              CLIENT_GUESS: 'processingGuess',
            },
          },
          processingGuess: {
            always: [
              {
                guard: 'isCorrect',
                target: 'correctGuess',
              },
              { target: 'incorrectGuess' },
            ],
          },
          correctGuess: {
            entry: enqueueActions(({ enqueue }) => {}),
            always: { target: 'generatingRound' },
          },
          incorrectGuess: {
            invoke: {
              src: 'notifyIncorrectGuess',
              onDone: { target: 'waitForGuess' },
            },
          },
        },
      },
    },
  });

  return createActor(gameMachine);
}
