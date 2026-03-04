import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Aggregate totals
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalCustomers = await User.countDocuments();

        // Calculate Total Revenue
        const orders = await Order.find({ isPaid: true });
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        // Recent Orders
        const recentOrdersRaw = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name');
        const recentOrders = recentOrdersRaw.map(order => ({
            id: `#ORD-${order._id.toString().substring(18, 24).toUpperCase()}`,
            customer: order.user ? order.user.name : 'Guest',
            product: order.items && order.items.length > 0 ? order.items[0].name : 'N/A',
            amount: `$${order.totalPrice}`,
            status: order.status
        }));

        // Top Products (Since we don't track sales, taking random or top rated)
        const topProductsRaw = await Product.find().sort({ rating: -1, numReviews: -1 }).limit(4);
        const topProducts = topProductsRaw.map(product => {
            const mockSales = Math.floor(Math.random() * 200) + 50;
            return {
                name: product.name,
                sales: mockSales,
                revenue: `$${(mockSales * product.price).toLocaleString()}`,
                image: product.images && product.images.length > 0 ? product.images[0] : product.hoverImage || 'https://via.placeholder.com/150'
            };
        });

        res.json({
            stats: {
                totalRevenue: `$${totalRevenue.toLocaleString()}`,
                totalOrders,
                totalProducts,
                totalCustomers,
                // Sending dummy change data for now since we don't have historical data
                totalRevenueChange: '+12.5%',
                totalOrdersChange: '+8.2%',
                totalProductsChange: '+3.1%',
                totalCustomersChange: '-2.4%',
                isRevenuePositive: true,
                isOrdersPositive: true,
                isProductsPositive: true,
                isCustomersPositive: false
            },
            recentOrders,
            topProducts
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
