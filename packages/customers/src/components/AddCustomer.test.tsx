import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { addCustomer } from '../store/customerSlice';
import AddCustomer from './AddCustomer';
import customerReducer, { CustomerState } from '../store/customerSlice';
import '@testing-library/jest-dom';

// Mock Redux store setup
const mockStore = configureStore({
  reducer: {
    customer: customerReducer,
  },
});

describe('AddCustomer', () => {
  const renderComponent = () =>
    render(
      <Provider store={mockStore}>
        <AddCustomer />
      </Provider>
    );

  it('should render the AddCustomer form', () => {
    renderComponent();

    // Check if input fields are displayed
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();

    // Check if the "Add Customer" button is rendered
    expect(screen.getByText('Add Customer')).toBeInTheDocument();
  });

  it('should update input fields on change', () => {
    renderComponent();

    // Simulate typing in the Name input field
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    expect(screen.getByPlaceholderText('Name')).toHaveValue('John Doe');

    // Simulate typing in the Email input field
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    expect(screen.getByPlaceholderText('Email')).toHaveValue('john@example.com');

    // Simulate typing in the Phone input field
    fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '1234567890' } });
    expect(screen.getByPlaceholderText('Phone')).toHaveValue('1234567890');
  });

  it('should dispatch addCustomer when the form is submitted', () => {
    const dispatchSpy = jest.spyOn(mockStore, 'dispatch');

    renderComponent();

    // Simulate typing into the form
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '1234567890' } });

    // Click the "Add Customer" button
    fireEvent.click(screen.getByText('Add Customer'));

    // Ensure addCustomer was dispatched with the correct payload
    expect(dispatchSpy).toHaveBeenCalledWith(
      addCustomer({
        id: expect.any(String),  // We expect the id to be a string (as it is generated from Date.now())
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
      })
    );
  });
});