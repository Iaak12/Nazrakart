import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdInventory,
  MdShoppingCart,
  MdPeople,
  MdMenu,
  MdClose,
  MdSettings,
  MdLogout,
  MdEmail,
  MdCategory,
  MdPalette,
  MdQuestionAnswer,
  MdInfo,
  MdHome,
  MdFavorite
} from 'react-icons/md';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: '/admin', icon: MdDashboard, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: MdInventory, label: 'Products' },
    { to: '/admin/orders', icon: MdShoppingCart, label: 'Orders' },
    { to: '/admin/categories', icon: MdCategory, label: 'Categories' },
    { to: '/admin/themes', icon: MdPalette, label: 'Themes' },
    { to: '/admin/home', icon: MdHome, label: 'Home Page Info' },
    { to: '/admin/faqs', icon: MdQuestionAnswer, label: 'FAQs' },
    { to: '/admin/about', icon: MdInfo, label: 'About Us' },
    { to: '/admin/users', icon: MdPeople, label: 'Users' },
    { to: '/admin/contacts', icon: MdEmail, label: 'Inquiries' },
    { to: '/admin/wishlists', icon: MdFavorite, label: 'Wishlists' },
    { to: '/admin/careers', icon: MdDashboard, label: 'Careers' },
    { to: '/admin/stores', icon: MdDashboard, label: 'Stores' },
    { to: '/admin/terms', icon: MdDashboard, label: 'Terms' },
    { to: '/admin/privacy', icon: MdDashboard, label: 'Privacy' },
    { to: '/admin/settings', icon: MdSettings, label: 'Settings' },
  ];

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 font-medium ${isActive
      ? 'bg-tss-red text-white shadow-md shadow-red-500/20'
      : 'text-gray-600 hover:text-tss-red hover:bg-gray-50'
    }`;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-md text-gray-900 shadow-sm"
      >
        {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-tss-red flex items-center justify-center shadow-md shadow-red-500/20">
                <span className="text-white font-black text-xl italic tracking-tighter">S</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
                  Store Admin
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">Management Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              Main Menu
            </p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={linkClasses}
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@store.com</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-tss-red transition-colors rounded-md hover:bg-white border border-transparent hover:border-gray-200">
                <MdLogout size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
