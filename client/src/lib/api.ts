import { apiRequest } from "./queryClient";
import type { MenuItem, InsertMenuItem, Booking, InsertBooking, Review, InsertReview, Order, InsertOrder } from "@shared/schema";

export const api = {
  // Menu Items
  getMenuItems: async (): Promise<MenuItem[]> => {
    const response = await apiRequest("GET", "/api/menu-items");
    return response.json();
  },

  createMenuItem: async (item: InsertMenuItem): Promise<MenuItem> => {
    const response = await apiRequest("POST", "/api/menu-items", item);
    return response.json();
  },

  updateMenuItem: async (id: number, item: Partial<InsertMenuItem>): Promise<MenuItem> => {
    const response = await apiRequest("PUT", `/api/menu-items/${id}`, item);
    return response.json();
  },

  deleteMenuItem: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/menu-items/${id}`);
  },

  // Bookings
  getBookings: async (): Promise<Booking[]> => {
    const response = await apiRequest("GET", "/api/bookings");
    return response.json();
  },

  createBooking: async (booking: InsertBooking): Promise<Booking> => {
    const response = await apiRequest("POST", "/api/bookings", booking);
    return response.json();
  },

  // Reviews
  getReviews: async (): Promise<Review[]> => {
    const response = await apiRequest("GET", "/api/reviews");
    return response.json();
  },

  createReview: async (review: InsertReview): Promise<Review> => {
    const response = await apiRequest("POST", "/api/reviews", review);
    return response.json();
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    const response = await apiRequest("GET", "/api/orders");
    return response.json();
  },

  createOrder: async (order: InsertOrder): Promise<Order> => {
    const response = await apiRequest("POST", "/api/orders", order);
    return response.json();
  },

  updateOrderStatus: async (id: number, status: string): Promise<Order> => {
    const response = await apiRequest("PATCH", `/api/orders/${id}/status`, { status });
    return response.json();
  },

  // Admin Stats
  getAdminStats: async (): Promise<any> => {
    const response = await apiRequest("GET", "/api/admin/stats");
    return response.json();
  },
};
