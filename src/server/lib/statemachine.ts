import { createActor, fromPromise, setup } from 'xstate';

export const gameMachine = setup({
  actions: {
    waitForPlayers: () => {
      console.log('WAITING FOR PLAYERS');
    },
  },
  actors: {
    startGame: fromPromise(async ({ input }) => {}),
    generateRound: fromPromise(async ({ input }) => {}),
    processGuess: fromPromise(async ({ input }) => {}),
    notifyIncorrectGuess: fromPromise(async ({ input }) => {}),
  },
  guards: {
    isCorrect: ({ context }) => {
      //Do something
      return true;
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QHECGBbMACAsqgxgBYCWAdmAHTEQA2YAxAMIDyAcqwKKMAqA2gAwBdRKAAOAe1jEALsXGkRIAB6IAjACYArBQCcenQA4AbOoAsAZnWWA7NYA0IAJ6IDqipv6fVGowfMH1a1MAX2CHNExcAhJyCigMMABBfFkAN0oAd1QZADFxACcABRpURzB82HoAZW5EgCU+IUUJKVl5RRUEc351ClV+HXMjU1Vzcx1TfiNzB2cEI2sjCj8x-wtTTXVjUPCEqKIySnjMZLTKWGlUfNlSKAiGCHlKMlTxAGtKe-2Yo4TT4nSFAuVxudwSCBe4nwqDapAEgnhzUkMjkCiQykQRlUBgo1lc6l8mgMBh0Jk0s0xeIoq3MpiM-DptiJOxAXzwB1ixySKQBRzA5HyMLIUDq4gArqQIPRHrFIR8KGzooc4n8eYCYAKhbdRRKIBDSK9obD4Yj0S0Ue10Z1+h5caZ9Js9PbzOSnJjphQtF4PIsXRsWYqOb8TmrMtlpHl8sgxXBKowADIASQ4rG4AH1kABVDhVKqmsTI2EdNTeXo6KZmHpjZ32N0IEa9DyeLbWbrmVRGBYBvbsn4qkNnCiifJQ2PC6Ox+j5kDmotWzHY3H4wnE0laCnzfjWXREsb8Jsd0bdyK95Vc-6A4ej2BSW4Tm9T1TCM2F1HF+aLvE+AxEklkjeaES7ieD0Bj8K4qzWMe2CnpyqqDmQ+AFPkYApPelQys8BrvJ8PZKnBA68lQpBIfkKFoTGN76oaQryCaTQvq0b7zggNr8HaDrqE6gyunMgHbtYTZcVo-iBCELKkOIEBwIogY-EiTGWqAnQALQ6BuKlGNB3zKtQdAKRaaLKYgpjqBuAQUCB-Clr4olBNpsHBtyZwGXOxldOpdaWNoVmqEEWKDOMWlhKyeFBv2zlEVkuQFMUpTlPAjGGe+Bi1nMRiaOYyyrOB1g6N4PSqA5+FORe5yXNc44JK5zHuSMWWqJoJhYj0zU6JlG4ZVlKzdKl+X9OoRUhXJZ7wURGrlFqIripKNVKRiCBgW46hWKSOhWFMP6mJ1-i4geiz2gFmjFeF56hhQ0URgU6FzUZC0aKllmDIJpmLIEDIAZoOiekJHYjESDInX2Z2Dle+BjnelGJQWil3Z0pnaIYFjWP0HaaBYnl8e11KrAEWjo1sQOjYRgKIchqHSDdSVuQteVuMjmiqOtX3tZjiCZVlXr8O2ATWAMZihKEQA */
  id: 'Game Machine',
  initial: 'idle',
  states: {
    idle: {
      on: {
        CONNECT: 'gameActive',
      },
    },

    gameActive: {
      initial: 'waitForPlayers',
      states: {
        waitForPlayers: {
          entry: [{ type: 'waitForPlayers' }],
          on: {
            START: 'startingGame',
          },
        },
        startingGame: {
          invoke: {
            src: 'startGame',
            onDone: { target: 'generatingRound' },
          },
        },
        generatingRound: {
          invoke: {
            src: 'generateRound',
            onDone: { target: 'waitForGuess' },
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
              target: 'generatingRound',
            },
            { target: 'incorrectGuess' },
          ],
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

export const gameActor = createActor(gameMachine);
