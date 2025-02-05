import { Button } from '@heroui/react';
import { Player } from '@prisma/client';

export default function PlayerSearchResult({
  player,
  onSelect,
}: Readonly<{ player: Player; onSelect: (id: number) => void }>) {
  return (
    <div className="grid grid-cols-3 align-center">
      <div className="flex flex-col justify-start gap-1 py-2">
        <p className="text-base">{player.display_first_last}</p>
        <p className="text-xs">{`${player.from_year}-${player.to_year}`}</p>
      </div>
      <Button
        className="col-start-3 self-center"
        color="secondary"
        variant="flat"
        onPress={() => onSelect(player.id)}
      >
        Select
      </Button>
    </div>
  );
}
