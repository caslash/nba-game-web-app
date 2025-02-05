import { Player } from '@prisma/client';
import Chance from 'chance';

const chance = new Chance();

export function mockPlayer(): Player {
  const first_name = chance.first({ gender: 'male' });
  const last_name = chance.last();
  const season_exp = chance.integer({ min: 0, max: 23 });
  const from_year = parseInt(chance.year({ min: 1960, max: 2100 }));
  return {
    id: chance.integer({ min: 0 }),
    first_name: first_name,
    last_name: last_name,
    display_first_last: `${first_name} ${last_name}`,
    display_fi_last: `${first_name[0]}. ${last_name}`,
    birthdate: chance.date(),
    school: chance.state({ full: true }),
    country: chance.country({ full: true }),
    height: `${chance.integer({ min: 6, max: 7 })}-${chance.integer({ min: 0, max: 11 })}`,
    weight: `${chance.integer({ min: 150, max: 280 })}`,
    season_exp: season_exp,
    jersey: chance.integer({ min: 0, max: 99 }),
    position: chance.word(),
    team_history: null,
    from_year: from_year,
    to_year: from_year + season_exp,
    total_games_played: chance.integer(),
    draft_round: `${chance.integer({ min: 0, max: 1 })}`,
    draft_number: `${chance.integer({ min: 1, max: 30 })}`,
    isActive: chance.bool(),
    draft_year: `${from_year}`,
  };
}
