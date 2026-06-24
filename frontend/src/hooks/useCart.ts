// import { useState } from "react";
// import { api } from "@/services/api";

// export interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   unit: string;
//   farmer_id: number;
//   quantity: number;
// }

// export function useCart() {
//   const [cart, setCart] = useState<number[]>([]);
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [ordering, setOrdering] = useState(false);

//   function addToCart(product: CartItem) {
//     if (!cart.includes(product.id)) {
//       setCart((prev) => [...prev, product.id]);
//       setCartItems((prev) => [...prev, product]);
//     }
//   }

//   function removeFromCart(id: number) {
//     setCart((prev) => prev.filter((x) => x !== id));
//     setCartItems((prev) => prev.filter((x) => x.id !== id));
//   }

//   function toggleCart(product: CartItem) {
//     if (cart.includes(product.id)) {
//       removeFromCart(product.id);
//     } else {
//       addToCart(product);
//     }
//   }

//   function inCart(id: number) {
//     return cart.includes(id);
//   }

//   async function placeOrder(productId: number, farmerId: number, quantity: number, deliveryAddress: string) {
//     const product = cartItems.find(p => p.id === productId);
//     if (!product) throw new Error("Product not found");

//     setOrdering(true);
//     try {
//       const res = await api.post("/orders", {
//         product_id:       productId,
//         farmer_id:        farmerId,
//         quantity:         quantity,
//         total_price:      product.price * quantity,
//         delivery_address: deliveryAddress,
//       });
//       if (res.success) {
//         removeFromCart(productId);
//         return res.data;
//       }
//       throw new Error(res.message ?? "Failed to place order");
//     } finally {
//       setOrdering(false);
//     }
//   }

//   return { cart, cartItems, addToCart, removeFromCart, toggleCart, inCart, placeOrder, ordering };
// }
import { useState } from "react";
import { api } from "@/services/api";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  unit: string;
  farmer_id: number;
  quantity: number;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function addToCart(product: CartItem) {
    setCartItems((prev) =>
      prev.find(x => x.id === product.id) ? prev : [...prev, { ...product, quantity: 1 }]
    );
  }

  function removeFromCart(id: number) {
    setCartItems((prev) => prev.filter((x) => x.id !== id));
  }

  function toggleCart(product: CartItem) {
    if (inCart(product.id)) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  }

  function updateQuantity(id: number, quantity: number) {
    setCartItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, quantity: Math.max(1, quantity) } : x))
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  function inCart(id: number) {
    return cartItems.some(x => x.id === id);
  }

  const cart = cartItems.map(x => x.id);

  return { cart, cartItems, addToCart, removeFromCart, toggleCart, updateQuantity, clearCart, inCart };
}