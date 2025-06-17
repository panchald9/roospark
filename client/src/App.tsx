import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Gallery from "@/pages/Gallery";
import Reviews from "@/pages/Reviews";
import Booking from "@/pages/Booking";
import Order from "@/pages/Order";
import Admin from "@/pages/Admin";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-roos-beige">
      <Navigation />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/menu" component={Menu} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/reviews" component={Reviews} />
          <Route path="/booking" component={Booking} />
          <Route path="/order" component={Order} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
