import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function Reviews() {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["/api/reviews"],
    queryFn: api.getReviews,
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <section className="py-16 bg-roos-beige min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-roos-brown mb-4">
            What Our Guests Say
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real feedback from our happy customers who experienced the Roos Park difference
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="w-4 h-4 bg-gray-200 rounded" />
                      ))}
                    </div>
                    <div className="ml-2 w-8 h-4 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    <div className="ml-4">
                      <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <Card key={review.id} className="bg-white shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="flex text-roos-gold">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? "fill-current" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600 font-semibold">
                      {review.rating}.0
                    </span>
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-roos-brown rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitials(review.customerName)}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-roos-brown">
                        {review.customerName}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Verified Customer
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Overall Rating Summary */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-playfair font-bold text-roos-brown mb-4">
              Overall Rating
            </h3>
            <div className="text-5xl font-bold text-roos-gold mb-2">4.9</div>
            <div className="flex justify-center text-roos-gold mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 fill-current" />
              ))}
            </div>
            <p className="text-gray-600">
              Based on {reviews.length}+ verified reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
