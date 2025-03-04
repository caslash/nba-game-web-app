import {
  createMultiplayerRoom,
  createSinglePlayerRoom,
} from '@/server/lib/singleplayer/roomFactory';
import { Server as HttpServer } from 'http';
import ShortUniqueId from 'short-unique-id';
import { Server, Socket } from 'socket.io';
import { Room } from './models/room';
const uid = new ShortUniqueId({ length: 4, dictionary: 'alpha_upper' });

export const createServerSocket = (httpServer: HttpServer): Server => {
  const gameMachines: Record<string, Room> = {};

  const io = new Server(httpServer);

  io.on('connection', async (socket) => {
    console.log(`Client connected on socket ${socket.id}`);

    socket.on('host_room', (isMulti: boolean, userName: string) => {
      const roomId = generateUniqueCode();

      if (!gameMachines[roomId]) {
        gameMachines[roomId] = {
          id: roomId,
          stateMachine: isMulti
            ? createMultiplayerRoom(io, roomId)
            : createSinglePlayerRoom(socket),
          users: [],
        };
      }

      joinRoom(socket, roomId, userName);
    });

    socket.on('join_room', (roomId: string, userName: string) => {
      joinRoom(socket, roomId, userName);
    });

    socket.on('disconnecting', (roomId: string) => {
      gameMachines[roomId] = {
        ...gameMachines[roomId],
        users: [...gameMachines[roomId].users.filter((user) => user.id !== socket.id)],
      };

      if (gameMachines[roomId].users.length == 0) {
        delete gameMachines[roomId];
      }
    });
  });

  function joinRoom(socket: Socket, roomId: string, userName: string) {
    socket.join(roomId);

    gameMachines[roomId] = {
      ...gameMachines[roomId],
      users: [...gameMachines[roomId].users, { id: socket.id, name: userName }],
    };

    const { stateMachine, ...room } = gameMachines[roomId];

    io.to(roomId).emit('room_joined', room);
  }

  function generateUniqueCode(): string {
    const roomId = uid.randomUUID();
    if (gameMachines.hasOwnProperty(roomId)) {
      return generateUniqueCode();
    }

    return roomId;
  }
  return io;
};
