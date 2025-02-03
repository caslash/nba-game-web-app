import { createActor, createMachine } from 'xstate';

export const gameMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QHECGBbMACAsqgxgBYCWAdmAHTEQA2YAxAMIDyAcqwKKMAqA2gAwBdRKAAOAe1jEALsXGkRIAB6IAjACYArBQCcq-pp0BmAGxH1ADh2b1RgDQgAnoguqKR-vyPfTFm6pNNAF8ghzRMXAIScgooDDAAQXxZADdKAHdUGQAxcQAnAAUaVEcwPNh6AGVuBIAlPiFFCSlZeUUVBA8jChMTCwsPax0dCwB2ABYHZwQTCYpxnXUdcb7Rq3GjUZCw+MiiMko4zCTUylhpVDzZUihwhgh5SjIU8QBrSju96MP4k+I0ijnS7XW7xBDPcT4VCtUgCQRwpqSGRyBRIZSIEzqfgUTQWSx6CwGUYmKYY0baYZeCbWMYDEzbECfPD7GJHRLJf6HMDkPLQshQWriACupAg9AeMQh7woTKiB1ivw5AJgPL5N0FIog4NILyhMLhCLRzWRbTRHX0mm6FnGtlURnGNsMNlJMxM2J0Jg2w0W41Umn49NCjN2zO+CuOSoyWWkuTyyCFcAqjAAMgBJDisbgAfWQAFUOJVKoaxEiYe01KpVBYekZVKMhpb1BpNC7fdjRuYzBtcVp+H6GbKWT8I6cKKI8pDE-z44n6MWQMay2aMVicXirFWiSSnBiDBQ1np-R2A6N+Fsg4Ow2y-gDx5PYFIbjOH3PVMIjaWUeWZquexvCZoxIupomgmDioH1kYfiEl4OgDiGcqsoqo5kPg+R5GAyTPhUEpPDqbwfAhQ7huyKGkGheQYVhCYPtqup8vIBqNB+LRfsuCAWlaNq1vajrWOowEgRQhKuBoKweloRghEGpDiBAcCKJeByIqxpqgB0AC0OguhpYGePplYaH4OhnuM8ERKG8rUHQKkmqi6mIDaLquBQVZVishJQR2dbmdgllISOnK2UuDmdNpO6dLY4FnrYuKzPwDq+V88rXpGFCZDk+RFCUZTwCxdnfmMLqBG4CWeIsp7WuoJhwReRFXshnKAhcVzTvEwVsaFvrjBQtgTHafSYpBLYRSVFBlfwFX8FVNVJf5w6kU1KplGqArCqKHVqeiCCefM6gLBM5LjGsmiqMVpjjao4wGDYk06OS547BZiELTeUaZXGNF5SWqn2dtGgmfuoFLPotYaEYI3TCBYE1eocNjAYDqaGZdXPcRqWjne+BTk+X2bX9HSOr1Zh+KM5KbJiZ7AYs4HVZ6NWeB26hzS9JFvVQ5HoZh0jYfj36QT03mVrijbjJDiCWtipMDPwTaLIN0lBEAA */
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
            entry: [
              {
                type: 'waitForPlayers',
              },
            ],
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
  },
  {
    guards: {
      isCorrect: ({ context }) => {
        //Do something
        return true;
      },
    },
    actions: {
      waitForPlayers: (context, event) => {
        console.log('WAITING FOR PLAYERS');
      },
      startGame: (context, event) => {},
      generateRound: (context, event) => {},
      processGuess: (context, event) => {},
      notifyIncorrectGuess: (context, event) => {},
    },
  },
);

export const gameActor = createActor(gameMachine);
