'use client';
import { Button } from '@heroui/react';
import NextLink from 'next/link';

import ShortUniqueId from 'short-unique-id';

export default function Game() {
  const { randomUUID } = new ShortUniqueId({ length: 8 });

  return (
    <div className="flex flex-col h-full m-16 space-y-8">
      <Button as={NextLink} href={`/multiplayer/${randomUUID()}`}>
        Create Room
      </Button>
    </div>
  );
}
