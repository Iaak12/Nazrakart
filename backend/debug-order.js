const debugOrder = async () => {
    try {
        // 1. Register a test user to get token
        const email = `testuser_${Date.now()}@example.com`;
        const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test User', email, password: 'password123' })
        });
        const regData = await regRes.json();
        const token = regData.token;

        if (!token) {
            console.log('Failed to register:', regData);
            return;
        }

        // 2. Get products
        const prodRes = await fetch('http://localhost:5000/api/products');
        const prodData = await prodRes.json();
        const product = prodData.products[0];

        if (!product) {
            console.log('No products found');
            return;
        }

        // 3. Place Order
        const orderData = {
            items: [{
                product: product._id,
                name: product.name,
                image: product.images?.[0] || '',
                price: product.price,
                quantity: 1
            }],
            shippingAddress: {
                fullName: 'Test',
                street: 'Test',
                city: 'Test',
                state: 'Test',
                zipCode: 'Test',
                country: 'Test',
                phone: 'Test'
            },
            paymentMethod: 'card',
            itemsPrice: product.price,
            shippingPrice: 10,
            taxPrice: 5,
            totalPrice: product.price + 15
        };

        const orderRes = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        const orderResult = await orderRes.json();
        console.log('Order API Response Status:', orderRes.status);
        console.log('Order API Response Body:', JSON.stringify(orderResult, null, 2));

    } catch (e) {
        console.error('Script Error:', e.message);
    }
};

debugOrder();
