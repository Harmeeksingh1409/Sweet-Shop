import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Header } from '@/components/Header';
import { SweetCard } from '@/components/SweetCard';
import { SweetForm } from '@/components/SweetForm';
import { RestockDialog } from '@/components/RestockDialog';
import { Button } from '@/components/ui/button';
import { useSweets, useCreateSweet, useUpdateSweet, useDeleteSweet, useRestockSweet } from '@/hooks/useSweets';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import type { Database } from '@/integrations/supabase/types';

type Sweet = Database['public']['Tables']['sweets']['Row'];

export default function Admin() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { data: sweets, isLoading } = useSweets();
  const createSweet = useCreateSweet();
  const updateSweet = useUpdateSweet();
  const deleteSweet = useDeleteSweet();
  const restockSweet = useRestockSweet();

  const [formOpen, setFormOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockingSweet, setRestockingSweet] = useState<Sweet | null>(null);

  if (authLoading) return <div className="flex min-h-screen items-center justify-center"><Skeleton className="h-32 w-32 rounded-full" /></div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const handleSubmit = (data: any) => {
    if (editingSweet) {
      updateSweet.mutate({ id: editingSweet.id, ...data }, { onSuccess: () => { setFormOpen(false); setEditingSweet(null); } });
    } else {
      createSweet.mutate(data, { onSuccess: () => setFormOpen(false) });
    }
  };

  const handleEdit = (sweet: Sweet) => { setEditingSweet(sweet); setFormOpen(true); };
  const handleDelete = (id: string) => { if (confirm('Delete this sweet?')) deleteSweet.mutate(id); };
  const handleRestockClick = (sweet: Sweet) => { setRestockingSweet(sweet); setRestockOpen(true); };
  const handleRestock = (sweetId: string, quantity: number) => {
    restockSweet.mutate({ sweetId, quantity }, { onSuccess: () => { setRestockOpen(false); setRestockingSweet(null); } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage your sweet shop inventory</p>
          </div>
          <Button variant="sweet" onClick={() => { setEditingSweet(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> Add Sweet
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[400px] rounded-2xl" />)}
          </div>
        ) : sweets && sweets.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sweets.map((sweet) => (
              <SweetCard key={sweet.id} sweet={sweet} showAdminActions onEdit={handleEdit} onDelete={handleDelete} onRestock={handleRestockClick} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed p-12 text-center">
            <p className="text-xl text-muted-foreground">No sweets yet. Add your first sweet!</p>
          </div>
        )}

        <SweetForm open={formOpen} onOpenChange={setFormOpen} sweet={editingSweet} onSubmit={handleSubmit} isLoading={createSweet.isPending || updateSweet.isPending} />
        <RestockDialog open={restockOpen} onOpenChange={setRestockOpen} sweet={restockingSweet} onRestock={handleRestock} isLoading={restockSweet.isPending} />
      </main>
    </div>
  );
}
