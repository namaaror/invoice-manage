import { render, screen, fireEvent } from '@testing-library/react';
import { Provider, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import customerReducer, { loadCustomers, setSelectedCustomer, CustomerState } from '../store/customerSlice';
import CustomersPage from './CustomersPage';
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

// Mocking useDispatch
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
}));

describe('CustomersPage', () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        jest.clearAllMocks();  // Clear all mocks before each test
    });

    const renderComponent = () =>
        render(
            <Provider store={mockStore}>
                <CustomersPage />
            </Provider>
        );

    it('should render the CustomersPage component with title and Add New Customer button', () => {
        renderComponent();

        // Check if title and add button are rendered
        expect(screen.getByText('Customers')).toBeInTheDocument();
        expect(screen.getByText('Add New Customer')).toBeInTheDocument();
    });

    it('should dispatch loadCustomers on initial render', () => {
        renderComponent();

        // Check if loadCustomers action is dispatched on mount
        expect(mockDispatch).toHaveBeenCalledWith(loadCustomers());
    });

    it('should open the CustomerFormDrawer when Add New Customer button is clicked', () => {
        renderComponent();

        // Click the Add New Customer button
        fireEvent.click(screen.getByText('Add New Customer'));

        // The drawer should open, check for the title "New Customer"
        expect(screen.getByText('New Customer')).toBeInTheDocument();

        // Optionally, you can also check if the input fields are present in the form
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    });

    it('should close the CustomerFormDrawer when the drawer close event is triggered', () => {
        renderComponent();

        // Open the drawer first by clicking Add New Customer
        fireEvent.click(screen.getByText('Add New Customer'));

        // The drawer should be open, check for the title "New Customer"
        expect(screen.getByText('New Customer')).toBeInTheDocument();

        // Trigger the drawer's close event (ensure the "Cancel" button exists in the form actions)
        fireEvent.click(screen.getByText('Cancel'));

        // The drawer should now be closed, check if it's removed from the DOM
        expect(screen.queryByText('New Customer')).not.toBeInTheDocument();
    });
});
