'use client';

import { useEffect, useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { User } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import Image from 'next/image';

export default function ProfilePage() {
  const { profile, loading, error, updateProfile } = useProfile();
  const { user } = useAuth();
  const [currentIncome, setCurrentIncome] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setCurrentIncome(profile.currentIncome.toString());
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const incomeValue = parseInt(currentIncome.replace(/[^0-9]/g, '')) || 0;
      await updateProfile({
        currentIncome: incomeValue,
      });
      toast({
        title: "Success",
        description: "Your salary has been updated.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters and format as currency
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCurrentIncome(value);
  };

  // Format the display value with commas
  const displayIncome = currentIncome ? parseInt(currentIncome).toLocaleString() : '';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">Your Profile</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt="User avatar"
                width={100}
                height={100}
                className="h-8 w-8 rounded-full object-cover"
                priority
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">{profile?.displayName || 'Anonymous'}</h2>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              <p className="text-sm text-muted-foreground mt-1">Member since {profile?.createdAt.toLocaleDateString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentIncome">Current Annual Income</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="currentIncome"
                  type="text"
                  value={displayIncome}
                  onChange={handleIncomeChange}
                  className="pl-8"
                  placeholder="0"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Enter your current annual income before taxes. This will be used to calculate how much more you need to earn to achieve your desired lifestyle in your scenarios.
              </p>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
} 