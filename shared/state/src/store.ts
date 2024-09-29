import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './lib/customerSlice';  // Import the customer slice reducer

// If you have other slices, you can import them here as well

export const store = configureStore({
    reducer: {
        customer: customerReducer,  // Add the customer slice reducer to the store
        // You can add more reducers here if needed
    },
});

// Export types for the root state and dispatch, which are useful for typing in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;