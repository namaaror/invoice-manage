import { configureStore } from '@reduxjs/toolkit';
import customerReducer from '@invoice-manager/customers';  // Path to customer slice
import productReducer from '@invoice-manager/products';    // Path to product slice

// Configure the Redux store
export const store = configureStore({
    reducer: {
        customer: customerReducer,  // Customer slice
        product: productReducer,    // Product slice
    },
});

// Export types for the root state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;