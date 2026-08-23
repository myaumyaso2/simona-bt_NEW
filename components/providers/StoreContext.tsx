'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductItem, CartItem } from '@/types';

interface ModalState {
  type: 'TEST_DRIVE' | 'SHOWROOM_VISIT' | 'PROJECT_MATCHING' | 'B2B_CLUB' | 'KITCHEN_ESTIMATE' | 'QUICK_CONSULT' | 'SEARCH' | null;
  product?: ProductItem | null;
  preferredShowroom?: string;
}

interface StoreContextType {
  // Modal state
  modal: ModalState;
  openModal: (type: ModalState['type'], options?: { product?: ProductItem; preferredShowroom?: string }) => void;
  closeModal: () => void;

  // Cart state
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: ProductItem, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('simona_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading cart:', e);
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

  const openModal = (
    type: ModalState['type'],
    options?: { product?: ProductItem; preferredShowroom?: string }
  ) => {
    setModal({
      type,
      product: options?.product || null,
      preferredShowroom: options?.preferredShowroom,
    });
  };

  const closeModal = () => {
    setModal({ type: null, product: null });
  };

  const addToCart = (product: ProductItem, quantity = 1) => {
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
    setIsCartOpen(true);
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
