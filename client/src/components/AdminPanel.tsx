import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { insertMenuItemSchema, type InsertMenuItem, type MenuItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Plus, Search, Utensils, Leaf, ChefHat, Flame, Calendar, ShoppingBag, Star, Clock, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ["/api/menu-items"],
    queryFn: api.getMenuItems,
  });

  const { data: adminStats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: api.getAdminStats,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: api.getOrders,
  });

  const form = useForm<InsertMenuItem>({
    resolver: zodResolver(insertMenuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      diet: "",
      spice: "",
      image: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: api.createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      form.reset();
      setEditingItem(null);
      toast({ title: "Success", description: "Menu item added successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add menu item", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertMenuItem> }) =>
      api.updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      form.reset();
      setEditingItem(null);
      toast({ title: "Success", description: "Menu item updated successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update menu item", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({ title: "Success", description: "Menu item deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete menu item", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertMenuItem) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    form.reset({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      diet: item.diet,
      spice: item.spice,
      image: item.image || "",
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      deleteMutation.mutate(id);
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    form.reset();
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Success", description: "Order status updated successfully!" });
    },
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "There was an error logging out.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Welcome, {user?.username}!</h2>
          <p className="text-gray-600">Manage your restaurant from this dashboard</p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="space-y-8">
        {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Utensils className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-gray-800">Menu Items</h4>
            <p className="text-2xl font-bold text-blue-600">
              {statsLoading ? "..." : adminStats.totalMenuItems || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-gray-800">Total Bookings</h4>
            <p className="text-2xl font-bold text-green-600">
              {statsLoading ? "..." : adminStats.totalBookings || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ShoppingBag className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-gray-800">Total Orders</h4>
            <p className="text-2xl font-bold text-purple-600">
              {statsLoading ? "..." : adminStats.totalOrders || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-gray-800">Avg Rating</h4>
            <p className="text-2xl font-bold text-yellow-600">
              {statsLoading ? "..." : adminStats.averageRating?.toFixed(1) || "0.0"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-gray-800">Veg Items</h4>
            <p className="text-2xl font-bold text-green-600">
              {statsLoading ? "..." : adminStats.vegItems || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-gray-800">Pending Orders</h4>
            <p className="text-2xl font-bold text-orange-600">
              {statsLoading ? "..." : adminStats.pendingOrders || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ChefHat className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-gray-800">Non-Veg Items</h4>
            <p className="text-2xl font-bold text-red-600">
              {statsLoading ? "..." : adminStats.nonVegItems || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-gray-800">Recent Bookings</h4>
            <p className="text-2xl font-bold text-teal-600">
              {statsLoading ? "..." : adminStats.recentBookings || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-roos-brown">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {orders.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No orders yet</div>
            ) : (
              orders.slice(0, 10).map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        Order #{order.id} - {order.customerName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {order.orderType} • ₹{order.totalAmount} • {order.customerPhone}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.items.join(", ")} items
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(status) => 
                          updateOrderStatusMutation.mutate({ id: order.id, status })
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {order.deliveryAddress && (
                    <p className="text-xs text-gray-600 mt-1">
                      Address: {order.deliveryAddress}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add/Edit Menu Item Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roos-brown">
              {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dish Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter dish name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter description" rows={3} />
                      </FormControl>
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
                        <FormLabel>Price (₹) *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            placeholder="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
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
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="indian">Indian</SelectItem>
                            <SelectItem value="chinese">Chinese</SelectItem>
                            <SelectItem value="italian">Italian</SelectItem>
                            <SelectItem value="continental">Continental</SelectItem>
                            <SelectItem value="fastfood">Fast Food</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="diet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diet Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select diet" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="veg">Vegetarian</SelectItem>
                            <SelectItem value="nonveg">Non-Vegetarian</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spice Level *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select spice" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mild">Mild</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="spicy">Spicy</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="https://images.unsplash.com/..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="bg-roos-green hover:bg-green-600 text-white flex-1"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {editingItem ? "Update Item" : "Add Item"}
                  </Button>
                  {editingItem && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Menu Items Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-roos-brown">Manage Menu Items</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No items found</div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.category} • ₹{item.price} • {item.diet} • {item.spice}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
