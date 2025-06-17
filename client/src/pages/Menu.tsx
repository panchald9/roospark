import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import MenuItemCard from "@/components/MenuItemCard";
import OrderModal from "@/components/OrderModal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { MenuItem } from "@shared/schema";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [dietFilter, setDietFilter] = useState("all");
  const [spiceFilter, setSpiceFilter] = useState("all");
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | undefined>();

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ["/api/menu-items"],
    queryFn: api.getMenuItems,
  });

  const categories = [
    { id: "all", label: "All Items" },
    { id: "indian", label: "Indian" },
    { id: "chinese", label: "Chinese" },
    { id: "italian", label: "Italian" },
    { id: "continental", label: "Continental" },
    { id: "fastfood", label: "Fast Food" },
  ];

  const filteredItems = menuItems.filter(item => {
    const categoryMatch = activeCategory === "all" || item.category === activeCategory;
    const dietMatch = dietFilter === "all" || item.diet === dietFilter;
    const spiceMatch = spiceFilter === "all" || item.spice === spiceFilter;
    
    return categoryMatch && dietMatch && spiceMatch;
  });

  const handleOrderClick = (item: MenuItem) => {
    setSelectedItem(item);
    setOrderModalOpen(true);
  };

  return (
    <section className="py-16 bg-roos-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-roos-brown mb-4">
            Our Complete Menu
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our diverse collection of dishes from around the world, crafted with passion and served with love
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={
                activeCategory === category.id
                  ? "bg-roos-brown text-white hover:bg-roos-chocolate"
                  : "bg-white text-roos-brown border-2 border-roos-brown hover:bg-roos-brown hover:text-white"
              }
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Diet & Spice Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Select value={dietFilter} onValueChange={setDietFilter}>
            <SelectTrigger className="w-48 bg-white border-2 border-roos-brown">
              <SelectValue placeholder="All Diet Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Diet Types</SelectItem>
              <SelectItem value="veg">Vegetarian</SelectItem>
              <SelectItem value="nonveg">Non-Vegetarian</SelectItem>
            </SelectContent>
          </Select>

          <Select value={spiceFilter} onValueChange={setSpiceFilter}>
            <SelectTrigger className="w-48 bg-white border-2 border-roos-brown">
              <SelectValue placeholder="All Spice Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Spice Levels</SelectItem>
              <SelectItem value="mild">Mild</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="spicy">Spicy</SelectItem>
            </SelectContent>
          </Select>
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
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more options</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
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
