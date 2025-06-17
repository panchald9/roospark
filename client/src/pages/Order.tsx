import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import MenuItemCard from "@/components/MenuItemCard";
import OrderModal from "@/components/OrderModal";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import type { MenuItem } from "@shared/schema";

export default function Order() {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | undefined>();

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ["/api/menu-items"],
    queryFn: api.getMenuItems,
  });

  const handleOrderClick = (item: MenuItem) => {
    setSelectedItem(item);
    setOrderModalOpen(true);
  };

  const handleQuickOrder = () => {
    setSelectedItem(undefined);
    setOrderModalOpen(true);
  };

  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-roos-brown mb-4">
            Order Online
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Choose your favorite dishes for pickup or delivery
          </p>
          <Button 
            onClick={handleQuickOrder}
            className="bg-roos-green hover:bg-green-600 text-white px-8 py-3 text-lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Start New Order
          </Button>
        </div>

        {/* Menu Items Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl" />
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-16 bg-gray-200 rounded" />
                    <div className="h-6 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onOrderClick={handleOrderClick} />
            ))}
          </div>
        )}

        <OrderModal 
          isOpen={orderModalOpen} 
          onClose={() => {
            setOrderModalOpen(false);
            setSelectedItem(undefined);
          }}
          initialItem={selectedItem}
        />
      </div>
    </section>
  );
}