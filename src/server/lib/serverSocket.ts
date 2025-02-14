import { createGameMachine } from '@/server/lib/statemachine/statemachine';
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { Actor, AnyStateMachine } from 'xstate';

const gameMachines: Record<string, Actor<AnyStateMachine>> = {};

export const startServerSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log(`Client connected on socket ${socket.id}`);

    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);

      if (!gameMachines[roomId]) {
        gameMachines[roomId] = createGameMachine(io, roomId);
      }

      gameMachines[roomId].subscribe((s) => {
        io.to(roomId).emit('state_change', s.value);
      });

      gameMachines[roomId].send({ type: 'CONNECT', io });

      socket.on('leave_room', (roomId: string) => {
        console.log(`Socket ${socket.id} leaving room ${roomId}`);
        gameMachines[roomId].send({ type: 'DISCONNECT' });

        socket.rooms.forEach((roomId) => {
          if (roomId === socket.id) return;

          const clientsInRoom = io.sockets.adapter.rooms.get(roomId);
          if (!clientsInRoom || clientsInRoom.size === 1) {
            console.log(`Room ${roomId} is empty. Deleting its game machine.`);
            delete gameMachines[roomId];
          }
        });
        socket.leave(roomId);
      });
    });

    socket.on('start_game', (roomId: string) => gameMachines[roomId].send({ type: 'START' }));

    socket.on('client_guess', (roomId: string, guess: string) =>
      gameMachines[roomId].send({ type: 'PLAYER_GUESS', guess }),
    );
    socket.on('disconnect', () => console.log(`Client disconnected from socket ${socket.id}`));
  });
};
