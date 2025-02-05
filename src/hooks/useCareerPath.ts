'use client';

import { Context } from '@/database/prisma.context';
import '@/database/prisma.symbol';
import { getPlayers, getRandomPlayer } from '@/server/actions';
import { Player, Prisma } from '@prisma/client';
import { useState } from 'react';
import { container } from 'tsyringe';

const useCareerPath = (ctx: Context = container.resolve(Context)) => {
  const [streak, setStreak] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [possibleAnswers, setPossibleAnswers] = useState<Player[]>([]);
  const [playerPoolFilter, setPlayerPoolFilter] = useState<Prisma.PlayerWhereInput>({});

  const onStart = () => {
    setCurrentPlayer(null);
    getRandomPlayer({ where: playerPoolFilter, ctx }).then((player) => {
      setCurrentPlayer(player);
      getPlayers({ args: { where: { team_history: { equals: player?.team_history } } }, ctx }).then(
        setPossibleAnswers,
      );
    });
  };

  const checkGuess = (
    id: number,
    onCorrect: (correctPlayer: Player) => void,
    onIncorrect: (possibleAnswers: Player[]) => void,
  ) => {
    const previousPossibleAnswers = possibleAnswers;
    const guessedPlayer = possibleAnswers?.find((player) => player.id == id);
    if (guessedPlayer) {
      onCorrect(guessedPlayer);
      setStreak(streak + 1);
    } else {
      onIncorrect(previousPossibleAnswers);
      setStreak(0);
    }
    onStart();
  };

  return { currentPlayer, setPlayerPoolFilter, onStart, checkGuess, streak };
};

export default useCareerPath;
