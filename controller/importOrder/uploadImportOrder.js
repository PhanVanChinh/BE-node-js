const uploadProductPermission = require("../../helpers/permission");
const importOrderModel = require("../../models/importOrderModel");
const supplierModel = require("../../models/supplierModel");
const warehouseModel = require("../../models/warehouseModel");

const uploadImportOrder = async (req, res) => {
    try {
        const sessionUserId = req.userId;

        if (!uploadProductPermission(sessionUserId)) {
            throw new Error("Permission denied");
        }

        const selectedWarehouseId = req.body.warehouse;
        if (!selectedWarehouseId) {
            throw new Error("Selected warehouse not provided");
        }

        const newImportOrder = new importOrderModel(req.body);
        const savedImportOrder = await newImportOrder.save();

        const supplierUpdate = await supplierModel.findByIdAndUpdate(
            savedImportOrder.supplier,
            { $push: { orders: savedImportOrder._id } },
            { new: true, useFindAndModify: false }
        );

        if (!supplierUpdate) {
            throw new Error("Failed to update supplier");
        }

        const existingInventory = await warehouseModel.findById(selectedWarehouseId);
        if (!existingInventory) {
            throw new Error("Selected warehouse not found");
        }

        if (!Array.isArray(existingInventory.products)) {
            existingInventory.products = [];
        }

        for (const product of savedImportOrder.products) {
            const productIndex = existingInventory.products.findIndex(p => p.product.toString() === product.product.toString());
            if (productIndex !== -1) {
                existingInventory.products[productIndex].quantity += product.quantity;
            } else {
                existingInventory.products.push({ product: product.product, quantity: product.quantity });
            }
        }

        existingInventory.importOrder.push(savedImportOrder._id);
        existingInventory.suppliers.push(savedImportOrder.supplier);

        await existingInventory.save();

        res.status(201).json({
            message: "Import Order uploaded successfully",
            error: false,
            success: true,
            data: savedImportOrder
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || 'Failed to create import order',
            error: true,
            success: false
        });
    }
};

module.exports = uploadImportOrder;
