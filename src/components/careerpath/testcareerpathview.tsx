'use client';

import useUnveilLogos from '@/hooks/useUnveilLogos';
import { useEffect } from 'react';
import { v4 } from 'uuid';
import TeamLogo from '../teamlogo';

export function TestCareerPathView({
  teamHistory,
  theme,
}: Readonly<{
  teamHistory: string[];
  theme: string | undefined;
}>) {
  const { visibleIndexes, unveilRandomLogoIndex } = useUnveilLogos(teamHistory);

  useEffect(() => {
    let unveilInterval = setInterval(() => {
      unveilRandomLogoIndex(unveilInterval);
    }, 5000);

    return () => {
      clearInterval(unveilInterval);
    };
  }, []);

  return (
    <div>
      <div className="flex flex-row">
        {teamHistory.map((id: string, index: number) => (
          <TeamLogo
            key={v4()}
            className=" max-h-[100] p-1 mx-2 rounded-xl shadow-xl bg-neutral-200 dark:bg-neutral-800"
            isHidden={!visibleIndexes.includes(index)}
            teamId={id}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}
