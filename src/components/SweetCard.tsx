import { useState } from 'react';
import { ShoppingCart, Package, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePurchaseSweet } from '@/hooks/useSweets';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type Sweet = Database['public']['Tables']['sweets']['Row'];

interface SweetCardProps {
  sweet: Sweet;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: string) => void;
  onRestock?: (sweet: Sweet) => void;
  showAdminActions?: boolean;
}

const categoryColors: Record<string, string> = {
  'Chocolate': 'bg-chocolate text-primary-foreground',
  'Candy': 'bg-strawberry text-primary-foreground',
  'Pastry': 'bg-caramel text-foreground',
  'Ice Cream': 'bg-mint text-foreground',
  'Cake': 'bg-primary text-primary-foreground',
  'Cookie': 'bg-accent text-accent-foreground',
};

const categoryEmojis: Record<string, string> = {
  'Chocolate': '🍫',
  'Candy': '🍬',
  'Pastry': '🥐',
  'Ice Cream': '🍦',
  'Cake': '🎂',
  'Cookie': '🍪',
};

export function SweetCard({ sweet, onEdit, onDelete, onRestock, showAdminActions }: SweetCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const purchaseMutation = usePurchaseSweet();
  
  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;
  
  const handlePurchase = () => {
    if (!user) return;
    purchaseMutation.mutate({ sweetId: sweet.id, quantity });
    setQuantity(1);
  };

  const incrementQuantity = () => {
    if (quantity < sweet.quantity) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const categoryColor = categoryColors[sweet.category] || 'bg-secondary text-secondary-foreground';
  const emoji = categoryEmojis[sweet.category] || '🍭';

  return (
    <Card className="group overflow-hidden border-2 border-transparent bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-card">
      <CardHeader className="relative pb-2">
        <div className="flex items-start justify-between">
          <Badge className={`${categoryColor} font-medium`}>
            {emoji} {sweet.category}
          </Badge>
          {isOutOfStock && (
            <Badge variant="destructive" className="animate-pulse">
              Sold Out
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Only {sweet.quantity} left!
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Sweet image placeholder with category emoji */}
        <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-warm transition-transform duration-300 group-hover:scale-105">
          <span className="text-6xl">{emoji}</span>
          {sweet.image_url && (
            <img 
              src={sweet.image_url} 
              alt={sweet.name}
              className="absolute inset-0 h-full w-full rounded-2xl object-cover"
            />
          )}
        </div>
        
        <div className="text-center">
          <h3 className="font-display text-xl font-semibold text-foreground">
            {sweet.name}
          </h3>
          {sweet.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {sweet.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl font-bold text-primary">
            ${Number(sweet.price).toFixed(2)}
          </span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{sweet.quantity} in stock</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3">
        {!showAdminActions && (
          <>
            {/* Quantity selector */}
            <div className="flex w-full items-center justify-center gap-3">
              <Button
                variant="soft"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1 || isOutOfStock}
                className="h-8 w-8"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <Button
                variant="soft"
                size="icon"
                onClick={incrementQuantity}
                disabled={quantity >= sweet.quantity || isOutOfStock}
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              variant="sweet"
              className="w-full"
              disabled={isOutOfStock || !user || purchaseMutation.isPending}
              onClick={handlePurchase}
            >
              <ShoppingCart className="h-4 w-4" />
              {purchaseMutation.isPending ? 'Processing...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </>
        )}
        
        {showAdminActions && (
          <div className="grid w-full grid-cols-3 gap-2">
            <Button variant="soft" size="sm" onClick={() => onEdit?.(sweet)}>
              Edit
            </Button>
            <Button 
              variant="golden" 
              size="sm" 
              onClick={() => onRestock?.(sweet)}
            >
              Restock
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onDelete?.(sweet.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
