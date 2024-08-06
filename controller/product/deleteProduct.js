
const productModel = require('../../models/productModel');

const deleteProduct = async (req, res) => {
    try {
        const productId = req.body._id;

        
        const deleteResult = await productModel.deleteOne({ _id: productId });

        if (deleteResult.deletedCount === 1) {
         
            await supplierModel.updateMany(
                { productsSupplied: productId },
                { $pull: { productsSupplied: productId } }
            );

            res.json({
                message: 'Product deleted successfully.',
                error: false,
                success: true,
                data: deleteResult
            });
        } else {
            res.json({
                message: 'Product not found.',
                error: false,
                success: false
            });
        }
    } catch (error) {
        res.json({
            message: error.message || 'An error occurred while deleting product.',
            error: true,
            success: false
        });
    }
};

module.exports = deleteProduct;
