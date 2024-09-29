import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Product interface
interface Product {
    id: string;
    name: string;
    price: number;
}

interface ProductState {
    products: Product[];
    selectedProduct: Product | null;
}

const initialState: ProductState = {
    products: [],
    selectedProduct: null,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        loadProducts: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload;
        },
        addProduct: (state, action: PayloadAction<Product>) => {
            state.products.push(action.payload);
            // Save the updated products list to localStorage
            localStorage.setItem('products', JSON.stringify(state.products));
        },
        updateProduct: (state, action: PayloadAction<Product>) => {
            const index = state.products.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.products[index] = action.payload;
                // Save the updated products list to localStorage
                localStorage.setItem('products', JSON.stringify(state.products));
            }
        },
        deleteProduct: (state, action: PayloadAction<string>) => {
            state.products = state.products.filter(p => p.id !== action.payload);
            // Save the updated products list to localStorage
            localStorage.setItem('products', JSON.stringify(state.products));
        },
        setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
            state.selectedProduct = action.payload;
        },
    },
});

export const { loadProducts, addProduct, updateProduct, deleteProduct, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;