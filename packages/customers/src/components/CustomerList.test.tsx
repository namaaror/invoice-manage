import { render, screen, fireEvent } from '@testing-library/react';
import { Provider, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import customerReducer, { setSelectedCustomer, deleteCustomer, CustomerState } from '../store/customerSlice';
import CustomerList from './CustomerList';
import '@testing-library/jest-dom';  // Ensure Jest DOM matchers are available

// Mock Redux store data
const mockCustomers = [
    { id: '1', name: 'Customer 1', email: 'customer1@example.com', phone: '123-456-7890' },
    { id: '2', name: 'Customer 2', email: 'customer2@example.com', phone: '987-654-3210' },
];

const preloadedCustomerState: CustomerState = {
    customers: mockCustomers,
    selectedCustomer: null,
};

// Mock Redux store setup
const mockStore = configureStore({
    reducer: {
        customer: customerReducer,
    },
    preloadedState: {
        customer: preloadedCustomerState,
    },
});

// Fix: Use Jest's native mocking without spreading
jest.mock('react-redux', () => {
    return {
        ...jest.requireActual('react-redux'),  // Spread the actual react-redux functions
        useDispatch: jest.fn(),               // Mock useDispatch
    };
});

describe('CustomerList', () => {
    const mockOnEdit = jest.fn();  // Mock onEdit function
    const mockDispatch = jest.fn(); // Mock dispatch function

    beforeEach(() => {
        (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch); // Mock dispatch return
        jest.clearAllMocks();  // Clear all mocks before each test
    });

    const renderComponent = () =>
        render(
            <Provider store={mockStore}>
                <CustomerList onEdit={mockOnEdit} />
            </Provider>
        );

    it('should render the customer list', () => {
        renderComponent();

        // Check if the mock customers are displayed
        mockCustomers.forEach((customer) => {
            expect(screen.getByText(customer.name)).toBeInTheDocument();
            expect(screen.getByText(customer.email)).toBeInTheDocument();
            expect(screen.getByText(customer.phone)).toBeInTheDocument();
        });
    });

    it('should filter customers based on search input', () => {
        renderComponent();

        // Search for "Customer 1"
        fireEvent.change(screen.getByPlaceholderText('Search customers...'), {
            target: { value: 'Customer 1' },
        });

        // Check that only "Customer 1" is shown
        expect(screen.getByText('Customer 1')).toBeInTheDocument();
        expect(screen.queryByText('Customer 2')).not.toBeInTheDocument();
    });

    it('should dispatch setSelectedCustomer and call onEdit when Edit is clicked', () => {
        renderComponent();

        // Click on "Edit" for the first customer
        fireEvent.click(screen.getAllByText('Edit')[0]);

        // Check if setSelectedCustomer is dispatched with the correct customer
        expect(mockDispatch).toHaveBeenCalledWith(setSelectedCustomer(mockCustomers[0]));

        // Check if onEdit is called
        expect(mockOnEdit).toHaveBeenCalled();
    });

    it('should dispatch deleteCustomer when Delete is clicked', () => {
        renderComponent();

        // Click on "Delete" for the first customer
        fireEvent.click(screen.getAllByText('Delete')[0]);

        // Check if deleteCustomer is dispatched with the correct customer id
        expect(mockDispatch).toHaveBeenCalledWith(deleteCustomer(mockCustomers[0].id));
    });
});