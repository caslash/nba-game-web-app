import PlayerSearchResult from '@/components/search/playersearchresult';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { Player } from '@prisma/client';
import { AsyncListData } from '@react-stately/data';

export default function PlayerSearchBar({
  playerCount,
  list,
  className,
  onSelect,
}: Readonly<{
  playerCount: number;
  list: AsyncListData<Player>;
  className: string;
  onSelect: (id: number) => void;
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
        maxListboxHeight={380}
        itemHeight={60}
      >
        {(player: Player) => (
          <AutocompleteItem
            key={player.id}
            textValue={player.display_first_last ?? ''}
            onPress={() => onSelect(player.id)}
          >
            <PlayerSearchResult player={player} onSelect={onSelect} />
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}
