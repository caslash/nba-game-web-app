'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

import { Button, User } from '@heroui/react';
import NextLink from 'next/link';

export default function ProfileView() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex flex-row space-x-6">
      {user && (
        <User
          avatarProps={{
            isBordered: true,
            radius: 'sm',
            showFallback: true,
            src: user.picture ?? '',
          }}
          description={user.email}
          name={user.name}
        />
      )}
      <Button variant="flat" radius="sm" color={user ? 'danger' : 'success'}>
        <NextLink href={`/api/auth/${user ? 'logout' : 'login'}`}>
          {user ? 'Logout' : 'Login'}
        </NextLink>
      </Button>
    </div>
  );
}
