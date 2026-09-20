// Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import ScrollToTop from './ScrollToTop';
import "./Layout.css";

const Layout = () => {
  return (
    <div className="layout-app-container">
      <ScrollToTop />
      <div className="layout-wrapper">
        <Navbar />
        <main className="main-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
