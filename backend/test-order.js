import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';

dotenv.config();

const testOrder = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/nazrakart');
        console.log('MongoDB Connected');

        // simulate creating an order
        const user = new mongoose.Types.ObjectId();
        const product = new mongoose.Types.ObjectId();

        const newOrder = await Order.create({
            user: user,
            items: [
                {
                    product: product,
                    name: "Test",
                    price: 100,
                    quantity: 1,
                    image: ""
                }
            ],
            shippingAddress: {
                fullName: "Test",
                street: "Test",
                city: "Test",
                state: "Test",
                zipCode: "Test",
                country: "Test",
                phone: "Test"
            },
            paymentMethod: "card",
            itemsPrice: 100,
            shippingPrice: 10,
            taxPrice: 5,
            totalPrice: 115
        });

        console.log('Order created successfully!', newOrder._id);
        process.exit(0);
    } catch (error) {
        console.error('Error creating order:', error.message);
        process.exit(1);
    }
};

testOrder();
