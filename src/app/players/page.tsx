'use client';

import PlayerTable from '@/components/playertable';
import usePlayerPagination from '@/hooks/usePlayerPagination';

export default function Players() {
  const { players, page, setPage, totalPages, onRowsPerPageChange, loadingState } =
    usePlayerPagination();
  return (
    <div className="flex flex-col items-center m-16 space-y-8">
      <PlayerTable
        className="w-3/4"
        players={players}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        onRowsPerPageChange={onRowsPerPageChange}
        loadingState={loadingState}
      />
    </div>
  );
}
