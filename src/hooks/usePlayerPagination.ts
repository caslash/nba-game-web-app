'use client';
import { fetcher } from '@/server/utils/fetcher';
import { Player } from '@prisma/client';
import { LoadingState } from '@react-types/shared';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import useSwr from 'swr';

const usePlayerPagination = () => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const { data, isLoading } = useSwr(
    `http://localhost:3000/api/players?page=${page}&rowsPerPage=${rowsPerPage}`,
    fetcher,
    { keepPreviousData: true },
  );

  const { players, total: totalPlayers }: { players: Player[]; total: number } = data ?? {
    players: [],
    total: 0,
  };

  const totalPages = useMemo(() => {
    return totalPlayers ? Math.ceil(totalPlayers / rowsPerPage) : 0;
  }, [totalPlayers, rowsPerPage]);

  const loadingState: LoadingState = isLoading || data?.players.length === 0 ? 'loading' : 'idle';

  const onRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [setPage, setRowsPerPage],
  );

  return { players, page, setPage, totalPages, onRowsPerPageChange, loadingState };
};

export default usePlayerPagination;
