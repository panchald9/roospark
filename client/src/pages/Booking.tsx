import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { insertBookingSchema, type InsertBooking } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Booking() {
  const { toast } = useToast();

  const form = useForm<InsertBooking>({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      guestCount: 0,
      bookingDate: "",
      bookingTime: "",
      specialRequests: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: api.createBooking,
    onSuccess: (booking) => {
      toast({
        title: "Booking Confirmed! 🎉",
        description: `Thank you ${booking.guestName}! Your table reservation for ${booking.guestCount} guests on ${booking.bookingDate} at ${booking.bookingTime} has been confirmed. We'll send a confirmation email to ${booking.guestEmail}.`,
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBooking) => {
    bookingMutation.mutate(data);
  };

  // Get today's date for minimum date validation
  const today = new Date().toISOString().split('T')[0];

  const timeSlots = [
    "12:00", "12:30", "13:00", "13:30", "14:00",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
  ];

  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-roos-brown mb-4">
            Reserve Your Table
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Book your perfect dining experience at Roos Park with our easy online reservation system
          </p>
        </div>

        <Card className="bg-roos-beige shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-playfair text-roos-brown">
              Table Reservation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-roos-brown font-semibold">Full Name *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter your full name"
                          className="border-2 border-gray-300 focus:border-roos-brown"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guestEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-roos-brown font-semibold">Email Address *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          placeholder="Enter your email"
                          className="border-2 border-gray-300 focus:border-roos-brown"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guestPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-roos-brown font-semibold">Phone Number *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="tel"
                          placeholder="Enter your phone number"
                          className="border-2 border-gray-300 focus:border-roos-brown"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guestCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-roos-brown font-semibold">Number of Guests *</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className="border-2 border-gray-300 focus:border-roos-brown">
                            <SelectValue placeholder="Select guests" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} Guest{num > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                          <SelectItem value="8">8+ Guests</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bookingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-roos-brown font-semibold">Preferred Date *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date"
                          min={today}
                          className="border-2 border-gray-300 focus:border-roos-brown"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bookingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-roos-brown font-semibold">Preferred Time *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-2 border-gray-300 focus:border-roos-brown">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time === "12:00" ? "12:00 PM" :
                               time === "12:30" ? "12:30 PM" :
                               time === "13:00" ? "1:00 PM" :
                               time === "13:30" ? "1:30 PM" :
                               time === "14:00" ? "2:00 PM" :
                               time === "18:00" ? "6:00 PM" :
                               time === "18:30" ? "6:30 PM" :
                               time === "19:00" ? "7:00 PM" :
                               time === "19:30" ? "7:30 PM" :
                               time === "20:00" ? "8:00 PM" :
                               time === "20:30" ? "8:30 PM" :
                               "9:00 PM"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-roos-brown font-semibold">Special Requests</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={4}
                          placeholder="Any dietary restrictions, special occasions, or seating preferences..."
                          className="border-2 border-gray-300 focus:border-roos-brown"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-roos-brown hover:bg-roos-chocolate text-white font-semibold py-4 px-8 text-lg"
                    disabled={bookingMutation.isPending}
                  >
                    <CalendarCheck className="w-5 h-5 mr-2" />
                    {bookingMutation.isPending ? "Processing..." : "Confirm Reservation"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
