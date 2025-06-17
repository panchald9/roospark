import type { MenuItem } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
  onOrderClick?: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onOrderClick }: MenuItemCardProps) {
  const dietBadgeColor = item.diet === "veg" ? "bg-green-500" : "bg-red-500";
  const spiceBadgeColor = 
    item.spice === "mild" ? "bg-green-500" : 
    item.spice === "medium" ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="group cursor-pointer transform hover:scale-105 transition-transform duration-300">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative">
          <img 
            src={item.image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"} 
            alt={item.name} 
            className="w-full h-48 object-cover" 
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className={`${dietBadgeColor} text-white px-2 py-1 text-xs font-semibold`}>
              {item.diet === "veg" ? "Veg" : "Non-Veg"}
            </Badge>
            <Badge className={`${spiceBadgeColor} text-white px-2 py-1 text-xs font-semibold`}>
              {item.spice.charAt(0).toUpperCase() + item.spice.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-roos-brown mb-2">{item.name}</h3>
          <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-roos-gold">₹{item.price}</span>
            <Badge variant="secondary" className="text-sm capitalize bg-gray-100 px-3 py-1">
              {item.category}
            </Badge>
          </div>
          {onOrderClick && (
            <Button 
              onClick={() => onOrderClick(item)}
              className="w-full bg-roos-green hover:bg-green-600 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Order Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
