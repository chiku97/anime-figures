import { createSlice } from '@reduxjs/toolkit';

const cartJson = localStorage.getItem('hikari_cart');

const initialState = {
  items: cartJson ? JSON.parse(cartJson) : [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, title, price, image, scale, qty = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.qty += qty;
      } else {
        state.items.push({ id, title, price, image, scale, qty });
      }
      
      localStorage.setItem('hikari_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      localStorage.setItem('hikari_cart', JSON.stringify(state.items));
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem && qty > 0) {
        existingItem.qty = qty;
      }
      localStorage.setItem('hikari_cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('hikari_cart');
    }
  }
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
