import { ReactNode } from "react";
import home from "@/public/lottie/home.json";
import Lottie from "lottie-react";
export type Category = {
  id: string;
  label: string;
  icon: ReactNode;
};

export type HomeProperty = {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  nights: string;
  tag?: string;
  category: string;
  images?: string[];
  image?: string;
  phone: string; 
  address: string;
  email: string;
  checkIn: string;
  checkOut: string;
  
};

export const categories: Category[] = [
  { id: "all", label: "All homes", icon: "home" },
  
  { id: "beach", label: "Beachfront", icon: "🏖️" },
  { id: "mountain", label: "Mountain", icon: "⛰️" },
  { id: "city", label: "City loft", icon: "🏙️" },
  { id: "cabin", label: "Cabin", icon: "🌲" },
  { id: "villa", label: "Villa", icon: "🏛️" },
  { id: "island", label: "Island", icon: "🏝️" },
  { id: "farm", label: "Farm stay", icon: "🌾" },
];

export const categoryGradients: Record<string, [string, string]> = {
  all: ["#F5E6D3", "#EDD5BA"],
  beach: ["#C8E8E0", "#A8D4CB"],
  mountain: ["#D4E2C8", "#BACED0"],
  city: ["#D8D0E8", "#C0B8D8"],
  cabin: ["#EAD8C0", "#D4BFA0"],
  villa: ["#F0D8C8", "#DCC0A8"],
  island: ["#C8DCF0", "#A8C8E8"],
  farm: ["#E4E0C0", "#CCC8A0"],
};

export const properties: HomeProperty[] = [
  { id: 1, 
    title: "Cliffside Pool Villa", 
    location: "Santorini, New Delhi", 
    price: 420, 
    rating: 4.97, 
    reviews: 234, 
    nights: "Mar 12-17", 
    tag: "Guest favourite", 
    category: "villa",
    images: [
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
  "https://images.unsplash.com/photo-1494526585095-c41746248156",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
],
    phone: "919876543210", 
    address: "Ranthambore Road, Rajasthan, India",
    email: "hotel@example.com", checkIn: "2:00 PM", 
    checkOut: "12:00 PM"
  },
  { id: 2, title: "Alpine Chalet & Hot Tub", location: "Zermatt, Mumbai", price: 340, rating: 4.95, reviews: 187, nights: "Mar 8-11", tag: "Rare find", category: "mountain",image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511" , phone: "919876543210",address: "Ranthambore Road, Rajasthan, India",email: "hotel@example.com", checkIn: "2:00 PM", checkOut: "12:00 PM"},
  { id: 3, title: "Tropical Beach Bungalow", location: "Koh Samui, Goa", price: 190, rating: 4.92, reviews: 310, nights: "Apr 2-9", category: "beach",image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511", phone: "919876543210",address: "Ranthambore Road, Rajasthan, India",email: "hotel@example.com", checkIn: "2:00 PM", checkOut: "12:00 PM" },
  { id: 4, title: "Bali Jungle Retreat", location: "Ubud, Musoorie ", price: 230, rating: 4.98, reviews: 421, nights: "Mar 20-24", tag: "Guest favourite", category: "villa",image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511" , phone: "919876543210",address: "Ranthambore Road, Rajasthan, India",email: "hotel@example.com", checkIn: "2:00 PM", checkOut: "12:00 PM"},
  { id: 5, title: "Cedar Forest Cabin", location: "Big Sur, California", price: 280, rating: 4.91, reviews: 156, nights: "Apr 14-16", category: "cabin",image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511" , phone: "919876543210",address: "Ranthambore Road, Rajasthan, India",email: "hotel@example.com", checkIn: "2:00 PM", checkOut: "12:00 PM"},
  { id: 6, title: "Private Island Escape", location: "Maldives", price: 980, rating: 5, reviews: 89, nights: "May 1-6", tag: "Luxury pick", category: "island",image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511" , phone: "919876543210",address: "Ranthambore Road, Rajasthan, India",email: "hotel@example.com", checkIn: "2:00 PM", checkOut: "12:00 PM"},
  { id: 7, title: "Historic Farmhouse", location: "Tuscany, Italy", price: 260, rating: 4.88, reviews: 203, nights: "Apr 5-8", category: "farm",image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511" , phone: "919876543210",address: "Ranthambore Road, Rajasthan, India",email: "hotel@example.com", checkIn: "2:00 PM", checkOut: "12:00 PM"},
  { id: 8, title: "Lakeside Nordic Cabin", location: "Lapland, Finland", price: 310, rating: 4.94, reviews: 142, nights: "Mar 28-Apr 1", tag: "Rare find", category: "cabin",image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511" , phone: "919876543210",address: "Ranthambore Road, Rajasthan, India",email: "hotel@example.com", checkIn: "2:00 PM", checkOut: "12:00 PM"},
];

export const destinationCards = [
  {
    name: "Delhi",
    sub: "India",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
  },
  {
    name: "Dubai",
    sub: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  },
  {
    name: "Lucknow",
    sub: "India",
    image: "https://images.unsplash.com/photo-1600532761550-1c3a6d4e4c0b",
  },
  {
    name: "Uttarakhand",
    sub: "India",
    image: "https://images.unsplash.com/photo-1627894483216-2138af692e32",
  },
];
export const marqueeItems = [
  "Santorini",
  "Bali",
  "Kyoto",
  "Tuscany",
  "Maldives",
  "Patagonia",
  "Amalfi",
  "Lapland",
  "Ubud",
  "Zermatt",
  "Big Sur",
  "Koh Samui",
];

export const navLinks = ["Places", "Experiences", "Journal", "Host"];

export const popularTags = ["Santorini", "Bali", "Tuscany", "Kyoto", "Maldives"];

export const stats = [
  { value: 4, suffix: "M+", label: "Active listings" },
  { value: 220, suffix: "+", label: "Countries" },
  { value: 98, suffix: "%", label: "Guest satisfaction" },
  { value: 12, suffix: "M+", label: "Happy travellers" },
];

export const processSteps = [
  {
    number: "01",
    icon: "🔍",
    title: "Search & filter",
    description: "Browse thousands of vetted homes with smart filters for location, price, and amenities.",
  },
  {
    number: "02",
    icon: "📅",
    title: "Pick your dates",
    description: "Choose your travel window and see instant availability with transparent all-in pricing.",
  },
  {
    number: "03",
    icon: "🏠",
    title: "Arrive & enjoy",
    description: "Check in smoothly and begin your stay with your host's personal welcome message.",
  },
];

export const footerColumns = [
  { title: "Explore", links: ["All stays", "Experiences", "New listings", "Gift cards"] },
  { title: "Hosting", links: ["Become a host", "Resources", "Community", "Insurance"] },
  { title: "Company", links: ["About us", "Careers", "Press", "Help centre"] },
];