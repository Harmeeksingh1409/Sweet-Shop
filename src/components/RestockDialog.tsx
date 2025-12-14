import { useState } from 'react';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Database } from '@/integrations/supabase/types';

type Sweet = Database['public']['Tables']['sweets']['Row'];

interface RestockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sweet: Sweet | null;
  onRestock: (sweetId: string, quantity: number) => void;
  isLoading?: boolean;
}

export function RestockDialog({ open, onOpenChange, sweet, onRestock, isLoading }: RestockDialogProps) {
  const [quantity, setQuantity] = useState('10');

  const handleRestock = () => {
    if (sweet && parseInt(quantity) > 0) {
      onRestock(sweet.id, parseInt(quantity));
      setQuantity('10');
    }
  };

  if (!sweet) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2 text-xl">
            <Package className="h-5 w-5 text-primary" />
            Restock {sweet.name}
          </DialogTitle>
          <DialogDescription>
            Current stock: <span className="font-semibold text-foreground">{sweet.quantity}</span> units
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="restock-quantity">Quantity to Add</Label>
            <Input
              id="restock-quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">
              New stock after restock:{' '}
              <span className="font-bold text-foreground">
                {sweet.quantity + (parseInt(quantity) || 0)} units
              </span>
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="soft" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="golden" 
            onClick={handleRestock}
            disabled={!quantity || parseInt(quantity) <= 0 || isLoading}
          >
            {isLoading ? 'Restocking...' : 'Restock'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
