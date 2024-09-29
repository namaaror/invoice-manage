import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@invoice-manager/state';
import { loadCustomers, deleteCustomer } from '@invoice-manager/state';
import CustomerFormDrawer from '../components/CustomerFormDrawer';
import styles from './CustomersPage.module.scss';

export const CustomersPage: React.FC = () => {
  const dispatch = useDispatch();
  const customers = useSelector((state: RootState) => state.customer.customers);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load customers from localStorage when the page first loads
  useEffect(() => {
    dispatch(loadCustomers());
  }, [dispatch]);

  // Handle opening the drawer for adding a new customer
  const handleAddCustomer = () => {
    setIsDrawerOpen(true);
  };

  // Handle closing the drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter customers based on the search query
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  return (
    <div className={styles.customersPage}>
      <h1>Customers</h1>

      <button onClick={handleAddCustomer} className={styles.addButton}>
        Add New Customer
      </button>

      <input
        type="text"
        placeholder="Search by name, email, or phone"
        value={searchQuery}
        onChange={handleSearchChange}
        className={styles.searchInput}
      />

      <table className={styles.customerTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>
                <button className={styles.editButton}>Edit</button>
                <button
                  className={styles.deleteButton}
                  onClick={() => dispatch(deleteCustomer(customer.id))}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>

      {isDrawerOpen && <CustomerFormDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />}
    </div>
  );
};

export default CustomersPage;