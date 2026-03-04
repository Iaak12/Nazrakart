import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { user, getToken } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setWishlist(data); // This is populated products
            }
        } catch (error) {
            console.error('Failed to fetch wishlist', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = async (productId) => {
        if (!user) {
            toast.error('Please login to add to wishlist');
            return false;
        }

        try {
            const token = getToken();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist/${productId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                if (data.isWishlisted) {
                    toast.success('Added to Wishlist!', {
                        style: {
                            borderRadius: '8px',
                            background: '#333',
                            color: '#fff',
                        },
                    });
                } else {
                    toast.success('Removed from Wishlist', {
                        icon: '💔',
                        style: {
                            borderRadius: '8px',
                            background: '#333',
                            color: '#fff',
                        },
                    });
                }
                // Optimistically fetch to realign
                await fetchWishlist();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to toggle wishlist', error);
            return false;
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item._id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
