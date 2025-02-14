'use client';

import { clientSocket } from '@/app/clientSocket';
import { useEffect, useState } from 'react';
import ShortUniqueId from 'short-unique-id';

interface StateProps {
  gameActive?: string;
}

interface RoundProps {
  round: number;
  score: number;
  team_history: string[];
}

const useClientSocket = () => {
  const { randomUUID } = new ShortUniqueId({ length: 8 });
  const [roomId, setRoomId] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [canStartGame, setCanStartGame] = useState<boolean>(false);
  const [machineState, setMachineState] = useState<string>('idle');

  const [round, setRound] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [teams, setTeams] = useState<string[] | null>(null);

  function connectSocket() {
    clientSocket.connect();
  }
  function disconnectSocket() {
    leaveRoom();
    clientSocket.disconnect();
  }
  function joinRoom() {
    const newId = 'new_room';
    setRoomId(newId);
    clientSocket.emit('join_room', newId);
  }
  function leaveRoom() {
    clientSocket.emit('leave_room', roomId);
    setRoomId('');
  }
  function onConnect() {
    setIsConnected(true);
  }
  function onDisconnect() {
    setRoomId('');
    setIsConnected(false);
    setMachineState('idle');
    setRound(0);
    setScore(0);
    setTeams(null);
  }
  function onWaitingForPlayers() {
    setCanStartGame(true);
  }
  function onStateChange({ gameActive }: StateProps) {
    setMachineState(gameActive ?? 'idle');
  }
  function onStartGame() {
    setCanStartGame(false);
    clientSocket.emit('start_game', roomId);
  }
  function onNextRound({ round, score, team_history }: RoundProps) {
    setRound(round);
    setScore(score);
    setTeams(team_history);
  }

  useEffect(() => {
    setCanStartGame(false);

    clientSocket.on('connect', onConnect);
    clientSocket.on('disconnect', onDisconnect);
    clientSocket.on('waiting_for_players', onWaitingForPlayers);
    clientSocket.on('state_change', onStateChange);
    clientSocket.on('next_round', onNextRound);

    return () => {
      clientSocket.off('connect', onConnect);
      clientSocket.off('disconnect', onDisconnect);
      clientSocket.disconnect();
    };
  }, []);

  return {
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
  };
};

export default useClientSocket;
