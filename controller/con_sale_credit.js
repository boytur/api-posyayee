const Product = require('../schema/product_schema');
const CreditSale = require('../schema/sale_credit_schema');

exports.con_sale_credit = async (req, res) => {
    try {
        const { products } = req.body;
        const currentDate = new Date();
        const dateOnly = currentDate.toISOString().split('T')[0];

        let totalPrice = 0;
        let productUpdatePromises = [];
        let dailySalePromise;

        for (const product of products) {
            const result = await Product.findOne({ _id: product._id });

            if (!result) {
                return res.status(400).json({ message: 'ไม่พบสินค้า' });
            }

            const productPrice = result.price * product.quantity;
            totalPrice += productPrice;

            if (result.volume !== null) {
                productUpdatePromises.push(
                    Product.updateOne(
                        { _id: product._id },
                        {
                            $inc: { volume: -product.quantity },
                            $currentDate: { lastUpdated: false },
                        }
                    )
                );
            }
        }

        const existingDailySale = await CreditSale.findOne({ date: dateOnly });

        if (existingDailySale) {
            existingDailySale.salesAmount += totalPrice;
            dailySalePromise = existingDailySale.save();
        } else {
            const newCreditSale = new CreditSale({
                date: dateOnly,
                salesAmount: totalPrice,
            });
            dailySalePromise = newCreditSale.save();
        }

        await Promise.all([...productUpdatePromises, dailySalePromise]);

        res.status(200).json({ message: 'การขายเครดิตเสร็จสมบูรณ์' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'ข้อผิดพลาดบนเซิร์ฟเวอร์' });
    }
};
