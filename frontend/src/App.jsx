import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { SettingsProvider } from './context/SettingsContext'
import { WishlistProvider } from './context/WishlistContext'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'

// Layout components
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'

// Admin imports
import AdminLayout from './components/Admin/AdminLayout'
import AdminDashboard from './pages/Admin/AdminDashboard'
import ProductManagement from './pages/Admin/ProductManagement'
import OrderManagement from './pages/Admin/OrderManagement'
import PaymentsManagement from './pages/Admin/PaymentsManagement'
import UserManagement from './pages/Admin/UserManagement'
import AdminSettings from './pages/Admin/AdminSettings'
import ContactSubmissions from './pages/Admin/ContactSubmissions'
import CategoryManagement from './pages/Admin/CategoryManagement'
import ThemeManagement from './pages/Admin/ThemeManagement'
import FaqManagement from './pages/Admin/FaqManagement'
import AboutManagement from './pages/Admin/AboutManagement'
import HomeManagement from './pages/Admin/HomeManagement'
import AdminCareers from './pages/Admin/AdminCareers'
import AdminStores from './pages/Admin/AdminStores'
import AdminTerms from './pages/Admin/AdminTerms'
import AdminPrivacy from './pages/Admin/AdminPrivacy'
import AdminWishlist from './pages/Admin/AdminWishlist'

// Auth pages
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import AdminAuth from './pages/Auth/AdminAuth'

// Customer pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import Contact from './pages/Contact'
import Orders from './pages/Orders'
import Settings from './pages/Settings'
import AboutUs from './pages/AboutUs'
import FAQ from './pages/FAQ'
import Returns from './pages/Returns'
import Shipping from './pages/Shipping'
import Careers from './pages/Careers'
import Stores from './pages/Stores'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Wishlist from './pages/Wishlist'

// User layout wrapper
const UserLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to={adminOnly ? "/admin" : "/login"} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin Route - shows AdminAuth if not logged as admin, otherwise shows admin pages
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated or not admin, show AdminAuth page
  if (!isAuthenticated() || user?.role !== 'admin') {
    return <AdminAuth />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes - No layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Routes with Navbar/Footer */}
      <Route path="/" element={<UserLayout><Home /></UserLayout>} />
      <Route path="/about" element={<UserLayout><AboutUs /></UserLayout>} />
      <Route path="/faq" element={<UserLayout><FAQ /></UserLayout>} />
      <Route path="/returns" element={<UserLayout><Returns /></UserLayout>} />
      <Route path="/shipping" element={<UserLayout><Shipping /></UserLayout>} />
      <Route path="/careers" element={<UserLayout><Careers /></UserLayout>} />
      <Route path="/stores" element={<UserLayout><Stores /></UserLayout>} />
      <Route path="/terms" element={<UserLayout><Terms /></UserLayout>} />
      <Route path="/privacy" element={<UserLayout><Privacy /></UserLayout>} />
      <Route path="/shop" element={<UserLayout><Shop /></UserLayout>} />
      <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />
      <Route path="/product/:id" element={<UserLayout><ProductDetail /></UserLayout>} />
      <Route path="/cart" element={<UserLayout><Cart /></UserLayout>} />
      <Route path="/wishlist" element={<UserLayout><Wishlist /></UserLayout>} />

      {/* Protected Customer Routes */}
      <Route path="/checkout" element={
        <ProtectedRoute>
          <UserLayout><Checkout /></UserLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserLayout><Profile /></UserLayout>
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <UserLayout><Orders /></UserLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <UserLayout><Settings /></UserLayout>
        </ProtectedRoute>
      } />

      {/* Admin Routes - Shows AdminAuth if not admin */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="themes" element={<ThemeManagement />} />
        <Route path="home" element={<HomeManagement />} />
        <Route path="faqs" element={<FaqManagement />} />
        <Route path="about" element={<AboutManagement />} />
        <Route path="careers" element={<AdminCareers />} />
        <Route path="stores" element={<AdminStores />} />
        <Route path="terms" element={<AdminTerms />} />
        <Route path="privacy" element={<AdminPrivacy />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="payments" element={<PaymentsManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="contacts" element={<ContactSubmissions />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="wishlists" element={<AdminWishlist />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <SettingsProvider>
      <AuthProvider>
        <WishlistProvider>
          <CurrencyProvider>
            <CartProvider>
              <HelmetProvider>
                <BrowserRouter>
                  <Toaster position="top-center" reverseOrder={false} />
                  <AppRoutes />
                </BrowserRouter>
              </HelmetProvider>
            </CartProvider>
          </CurrencyProvider>
        </WishlistProvider>
      </AuthProvider>
    </SettingsProvider>
  )
}

export default App
