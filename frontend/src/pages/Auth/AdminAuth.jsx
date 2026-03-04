import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdPerson, MdEmail, MdLock, MdPhone, MdVisibility, MdVisibilityOff, MdAdminPanelSettings, MdSecurity } from 'react-icons/md';

const AdminAuth = () => {
    const [mode, setMode] = useState('login'); // 'login', 'register', 'otp'
    const [step, setStep] = useState(1); // For registration: 1=details, 2=otp

    // Form data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = '/admin';
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tss-red shadow-lg mb-4">
                        <MdAdminPanelSettings className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-wider text-gray-900">Admin Portal</h1>
                    <p className="text-gray-500 mt-1">NazraKart Management System</p>
                </div>

                {/* Auth Card */}
                <div className="bg-white rounded-xl p-8 shadow-xl border border-gray-100">
                    {/* Mode Toggle Removed - Only Login allowed */}

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
                            {success}
                        </div>
                    )}

                    {/* LOGIN FORM */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">Admin Login</h2>
                            <p className="text-gray-500 mt-1">Enter your admin credentials</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Email</label>
                            <div className="relative">
                                <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tss-red font-medium transition-all"
                                    placeholder="admin@nazrakart.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Password</label>
                            <div className="relative">
                                <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tss-red font-medium transition-all"
                                    placeholder="Enter password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-tss-red text-white rounded-md font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md mt-4"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>



                    <div className="mt-8 pt-6 border-t border-gray-700 text-center">
                        <Link to="/" className="text-gray-400 hover:text-white text-sm">
                            ← Back to Store
                        </Link>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-xs">
                        🔒 Only authorized personnel with valid phone numbers can register as admin
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminAuth;
