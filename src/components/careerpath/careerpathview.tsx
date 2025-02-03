'use client';

import TeamLogo from '@/components/teamlogo';
import { Player } from '@prisma/client';
import { v4 } from 'uuid';

export function CareerPathView({
  player,
  theme,
}: Readonly<{ player?: Player | null; theme: string | undefined }>) {
  return (
    <div>
      {player?.team_history && (
        <div className="flex flex-row">
          {player.team_history.split(',').map((id: string) => (
            <TeamLogo isHidden={false} key={v4()} teamId={id} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}
