import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { CustomersPage } from '@invoice-manager/customers';
import { ProductsPage } from '@invoice-manager/products';
import LandingPage from './LandingPage';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/customers">Customers</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
          </ul>
        </nav>

        {/* Use Routes instead of Switch */}
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Customers Module */}
          <Route path="/customers" element={<CustomersPage />} />

          {/* Products Module */}
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;