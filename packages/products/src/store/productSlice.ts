import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Product interface
export interface Product {
    id: string;
    name: string;
    rate: number;
}

export interface ProductState {
    products: Product[];
    selectedProduct: Product | null;
}

// Helper function to load products from localStorage
const loadFromLocalStorage = (): Product[] => {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
};

// Helper function to save products to localStorage
const saveToLocalStorage = (products: Product[]) => {
    localStorage.setItem('products', JSON.stringify(products));
};

const initialState: ProductState = {
    products: loadFromLocalStorage(),
    selectedProduct: null,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        loadProducts: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload;
            saveToLocalStorage(state.products); // Save to localStorage
        },
        addProduct: (state, action: PayloadAction<Product>) => {
            state.products.push(action.payload);
            saveToLocalStorage(state.products); // Save to localStorage
        },
        updateProduct: (state, action: PayloadAction<Product>) => {
            const index = state.products.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.products[index] = action.payload;
                saveToLocalStorage(state.products); // Save to localStorage
            }
        },
        deleteProduct: (state, action: PayloadAction<string>) => {
            state.products = state.products.filter(p => p.id !== action.payload);
            saveToLocalStorage(state.products); // Save to localStorage
        },
        setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
            state.selectedProduct = action.payload;
        },
    },
});

export const { loadProducts, addProduct, updateProduct, deleteProduct, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;