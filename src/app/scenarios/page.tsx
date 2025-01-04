'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useScenarios } from '@/hooks/use-scenarios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2 } from 'lucide-react';
import { useScenario } from '@/hooks/use-scenario';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ScenariosPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { scenarios, loading: scenariosLoading, refresh } = useScenarios();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { deleteScenario } = useScenario(deletingId || '');

  const handleDelete = async () => {
    if (!deletingId) return;
    
    const success = await deleteScenario();
    if (success) {
      refresh();
    }
    setDeletingId(null);
  };

  // Show loading state or redirect if not authenticated
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">Please sign in to continue.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Your Financial Scenarios</h1>
          <p className="text-muted-foreground">
            Compare different lifestyle scenarios and their required incomes.
          </p>
        </div>
        <Link href="/wizard">
          <Button>Create New Scenario</Button>
        </Link>
      </div>

      {scenariosLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading your scenarios...</p>
        </div>
      ) : scenarios.length === 0 ? (
        <Card className="p-6">
          <Alert>
            <AlertDescription>
              You haven&apos;t created any scenarios yet. Start by creating your first
              financial scenario to see how much you need to earn for your desired
              lifestyle.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Link href="/wizard">
              <Button>Create Your First Scenario</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Lifestyle</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Required Monthly</TableHead>
                  <TableHead className="text-right">Required Yearly</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scenarios.map((scenario) => (
                  <TableRow key={scenario.id}>
                    <TableCell className="font-medium">{scenario.name}</TableCell>
                    <TableCell className="capitalize">{scenario.lifestyle}</TableCell>
                    <TableCell>
                      {scenario.location.city}, {scenario.location.state}
                    </TableCell>
                    <TableCell className="text-right">
                      ${scenario.monthlyIncome.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ${scenario.yearlyIncome.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/scenarios/${scenario.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingId(scenario.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="text-sm text-muted-foreground">
            <p>
              Note: All income figures are before taxes and based on your selected
              lifestyle choices and location adjustments.
            </p>
          </div>
        </div>
      )}

      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Scenario</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this scenario? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 