import { Player } from '@prisma/client';
import { Socket } from 'socket.io';

type ActionProps = {
  context: {
    socket: Socket;
    roomId: string;
    gameState: {
      round: number;
      score: number;
      currentPlayer: Player | undefined;
    };
  };
};

export const waitForPlayers = ({ context }: ActionProps) => {
  const { socket, roomId } = context;
  socket.to(roomId).emit('waiting_for_players');
};

export const sendPlayerToClient = ({ context }: ActionProps) => {
  const { socket, roomId, gameState } = context;
  const { round, score, currentPlayer } = gameState;

  const team_history = currentPlayer?.team_history?.split(',');

  socket.to(roomId).emit('next_round', { round, score, team_history });
};
