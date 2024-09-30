import { render, screen, fireEvent } from '@testing-library/react';
import { Provider, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { addCustomer, updateCustomer, setSelectedCustomer } from '../store/customerSlice';
import customerReducer, { CustomerState } from '../store/customerSlice';
import CustomerFormDrawer from './CustomerFormDrawer';
import '@testing-library/jest-dom';

// Mock Redux store setup
const mockStore = configureStore({
    reducer: {
        customer: customerReducer,
    },
});

// Mock react-redux using Object.assign to avoid the spread operator issue
jest.mock('react-redux', () => {
    const actualReactRedux = jest.requireActual('react-redux');  // Get the real module
    return Object.assign({}, actualReactRedux, {
        useDispatch: jest.fn(),  // Mock only the useDispatch function
    });
});

describe('CustomerFormDrawer', () => {
    const renderComponent = (isOpen: boolean, selectedCustomer: CustomerState['selectedCustomer'], onClose: jest.Mock) => {
        // Preload state with selectedCustomer if required
        const preloadedState: CustomerState = {
            customers: [],
            selectedCustomer,
        };

        const store = configureStore({
            reducer: {
                customer: customerReducer,
            },
            preloadedState: {
                customer: preloadedState,
            },
        });

        return render(
            <Provider store={store}>
                <CustomerFormDrawer isOpen={isOpen} onClose={onClose} />
            </Provider>
        );
    };

    beforeEach(() => {
        (useDispatch as unknown as jest.Mock).mockReturnValue(jest.fn()); // Mock useDispatch
    });

    it('should dispatch addCustomer when submitting new customer', () => {
        const dispatch = jest.fn();
        (useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);

        const onClose = jest.fn();

        renderComponent(true, null, onClose);

        // Fill in the form
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } });
        fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '1234567890' } });

        // Submit the form
        fireEvent.click(screen.getByText('Save'));

        // Check if addCustomer is dispatched
        expect(dispatch).toHaveBeenCalledWith(
            addCustomer({
                id: expect.any(String),
                name: 'Jane Doe',
                email: 'jane@example.com',
                phone: '1234567890',
            })
        );
        expect(onClose).toHaveBeenCalled();
    });

    it('should dispatch updateCustomer when submitting existing customer', () => {
        const dispatch = jest.fn();
        (useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);

        const selectedCustomer = {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
        };
        const onClose = jest.fn();

        renderComponent(true, selectedCustomer, onClose);

        // Change the name and submit the form
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Johnny Doe' } });
        fireEvent.click(screen.getByText('Update'));

        // Check if updateCustomer is dispatched
        expect(dispatch).toHaveBeenCalledWith(
            updateCustomer({
                id: '1',
                name: 'Johnny Doe',
                email: 'john@example.com',
                phone: '1234567890',
            })
        );
        expect(onClose).toHaveBeenCalled();
    });
});