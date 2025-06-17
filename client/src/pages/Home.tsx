import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, Calendar, Star } from "lucide-react";
import type { MenuItem } from "@shared/schema";

export default function Home() {
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ["/api/menu-items"],
    queryFn: api.getMenuItems,
  });

  // Get featured dishes (first 3 items for display)
  const featuredDishes = menuItems.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
          }}
        />
        <div className="absolute inset-0 bg-black opacity-60" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6">
            Where Taste Meets <span className="text-roos-gold">Elegance</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light">
            Experience culinary excellence with our diverse menu featuring flavors from around the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/order">
              <Button className="bg-roos-gold hover:bg-yellow-600 text-white px-8 py-4 text-lg">
                <Utensils className="w-5 h-5 mr-2" />
                Order Online
              </Button>
            </Link>
            <Link href="/booking">
              <Button variant="outline" className="border-2 border-white hover:bg-white hover:text-gray-800 text-white px-8 py-4 text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Book Table
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-roos-brown mb-4">
              Chef's Special Today
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Handpicked dishes that showcase our culinary expertise and commitment to exceptional flavors
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded mb-4" />
                    <div className="flex justify-between items-center">
                      <div className="h-8 w-16 bg-gray-200 rounded" />
                      <div className="h-6 w-20 bg-gray-200 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredDishes.map((item) => (
                <FeaturedDishCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-roos-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-playfair font-bold text-roos-brown mb-6">
                About Roos Park
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                Located in the heart of the city, Roos Park is more than just a restaurant – it's an experience. 
                Whether you're planning a family dinner, a romantic evening, or a corporate lunch, Roos Park 
                has the ambiance, service, and flavors to make your time unforgettable.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-roos-gold mb-2">5+</div>
                  <div className="text-gray-600">Cuisines</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-roos-gold mb-2">100+</div>
                  <div className="text-gray-600">Menu Items</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-roos-gold mb-2">4.9</div>
                  <div className="text-gray-600 flex items-center justify-center">
                    <Star className="w-4 h-4 text-roos-gold mr-1" />
                    Rating
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-roos-gold mb-2">24/7</div>
                  <div className="text-gray-600">Service</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Restaurant interior"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeaturedDishCard({ item }: { item: MenuItem }) {
  const dietBadgeColor = item.diet === "veg" ? "bg-green-500" : "bg-red-500";
  const getBadgeText = () => {
    if (item.category === "indian") return "Chef's Choice";
    if (item.spice === "spicy") return "Spicy";
    return "Popular";
  };

  return (
    <Card className="group cursor-pointer transform hover:scale-105 transition-transform duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={item.image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"} 
          alt={item.name} 
          className="w-full h-48 object-cover" 
        />
        <Badge className="absolute top-4 right-4 bg-roos-green text-white">
          {getBadgeText()}
        </Badge>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-roos-brown mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-roos-gold">₹{item.price}</span>
          <Badge className={`${dietBadgeColor} text-white`}>
            {item.diet === "veg" ? "Veg" : "Non-Veg"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
