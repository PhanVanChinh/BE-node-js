const User = require('../models/userModel'); // Import model User nếu cần

async function isAdmin(req, res, next) {
    try {
        const userId = req.userId; // Lấy userId từ middleware authToken
        
        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated",
                error: true,
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        if (user.role !== 'ADMIN') { // Kiểm tra nếu role của user không phải là admin
            return res.status(403).json({
                message: "Access denied",
                error: true,
                success: false
            });
        }

        next();
    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = isAdmin;