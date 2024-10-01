import reducer, {
    loadCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    setSelectedCustomer,
    CustomerState,
} from './customerSlice';

// Mock the localStorage functions
const mockLocalStorage = (() => {
    let store: Record<string, string> = {};

    return {
        getItem(key: string) {
            return store[key] || null;
        },
        setItem(key: string, value: string) {
            store[key] = value;
        },
        clear() {
            store = {};
        },
        removeItem(key: string) {
            delete store[key];
        },
    };
})();

beforeEach(() => {
    // Mock localStorage globally
    global.localStorage = mockLocalStorage as Storage;
    mockLocalStorage.clear();
});

describe('customerSlice', () => {
    const initialState: CustomerState = {
        customers: [],
        selectedCustomer: null,
    };

    const mockCustomer = {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '123-456-7890',
    };

    const updatedCustomer = {
        id: '1',
        name: 'John Updated',
        email: 'johnupdated@example.com',
        phone: '987-654-3210',
    };

    it('should load customers from localStorage', () => {
        // Set localStorage with mock customers
        const mockCustomers = [mockCustomer];
        localStorage.setItem('customers', JSON.stringify(mockCustomers));

        // Dispatch loadCustomers action
        const newState = reducer(initialState, loadCustomers());

        // Assert that customers were loaded from localStorage
        expect(newState.customers).toEqual(mockCustomers);
    });

    it('should add a new customer and update localStorage', () => {
        // Dispatch addCustomer action
        const newState = reducer(initialState, addCustomer(mockCustomer));

        // Assert that customer is added to the state
        expect(newState.customers).toContainEqual(mockCustomer);

        // Assert that customer is saved in localStorage
        const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
        expect(storedCustomers).toContainEqual(mockCustomer);
    });

    it('should update an existing customer and update localStorage', () => {
        // Set initial state with a mock customer
        const stateWithCustomer = { ...initialState, customers: [mockCustomer] };

        // Dispatch updateCustomer action
        const newState = reducer(stateWithCustomer, updateCustomer(updatedCustomer));

        // Assert that customer is updated in the state
        expect(newState.customers).toContainEqual(updatedCustomer);

        // Assert that the updated customer is saved in localStorage
        const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
        expect(storedCustomers).toContainEqual(updatedCustomer);
    });

    it('should delete a customer and update localStorage', () => {
        // Set initial state with a mock customer
        const stateWithCustomer = { ...initialState, customers: [mockCustomer] };

        // Dispatch deleteCustomer action
        const newState = reducer(stateWithCustomer, deleteCustomer(mockCustomer.id));

        // Assert that customer is removed from the state
        expect(newState.customers).not.toContainEqual(mockCustomer);

        // Assert that customer is removed from localStorage
        const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
        expect(storedCustomers).not.toContainEqual(mockCustomer);
    });

    it('should set the selected customer', () => {
        // Dispatch setSelectedCustomer action
        const newState = reducer(initialState, setSelectedCustomer(mockCustomer));

        // Assert that selectedCustomer is set in the state
        expect(newState.selectedCustomer).toEqual(mockCustomer);
    });

    it('should clear the selected customer', () => {
        // Set initial state with a selected customer
        const stateWithSelectedCustomer = { ...initialState, selectedCustomer: mockCustomer };

        // Dispatch setSelectedCustomer with null to clear selection
        const newState = reducer(stateWithSelectedCustomer, setSelectedCustomer(null));

        // Assert that selectedCustomer is cleared
        expect(newState.selectedCustomer).toBeNull();
    });
});
