'use client';

import { Image } from '@heroui/react';
import { Player } from '@prisma/client';
import NextImage from 'next/image';

const CorrectAnswerView = ({ correctPlayer }: Readonly<{ correctPlayer: Player }>) => {
  return (
    <div className="flex flex-col items-center">
      <p className="text-center">
        Correct! <span className="font-black">{correctPlayer.display_first_last}</span> was a
        correct answer.
      </p>
      <Image
        alt={`player-image-${correctPlayer.id}`}
        as={NextImage}
        src={`https://cdn.nba.com/headshots/nba/latest/260x190/${correctPlayer.id}.png`}
        width={260}
        height={190}
      />
    </div>
  );
};

const IncorrectAnswerView = ({ possibleAnswers }: Readonly<{ possibleAnswers: Player[] }>) => {
  return (
    <div className="flex flex-col items-center">
      <p className="text-center">Incorrect, the possible answers were:</p>
      <div className="flex flex-col items-center">
        {possibleAnswers.map((player) => (
          <div className="flex flex-row items-center" key={player.id}>
            <Image
              alt={`player-image-${player.id}`}
              as={NextImage}
              src={`https://cdn.nba.com/headshots/nba/latest/260x190/${player.id}.png`}
              width={65}
              height={47.5}
            />
            <p>{player.display_first_last}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { CorrectAnswerView, IncorrectAnswerView };
