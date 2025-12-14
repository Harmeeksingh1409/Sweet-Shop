import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '@/components/Header';
import { SweetCard } from '@/components/SweetCard';
import { SearchFilter } from '@/components/SearchFilter';
import { SweetForm } from '@/components/SweetForm';
import { Button } from '@/components/ui/button';
import { useSweets, useCreateSweet } from '@/hooks/useSweets';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

export default function Index() {
  const [filters, setFilters] = useState<{ name?: string; category?: string; minPrice?: number; maxPrice?: number }>({});
  const { data: sweets, isLoading } = useSweets(filters);
  const { user, isAdmin } = useAuth();
  const createSweet = useCreateSweet();
  const [formOpen, setFormOpen] = useState(false);

  const handleSubmit = (data: any) => {
    createSweet.mutate(data, { onSuccess: () => setFormOpen(false) });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Header />
      
      <main className="container py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Welcome to <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">Sweet Shop</span> 🍬
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Discover our delicious collection of handcrafted sweets, chocolates, and treats.
          </p>
        </section>

        {/* Add Sweet Button for Logged-in Users */}
        {user && (
          <section className="mb-8 text-center">
            <Button variant="sweet" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Sweet
            </Button>
          </section>
        )}

        {/* Search & Filter */}
        <section className="mb-8">
          <SearchFilter onFilterChange={setFilters} />
        </section>

        {/* Not logged in message */}
        {!user && (
          <div className="mb-8 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Sign in</span> to purchase sweets and track your orders!
            </p>
          </div>
        )}

        {/* Sweets Grid */}
        <section>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-[400px] rounded-2xl" />
              ))}
            </div>
          ) : sweets && sweets.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sweets.map((sweet, index) => (
                <div key={sweet.id} className="animate-fade-up opacity-0" style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}>
                  <SweetCard sweet={sweet} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed p-12 text-center">
              <p className="text-xl text-muted-foreground">No sweets found. Try adjusting your filters!</p>
            </div>
          )}
        </section>

        <SweetForm open={formOpen} onOpenChange={setFormOpen} sweet={null} onSubmit={handleSubmit} isLoading={createSweet.isPending} />
      </main>
    </div>
  );
}
