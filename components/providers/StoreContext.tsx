'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductItem, CartItem } from '@/types';

interface VideoModalData {
  title: string;
  views: string;
  thumbnail: string;
  telegramUrl: string;
  videoUrl?: string;
}

interface ModalState {
  type: 'TEST_DRIVE' | 'SHOWROOM_VISIT' | 'PROJECT_MATCHING' | 'B2B_CLUB' | 'KITCHEN_ESTIMATE' | 'QUICK_CONSULT' | 'SEARCH' | 'VIDEO_PREVIEW' | 'AUTH' | 'EQUIPMENT_SELECTION' | null;
  product?: ProductItem | null;
  preferredShowroom?: string;
  videoData?: VideoModalData | null;
}

interface StoreContextType {
  // Modal state
  modal: ModalState;
  openModal: (
    type: ModalState['type'],
    options?: { product?: ProductItem; preferredShowroom?: string; videoData?: VideoModalData }
  ) => void;
  closeModal: () => void;

  // Cart state
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: ProductItem, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isInCart: (productId: string) => boolean;

  // Wishlist state
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Compare state
  compare: string[];
  toggleCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);

  // Load cart, wishlist, compare from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('simona_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('simona_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCompare = localStorage.getItem('simona_compare');
      if (savedCompare) setCompare(JSON.parse(savedCompare));
    } catch (e) {
      console.error('Error loading stored items:', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('simona_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('simona_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }, [wishlist]);

  // Save compare to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('simona_compare', JSON.stringify(compare));
    } catch (e) {
      console.error('Error saving compare:', e);
    }
  }, [compare]);

  const openModal = (
    type: ModalState['type'],
    options?: { product?: ProductItem; preferredShowroom?: string; videoData?: VideoModalData }
  ) => {
    setModal({
      type,
      product: options?.product || null,
      preferredShowroom: options?.preferredShowroom,
      videoData: options?.videoData || null,
    });
  };

  const closeModal = () => {
    setModal({ type: null, product: null });
  };

  const addToCart = (product: ProductItem, quantity = 1, openDrawer = true) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (productId: string) => cart.some((item) => item.product.id === productId);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const toggleCompare = (productId: string) => {
    setCompare((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInCompare = (productId: string) => compare.includes(productId);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        modal,
        openModal,
        closeModal,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isInCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compare,
        toggleCompare,
        isInCompare,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
