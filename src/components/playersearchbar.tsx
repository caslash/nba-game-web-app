import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { Player } from '@prisma/client';
import { AsyncListData } from '@react-stately/data';
import { Key } from 'react';

export default function PlayerSearchBar({
  playerCount,
  list,
  className,
  onSelectionChange,
}: Readonly<{
  playerCount: number;
  list: AsyncListData<Player>;
  className: string;
  onSelectionChange?: (key: Key | null) => void;
}>) {
  return (
    <div className={`flex flex-row items-center ${className}`}>
      <Autocomplete
        isClearable
        inputValue={list.filterText}
        isLoading={list.isLoading}
        items={list.items}
        label={`Search ${playerCount} players`}
        labelPlacement="inside"
        onInputChange={list.setFilterText}
        onSelectionChange={onSelectionChange}
      >
        {(player: Player) => (
          <AutocompleteItem key={player.id}>{player.display_first_last}</AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}
