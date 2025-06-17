import {
  users,
  adminUsers,
  menuItems,
  bookings,
  reviews,
  orders,
  type User,
  type InsertUser,
  type AdminUser,
  type InsertAdminUser,
  type MenuItem,
  type InsertMenuItem,
  type Booking,
  type InsertBooking,
  type Review,
  type InsertReview,
  type Order,
  type InsertOrder,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Admin Users
  getAdminUser(id: number): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;

  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;

  // Bookings
  getBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;

  // Reviews
  getReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Admin User operations
  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user || undefined;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user || undefined;
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db
      .insert(adminUsers)
      .values(insertUser)
      .returning();
    return user;
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item || undefined;
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const [item] = await db
      .insert(menuItems)
      .values({ ...insertItem, available: true })
      .returning();
    return item;
  }

  async updateMenuItem(id: number, updateData: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const [item] = await db
      .update(menuItems)
      .set(updateData)
      .where(eq(menuItems.id, id))
      .returning();
    return item || undefined;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const result = await db.delete(menuItems).where(eq(menuItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values(insertBooking)
      .returning();
    return booking;
  }

  // Reviews
  async getReviews(): Promise<Review[]> {
    return await db.select().from(reviews);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(insertReview)
      .returning();
    return review;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values({ ...insertOrder, status: "pending" })
      .returning();
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private adminUsers: Map<number, AdminUser>;
  private menuItems: Map<number, MenuItem>;
  private bookings: Map<number, Booking>;
  private reviews: Map<number, Review>;
  private orders: Map<number, Order>;
  private currentUserId: number;
  private currentAdminUserId: number;
  private currentMenuItemId: number;
  private currentBookingId: number;
  private currentReviewId: number;
  private currentOrderId: number;

  constructor() {
    this.users = new Map();
    this.adminUsers = new Map();
    this.menuItems = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    this.orders = new Map();
    this.currentUserId = 1;
    this.currentAdminUserId = 1;
    this.currentMenuItemId = 1;
    this.currentBookingId = 1;
    this.currentReviewId = 1;
    this.currentOrderId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Add default admin user
    const defaultAdmin: AdminUser = {
      id: 1,
      username: "admin",
      password: "admin123", // In production, this should be hashed
      email: "admin@roospark.com",
      role: "admin",
      createdAt: new Date(),
    };
    this.adminUsers.set(1, defaultAdmin);
    this.currentAdminUserId = 2;

    // Add sample menu items
    const sampleMenuItems: InsertMenuItem[] = [
      {
        name: "Butter Chicken",
        description: "Rich and creamy tomato-based curry with tender chicken pieces",
        price: 649,
        category: "indian",
        diet: "nonveg",
        spice: "medium",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Paneer Tikka Masala",
        description: "Grilled paneer cubes in spiced tomato gravy",
        price: 549,
        category: "indian",
        diet: "veg",
        spice: "medium",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Kung Pao Chicken",
        description: "Stir-fried chicken with peanuts, vegetables and chili peppers",
        price: 599,
        category: "chinese",
        diet: "nonveg",
        spice: "spicy",
        image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Vegetable Fried Rice",
        description: "Wok-tossed rice with fresh vegetables and aromatic spices",
        price: 399,
        category: "chinese",
        diet: "veg",
        spice: "mild",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Margherita Pizza",
        description: "Classic pizza with fresh tomatoes, mozzarella and basil",
        price: 499,
        category: "italian",
        diet: "veg",
        spice: "mild",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Chicken Alfredo Pasta",
        description: "Creamy pasta with grilled chicken and parmesan cheese",
        price: 699,
        category: "italian",
        diet: "nonveg",
        spice: "mild",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Grilled Salmon",
        description: "Fresh Atlantic salmon grilled to perfection with herbs",
        price: 899,
        category: "continental",
        diet: "nonveg",
        spice: "mild",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with caesar dressing and croutons",
        price: 449,
        category: "continental",
        diet: "veg",
        spice: "mild",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Classic Burger",
        description: "Juicy beef patty with lettuce, tomato, and special sauce",
        price: 399,
        category: "fastfood",
        diet: "nonveg",
        spice: "mild",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      {
        name: "Crispy French Fries",
        description: "Golden crispy fries seasoned with herbs and salt",
        price: 199,
        category: "fastfood",
        diet: "veg",
        spice: "mild",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      }
    ];

    sampleMenuItems.forEach(item => {
      this.createMenuItem(item);
    });

    // Initialize with sample reviews
    const sampleReviews: InsertReview[] = [
      {
        customerName: "Sarah Rodriguez",
        rating: 5,
        comment: "Absolutely amazing experience! The food quality is exceptional and the ambiance is perfect for a romantic dinner. The staff is incredibly attentive and knowledgeable about the menu."
      },
      {
        customerName: "Michael Kim",
        rating: 5,
        comment: "The variety in their menu is outstanding! From authentic Indian dishes to Italian classics, everything is prepared to perfection. Roos Park has become our family's favorite dining destination."
      },
      {
        customerName: "Aarav Patel",
        rating: 5,
        comment: "Exceptional service and incredible flavors! The online booking system is so convenient, and the restaurant always maintains the highest standards. Highly recommended for any occasion."
      }
    ];

    sampleReviews.forEach(review => {
      this.createReview(review);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Admin User operations
  async getAdminUser(id: number): Promise<AdminUser | undefined> {
    return this.adminUsers.get(id);
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(user => user.username === username);
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const id = this.currentAdminUserId++;
    const user: AdminUser = { 
      id, 
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      role: insertUser.role || "admin",
      createdAt: new Date() 
    };
    this.adminUsers.set(id, user);
    return user;
  }

  // Menu Item methods
  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.available);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuItemId++;
    const item: MenuItem = { ...insertItem, id, available: true, image: insertItem.image || null };
    this.menuItems.set(id, item);
    return item;
  }

  async updateMenuItem(id: number, updateData: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const existingItem = this.menuItems.get(id);
    if (!existingItem) return undefined;

    const updatedItem: MenuItem = { ...existingItem, ...updateData };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      specialRequests: insertBooking.specialRequests || null,
      createdAt: new Date() 
    };
    this.bookings.set(id, booking);
    return booking;
  }

  // Review methods
  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = { 
      ...insertReview, 
      id, 
      createdAt: new Date() 
    };
    this.reviews.set(id, review);
    return review;
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      status: "pending",
      deliveryAddress: insertOrder.deliveryAddress || null,
      specialInstructions: insertOrder.specialInstructions || null,
      createdAt: new Date() 
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const existingOrder = this.orders.get(id);
    if (!existingOrder) return undefined;

    const updatedOrder: Order = { ...existingOrder, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
}

export const storage = new MemStorage();
