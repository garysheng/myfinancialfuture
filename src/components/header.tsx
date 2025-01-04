'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

export function Header() {
  const { user, signInWithGoogle, logout, loading } = useAuth();
  const [imageError, setImageError] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center" aria-label="MyFinancialFuture Home" tabIndex={0}>
            <Image
              src="/logo.png"
              alt="MyFinancialFuture Logo"
              width={32}
              height={32}
              className="rounded-full mr-2"
            />
            <span className="text-xl font-bold pointer-events-none" aria-hidden="true">MyFinancialFuture</span>
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          {!loading && (
            <>
              <Link href="/about">
                <Button variant="ghost">About</Button>
              </Link>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link href="/scenarios">
                    <Button variant="ghost">My Scenarios</Button>
                  </Link>
                  <Link href="/wizard">
                    <Button variant="outline">Create Scenario</Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 p-0 rounded-full overflow-hidden">
                        {!imageError && user.photoURL ? (
                          <Image
                            src={user.photoURL}
                            alt="User avatar"
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover"
                            onError={() => setImageError(true)}
                            priority
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href="/profile">
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => logout()}>
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button onClick={() => signInWithGoogle()}>Sign In</Button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
} 