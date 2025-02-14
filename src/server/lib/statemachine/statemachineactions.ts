import { Player } from '@prisma/client';
import { DefaultEventsMap, Server } from 'socket.io';

type ActionProps = {
  context: {
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    roomId: string;
    gameState: {
      round: number;
      score: number;
      currentPlayer: Player | undefined;
    };
  };
};

export const waitForPlayers = ({ context }: ActionProps) => {
  const { io, roomId } = context;
  io.to(roomId).emit('waiting_for_players');
};

export const sendPlayerToClient = ({ context }: ActionProps) => {
  const { io, roomId, gameState } = context;
  const { round, score, currentPlayer } = gameState;

  const team_history = currentPlayer?.team_history?.split(',');

  io.to(roomId).emit('next_round', { round, score, team_history });
};
