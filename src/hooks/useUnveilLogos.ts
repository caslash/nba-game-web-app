import { useState } from 'react';

const useUnveilLogos = (teamHistory: string[]) => {
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
  const indexArr: number[] = Array.from(Array(teamHistory.length).keys());
  let remainingTeams = [...indexArr];

  const unveilRandomLogoIndex = (unveilInterval: NodeJS.Timeout) => {
    if (remainingTeams.length === 0) {
      clearInterval(unveilInterval);
      return;
    }

    const randomIndex = Math.floor(Math.random() * remainingTeams.length);
    const selectedTeam = remainingTeams[randomIndex];

    remainingTeams.splice(randomIndex, 1);

    console.log(`Unveiling team #${selectedTeam + 1}`);
    setVisibleIndexes((prev) => [...prev, selectedTeam]);
  };

  return { visibleIndexes, unveilRandomLogoIndex };
};

export default useUnveilLogos;
