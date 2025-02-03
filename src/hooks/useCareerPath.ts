'use client';

import { getPlayers, getRandomPlayer } from '@/app/actions';
import { Player, Prisma } from '@prisma/client';
import { Key, useState } from 'react';

const useCareerPath = () => {
  const [streak, setStreak] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>();
  const [possibleAnswers, setPossibleAnswers] = useState<Player[] | null>([]);
  const [playerPoolFilter, setPlayerPoolFilter] = useState<Prisma.PlayerWhereInput>();

  const onStart = () => {
    setCurrentPlayer(null);
    getRandomPlayer(playerPoolFilter).then((player) => {
      setCurrentPlayer(player);
      getPlayers({ where: { team_history: { equals: player?.team_history } } }).then(
        setPossibleAnswers,
      );
    });
  };

  const checkGuess = (
    key: Key | null,
    onCorrect: (correctPlayer: Player) => void,
    onIncorrect: (possibleAnswers: Player[]) => void,
  ) => {
    if (key) {
      const previousPossibleAnswers = possibleAnswers;
      const guessedPlayer = possibleAnswers?.find((player) => player.id == key);
      if (guessedPlayer) {
        onCorrect(guessedPlayer);
        setStreak(streak + 1);
      } else {
        onIncorrect(previousPossibleAnswers!);
        setStreak(0);
      }
      onStart();
    }
  };

  return { currentPlayer, setPlayerPoolFilter, onStart, checkGuess, streak };
};

export default useCareerPath;
