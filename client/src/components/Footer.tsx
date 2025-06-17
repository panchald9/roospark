import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-roos-brown text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-playfair font-bold mb-4">Roos Park</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Experience culinary excellence where flavor, comfort, and variety come together in perfect harmony. 
              From traditional classics to global delicacies, we serve all types of food and drinks.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-roos-gold transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-roos-gold transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-roos-gold transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-roos-gold transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-300 hover:text-roos-gold transition-colors duration-200">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/order" className="text-gray-300 hover:text-roos-gold transition-colors duration-200">
                  Order Online
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-300 hover:text-roos-gold transition-colors duration-200">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-300 hover:text-roos-gold transition-colors duration-200">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-300 hover:text-roos-gold transition-colors duration-200">
                  Book Table
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                123 Culinary Street, Food District
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +91-XXXXXXXXXX
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                info@roospark.com
              </p>
              <p className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Open: 12:00 PM - 11:00 PM
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            &copy; 2024 Roos Park. All rights reserved. | Designed with passion for food lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
