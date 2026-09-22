import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid Egyptian phone number required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const OrderItemSchema = z.object({
  productId: z.string().min(1),
  title: z.string().min(1),
  quantity: z.number().int().positive().max(100),
  price: z.number().nonnegative().optional(),
  image: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  note: z.string().max(500).optional(),
});

export const CreateOrderSchema = z.object({
  userName: z.string().min(2, 'Name is required').max(100).optional(),
  userPhone: z.string().min(10, 'Valid phone number is required').max(15),
  userId: z.string().optional(),
  items: z.array(OrderItemSchema).min(1, 'Order must have at least one item'),
  shippingDetails: z.object({
    address: z.string().min(3, 'Address is required'),
    city: z.string().min(2, 'City is required'),
  }).optional(),
  paymentMethod: z.enum(['cod', 'vodafone_cash', 'instapay']).default('cod'),
  paymentReceipt: z.string().optional(),
  isWhatsAppOrder: z.boolean().optional(),
});

export const ProductSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(5000).optional(),
  price: z.number().positive(),
  category: z.string().optional(),
  colors: z.array(z.string()).optional(),
  stock: z.number().int().nonnegative().default(0),
  featured: z.boolean().optional(),
  images: z.array(z.string()).optional(),
});
