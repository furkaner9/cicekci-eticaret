// store/useFavoritesStore.ts
import { create } from 'zustand';

interface FavoritesState {
  favorites: string[]; // Product ID'leri
  isLoading: boolean;
  
  // Actions
  setFavorites: (favorites: string[]) => void;
  addFavorite: (productId: string) => Promise<boolean>;
  removeFavorite: (productId: string) => Promise<boolean>;
  toggleFavorite: (productId: string) => Promise<boolean>;
  isFavorite: (productId: string) => boolean;
  loadFavorites: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,

  setFavorites: (favorites) => set({ favorites }),

  addFavorite: async (productId: string) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        set((state) => ({
          favorites: [...state.favorites, productId],
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Add favorite error:', error);
      return false;
    }
  },

  removeFavorite: async (productId: string) => {
    try {
      const response = await fetch(`/api/favorites?productId=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== productId),
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Remove favorite error:', error);
      return false;
    }
  },

  toggleFavorite: async (productId: string) => {
    const { favorites, addFavorite, removeFavorite } = get();
    
    if (favorites.includes(productId)) {
      return await removeFavorite(productId);
    } else {
      return await addFavorite(productId);
    }
  },

  isFavorite: (productId: string) => {
    return get().favorites.includes(productId);
  },

  loadFavorites: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/favorites');
      
      if (response.ok) {
        const data = await response.json();
        const favoriteIds = data.favorites.map((f: any) => f.productId);
        set({ favorites: favoriteIds });
      }
    } catch (error) {
      console.error('Load favorites error:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));