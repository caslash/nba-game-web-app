import { gameActor } from '@/lib/statemachine';
import next from 'next';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  gameActor.start();
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  io.on('connection', (socket) => {
    gameActor.send({ type: 'CONNECT' });
    console.log(`Client connected on socket: ${socket}`);
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
