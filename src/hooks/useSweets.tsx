import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Sweet = Database['public']['Tables']['sweets']['Row'];
type SweetInsert = Database['public']['Tables']['sweets']['Insert'];
type SweetUpdate = Database['public']['Tables']['sweets']['Update'];

interface SearchFilters {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

const dummySweets: Sweet[] = [
  {
    id: '1',
    name: 'Chocolate Truffle',
    category: 'Chocolate',
    price: 5.99,
    quantity: 50,
    description: 'Rich and creamy chocolate truffle made with the finest cocoa.',
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Strawberry Lollipop',
    category: 'Candy',
    price: 2.49,
    quantity: 100,
    description: 'Sweet and tangy strawberry flavored lollipop.',
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Blueberry Pastry',
    category: 'Pastry',
    price: 4.99,
    quantity: 30,
    description: 'Flaky pastry filled with fresh blueberries.',
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Vanilla Ice Cream',
    category: 'Ice Cream',
    price: 3.99,
    quantity: 75,
    description: 'Creamy vanilla ice cream made with real vanilla beans.',
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Red Velvet Cake',
    category: 'Cake',
    price: 15.99,
    quantity: 20,
    description: 'Moist red velvet cake with cream cheese frosting.',
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Oatmeal Cookie',
    category: 'Cookie',
    price: 1.99,
    quantity: 80,
    description: 'Chewy oatmeal cookie with raisins and nuts.',
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Mint Chocolate Chip',
    category: 'Ice Cream',
    price: 4.49,
    quantity: 60,
    description: 'Refreshing mint ice cream with chocolate chips.',
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Caramel Popcorn',
    category: 'Candy',
    price: 3.99,
    quantity: 40,
    description: 'Buttery caramel coated popcorn.',
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Croissant',
    category: 'Pastry',
    price: 2.99,
    quantity: 45,
    description: 'Buttery and flaky French croissant.',
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Dark Chocolate Bar',
    category: 'Chocolate',
    price: 6.99,
    quantity: 35,
    description: 'Smooth dark chocolate bar with 70% cocoa.',
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function useSweets(filters?: SearchFilters) {
  return useQuery({
    queryKey: ['sweets', filters],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      let filtered = dummySweets;

      if (filters?.name) {
        filtered = filtered.filter(sweet =>
          sweet.name.toLowerCase().includes(filters.name!.toLowerCase())
        );
      }
      if (filters?.category) {
        filtered = filtered.filter(sweet => sweet.category === filters.category);
      }
      if (filters?.minPrice !== undefined) {
        filtered = filtered.filter(sweet => Number(sweet.price) >= filters.minPrice!);
      }
      if (filters?.maxPrice !== undefined) {
        filtered = filtered.filter(sweet => Number(sweet.price) <= filters.maxPrice!);
      }

      return filtered;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['sweet-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sweets')
        .select('category')
        .order('category');
      
      if (error) throw error;
      
      // Get unique categories
      const categories = [...new Set(data.map(item => item.category))];
      return categories;
    },
  });
}

export function useCreateSweet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sweet: SweetInsert) => {
      const { data, error } = await supabase
        .from('sweets')
        .insert(sweet)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      queryClient.invalidateQueries({ queryKey: ['sweet-categories'] });
      toast({
        title: "Sweet Added!",
        description: "The new sweet has been added to the shop.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateSweet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: SweetUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('sweets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      queryClient.invalidateQueries({ queryKey: ['sweet-categories'] });
      toast({
        title: "Sweet Updated!",
        description: "The sweet has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteSweet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sweets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      queryClient.invalidateQueries({ queryKey: ['sweet-categories'] });
      toast({
        title: "Sweet Deleted",
        description: "The sweet has been removed from the shop.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function usePurchaseSweet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ sweetId, quantity }: { sweetId: string; quantity: number }) => {
      // Simulate purchase locally
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find the sweet and check stock
      const sweet = dummySweets.find(s => s.id === sweetId);
      if (!sweet) {
        throw new Error('Sweet not found');
      }
      if (sweet.quantity < quantity) {
        throw new Error('Insufficient stock');
      }

      // Simulate reducing quantity
      sweet.quantity -= quantity;

      return { success: true, purchase_id: `local_${Date.now()}` };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast({
        title: "Purchase Successful! 🎉",
        description: "Thank you for your order!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Purchase Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRestockSweet() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ sweetId, quantity }: { sweetId: string; quantity: number }) => {
      const { data, error } = await supabase
        .rpc('restock_sweet', { p_sweet_id: sweetId, p_quantity: quantity });
      
      if (error) throw error;
      
      const result = data as { success: boolean; error?: string };
      if (!result.success) {
        throw new Error(result.error || 'Restock failed');
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast({
        title: "Stock Updated!",
        description: "The sweet has been restocked.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Restock Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
