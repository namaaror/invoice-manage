import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation
import styles from './Navbar.module.scss'; // Import styles

const Navbar: React.FC = () => {
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link to="/customers" className={styles.navLink}>Customers</Link>
                </li>
                <li className={styles.navItem}>
                    <Link to="/products" className={styles.navLink}>Products</Link>
                </li>
                <li className={styles.navItem}>
                    <Link to="/invoices" className={styles.navLink}>Invoices</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;