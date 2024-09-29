import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CustomersPage } from '@invoice-manager/customers';
import { ProductsPage } from '@invoice-manager/products';
import { InvoicesPage } from '@invoice-manager/invoices';
import LandingPage from './LandingPage';
import NavBar from './Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        {/* Use the NavBar component */}
        <NavBar />

        {/* Routes */}
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Customers Module */}
          <Route path="/customers" element={<CustomersPage />} />

          {/* Products Module */}
          <Route path="/products" element={<ProductsPage />} />

          {/* Invoices Module */}
          <Route path="/invoices" element={<InvoicesPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;