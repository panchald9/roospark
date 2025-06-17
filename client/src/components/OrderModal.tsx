import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { insertOrderSchema, type InsertOrder, type MenuItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: MenuItem;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function OrderModal({ isOpen, onClose, initialItem }: OrderModalProps) {
  const [cart, setCart] = useState<CartItem[]>(
    initialItem ? [{ ...initialItem, quantity: 1 }] : []
  );
  const { toast } = useToast();

  const form = useForm<InsertOrder>({
    resolver: zodResolver(insertOrderSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      orderType: "",
      items: [],
      totalAmount: 0,
      deliveryAddress: "",
      specialInstructions: "",
    },
  });

  const orderMutation = useMutation({
    mutationFn: api.createOrder,
    onSuccess: (order) => {
      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Thank you ${order.customerName}! Your order #${order.id} has been placed. We'll contact you at ${order.customerPhone} with updates.`,
      });
      form.reset();
      setCart([]);
      onClose();
    },
    onError: () => {
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const onSubmit = (data: InsertOrder) => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      });
      return;
    }

    const orderData: InsertOrder = {
      ...data,
      items: cart.map(item => `${item.id}:${item.quantity}`),
      totalAmount: getTotalAmount(),
    };

    orderMutation.mutate(orderData);
  };

  const needsDeliveryAddress = form.watch("orderType") === "delivery";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair text-roos-brown">
            Place Your Order
          </DialogTitle>
          <DialogDescription>
            Choose your items and provide delivery details to complete your order.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cart Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-roos-brown">Your Order</h3>
            
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2" />
                <p>Your cart is empty</p>
                <p className="text-sm">Close this dialog and click "Order Now" on menu items</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-roos-brown">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge className={item.diet === "veg" ? "bg-green-500" : "bg-red-500"}>
                            {item.diet === "veg" ? "Veg" : "Non-Veg"}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <span className="font-bold text-roos-gold">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-roos-gold">₹{getTotalAmount()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Form */}
          <div>
            <h3 className="text-lg font-semibold text-roos-brown mb-4">Order Details</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Enter your email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" placeholder="Enter your phone number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="orderType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select order type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {needsDeliveryAddress && (
                  <FormField
                    control={form.control}
                    name="deliveryAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Address *</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            value={field.value ?? ""}
                            rows={3}
                            placeholder="Enter your complete delivery address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="specialInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          value={field.value ?? ""}
                          rows={2}
                          placeholder="Any special requests or dietary requirements..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-roos-brown hover:bg-roos-chocolate text-white font-semibold py-3"
                  disabled={orderMutation.isPending || cart.length === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {orderMutation.isPending ? "Placing Order..." : `Place Order - ₹${getTotalAmount()}`}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}