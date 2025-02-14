'use client';

import { CareerPath } from '@/components/careerpath/careerpathview';
import PlayerSearchBar from '@/components/search/playersearchbar';
import useClientSocket from '@/hooks/useClientSocket';
import usePlayerSearch from '@/hooks/usePlayerSearch';
import { Button } from '@heroui/react';

export default function Game() {
  const {
    roomId,
    joinRoom,
    leaveRoom,
    connectSocket,
    disconnectSocket,
    isConnected,
    canStartGame,
    onStartGame,
    machineState,
    round,
    score,
    teams,
  } = useClientSocket();
  const { playerCount, list } = usePlayerSearch();

  return (
    <div className="flex flex-col h-full m-16 space-y-8">
      <div className="justify-start">
        <p>Connected: {`${isConnected}`}</p>
        <p>State: {machineState}</p>
        <p>RoomId: {roomId}</p>
        <p>CanStartGame: {`${canStartGame}`}</p>
        {!isConnected && <Button onPress={connectSocket}>Connect</Button>}
        {isConnected && (
          <div>
            {roomId === '' && <Button onPress={joinRoom}>Join Room</Button>}
            {roomId !== '' && <Button onPress={leaveRoom}>Leave Room</Button>}
            {canStartGame && <Button onPress={onStartGame}>Start Game</Button>}

            <Button onPress={disconnectSocket}>Disconnect</Button>
          </div>
        )}
      </div>

      {teams && (
        <div className="flex flex-col items-center space-y-8">
          <div className="flex flex-col items-center">
            <p className="font-extrabold text-xl">Round: {round}</p>
            <p className="font-black text-2xl">Score: {score}</p>
          </div>
          <CareerPath teams={teams} />
          <PlayerSearchBar className="w-1/2" playerCount={playerCount} list={list} />
        </div>
      )}
    </div>
  );
}
