import next from 'next';
import { createServer } from 'node:http';

import { createServerSocket } from '@/server/lib/serverSocket';
import { Actor, AnyStateMachine } from 'xstate';
import { createGameMachine } from './lib/statemachine/statemachine';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const gameMachines: Record<string, Actor<AnyStateMachine>> = {};

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = createServerSocket(httpServer);

  io.on('connection', (socket) => {
    console.log(`Client connected on socket ${socket.id}`);

    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);

      if (!gameMachines[roomId]) {
        gameMachines[roomId] = createGameMachine(socket, roomId);
      }

      gameMachines[roomId].start();

      gameMachines[roomId].subscribe((s) => {
        socket.emit('state_change', s.value);
      });

      gameMachines[roomId].send({ type: 'CONNECT', socket });

      socket.on('start_game', () => gameMachines[roomId].send({ type: 'START' }));

      socket.on('client_guess', (guess: string) =>
        gameMachines[roomId].send({ type: 'PLAYER_GUESS', guess }),
      );

      socket.on('disconnect', () => {
        console.log(`Client disconnected from socket ${socket.id}`);
        gameMachines[roomId].send({ type: 'DISCONNECT' });
      });
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
