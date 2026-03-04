import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useSettings } from '../../context/SettingsContext';

const AdminLayout = () => {
    const { settings } = useSettings();
    const isDarkMode = settings?.darkMode;

    return (
        <div className={`flex min-h-screen bg-white transition-colors duration-300 ${isDarkMode ? 'admin-dark' : ''}`}>
            <AdminSidebar />
            <main className="flex-1 lg:ml-0 overflow-auto">
                <div className="min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
