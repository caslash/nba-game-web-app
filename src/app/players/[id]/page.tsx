import { getPlayer } from '@/server/actions';

export default async function PlayerPage({
  params,
}: Readonly<{ params: Promise<{ id: number }> }>) {
  const id = Number((await params).id);
  const player = await getPlayer({ where: { id: { equals: id } } });
  return (
    <div>
      <h1>{player?.display_first_last}</h1>
    </div>
  );
}
