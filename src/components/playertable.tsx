'use client';

import {
  getKeyValue,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { Player } from '@prisma/client';
import { LoadingState } from '@react-types/shared';
import { ChangeEvent, Dispatch, SetStateAction, useMemo } from 'react';

const columns: { key: string; label: string }[] = [
  {
    key: 'first_name',
    label: 'First',
  },
  {
    key: 'last_name',
    label: 'Last',
  },
  {
    key: 'school',
    label: 'School',
  },
  {
    key: 'height',
    label: 'Height',
  },
  {
    key: 'weight',
    label: 'Weight',
  },
  {
    key: 'season_exp',
    label: 'Exp',
  },
  {
    key: 'position',
    label: 'Position',
  },
];

export default function PlayerTable({
  className,
  players,
  page,
  setPage,
  totalPages,
  onRowsPerPageChange,
  loadingState,
}: Readonly<{
  className?: string;
  players: Player[];
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  onRowsPerPageChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  loadingState: LoadingState;
}>) {
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 items-end">
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </label>
      </div>
    );
  }, [onRowsPerPageChange]);

  return (
    <div className={className}>
      <Table
        aria-label="Players"
        isStriped
        topContent={topContent}
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              dotsJump={10}
              initialPage={page}
              color="secondary"
              page={page}
              total={totalPages}
              onChange={setPage}
            />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={players} loadingContent={<Spinner />} loadingState={loadingState}>
          {(player) => (
            <TableRow key={player.id}>
              {(columnKey) => <TableCell>{getKeyValue(player, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
