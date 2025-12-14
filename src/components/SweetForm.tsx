import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Database } from '@/integrations/supabase/types';

type Sweet = Database['public']['Tables']['sweets']['Row'];

const sweetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type SweetFormData = z.infer<typeof sweetSchema>;

const categories = ['Chocolate', 'Candy', 'Pastry', 'Ice Cream', 'Cake', 'Cookie'];

interface SweetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sweet?: Sweet | null;
  onSubmit: (data: SweetFormData) => void;
  isLoading?: boolean;
}

export function SweetForm({ open, onOpenChange, sweet, onSubmit, isLoading }: SweetFormProps) {
  const isEditing = !!sweet;

  const form = useForm<SweetFormData>({
    resolver: zodResolver(sweetSchema),
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      quantity: 0,
      description: '',
      image_url: '',
    },
  });

  useEffect(() => {
    if (sweet) {
      form.reset({
        name: sweet.name,
        category: sweet.category,
        price: Number(sweet.price),
        quantity: sweet.quantity,
        description: sweet.description || '',
        image_url: sweet.image_url || '',
      });
    } else {
      form.reset({
        name: '',
        category: '',
        price: 0,
        quantity: 0,
        description: '',
        image_url: '',
      });
    }
  }, [sweet, form]);

  const handleSubmit = (data: SweetFormData) => {
    onSubmit({
      ...data,
      image_url: data.image_url || undefined,
      description: data.description || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {isEditing ? 'Edit Sweet' : 'Add New Sweet'} 🍬
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the details of this sweet treat.'
              : 'Add a delicious new sweet to your shop.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Chocolate Truffle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="A delicious treat made with the finest ingredients..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="soft" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="sweet" disabled={isLoading}>
                {isLoading ? 'Saving...' : isEditing ? 'Update Sweet' : 'Add Sweet'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
