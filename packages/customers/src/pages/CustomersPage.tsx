import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadCustomers, setSelectedCustomer } from '../store/customerSlice';
import CustomerFormDrawer from '../components/CustomerFormDrawer';
import CustomerList from '../components/CustomerList';
import styles from './CustomersPage.module.scss';

export const CustomersPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load customers from localStorage when the page first loads
  useEffect(() => {
    dispatch(loadCustomers());
  }, [dispatch]);

  // Handle opening the drawer for adding a new customer
  const handleAddCustomer = () => {
    dispatch(setSelectedCustomer(null)); // Reset the selected customer for adding a new one
    setIsDrawerOpen(true);
  };

  // Handle opening the drawer for editing an existing customer
  const handleEditCustomer = (customer: any) => {
    dispatch(setSelectedCustomer(customer)); // Set the selected customer for editing
    setIsDrawerOpen(true);
  };

  // Handle closing the drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className={styles.customersPage}>
      <h1>Customers</h1>

      <button onClick={handleAddCustomer} className={styles.addButton}>
        Add New Customer
      </button>

      {/* Use CustomerList component */}
      <CustomerList onEdit={() => setIsDrawerOpen(true)} />

      {isDrawerOpen && <CustomerFormDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />}
    </div>
  );
};

export default CustomersPage;