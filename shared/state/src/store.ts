import { configureStore } from '@reduxjs/toolkit';
import customerReducer from '@invoice-manager/customers';
import productReducer from '@invoice-manager/products';
import invoiceReducer from '@invoice-manager/invoices';

export const store = configureStore({
    reducer: {
        customer: customerReducer,
        product: productReducer,
        invoice: invoiceReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;