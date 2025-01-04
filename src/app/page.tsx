'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useScenarios } from '@/hooks/use-scenarios';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  PlusCircle, 
  BarChart2, 
  Home, 
  MapPin, 
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { scenarios, loading: scenariosLoading } = useScenarios();

  useEffect(() => {
    if (!authLoading && user && !scenariosLoading) {
      // If user is logged in and has no scenarios, redirect to wizard
      if (scenarios.length === 0) {
        router.push('/wizard');
      }
    }
  }, [user, authLoading, scenarios, scenariosLoading, router]);

  // Show loading state while checking scenarios
  if (user && scenariosLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col items-center mb-16">
        <img
          src="/logo.png"
          alt="My Financial Future"
          className="w-24 h-24 rounded-full mb-8"
        />
        <h1 className="text-4xl font-bold text-center mb-4">Plan Your Financial Future with Confidence</h1>
        <p className="text-xl text-muted-foreground text-center">
          Discover exactly how much you need to earn for the lifestyle you want.
        </p>
      </div>

      <div className={`grid grid-cols-1 ${user && scenarios && scenarios.length > 0 ? 'md:grid-cols-2' : 'md:max-w-md mx-auto'} gap-8 mb-16`}>
        {/* Create New Scenario Card */}
        <div className="rounded-lg border bg-green-950/50 text-card-foreground p-6 shadow-lg hover:bg-green-950/60 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <PlusCircle className="h-6 w-6 text-green-500" />
            <h2 className="text-2xl font-semibold">Create New Scenario</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Start fresh with a new financial scenario
          </p>
          <p className="text-muted-foreground mb-6">
            Walk through our wizard to define your desired lifestyle,
            family situation, and location preferences.
          </p>
          {user ? (
            <Link href="/wizard">
              <Button className="w-full bg-green-600 hover:bg-green-700">Create New Scenario</Button>
            </Link>
          ) : (
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => signInWithGoogle()}
            >
              Create New Scenario
            </Button>
          )}
        </div>

        {/* View Scenarios Card - Only show when user is logged in and has scenarios */}
        {user && scenarios && scenarios.length > 0 && (
          <div className="rounded-lg border bg-card text-card-foreground p-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">View Scenarios</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Compare your saved financial scenarios
            </p>
            <p className="text-muted-foreground mb-6">
              Review and compare different lifestyle scenarios to make
              informed decisions about your financial future.
            </p>
            <Link href="/scenarios">
              <Button variant="outline" className="w-full">View All Scenarios</Button>
            </Link>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="flex flex-col items-center gap-2 mb-2">
            <Home className="h-8 w-8 mb-2" />
          </div>
          <p className="text-muted-foreground">
            Define your ideal lifestyle across housing,
            transportation, entertainment, and more.
          </p>
        </div>

        <div className="text-center">
          <div className="flex flex-col items-center gap-2 mb-2">
            <MapPin className="h-8 w-8 mb-2" />
          </div>
          <p className="text-muted-foreground">
            Adjust costs based on your location with built-in cost
            of living data for major US cities.
          </p>
        </div>

        <div className="text-center">
          <div className="flex flex-col items-center gap-2 mb-2">
            <Sparkles className="h-8 w-8 mb-2" />
          </div>
          <p className="text-muted-foreground">
            Get personalized savings and investment
            recommendations based on your goals.
          </p>
        </div>
      </div>
    </div>
  );
}
