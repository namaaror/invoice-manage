import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.scss';

const LandingPage: React.FC = () => {
    return (
        <div className={styles.landingPage}>
            <h1>Welcome to Invoice Manager</h1>
            <p>Select a module to manage:</p>
            <div className={styles.links}>
                <Link to="/customers">Manage Customers</Link>
                <Link to="/products">Manage Products</Link>
            </div>
        </div>
    );
};

export default LandingPage;