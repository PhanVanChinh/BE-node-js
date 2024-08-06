

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const router = require('./routes/router');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Middleware
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Route
app.use("/api", router);

// Start Server Function
const startServer = async () => {
    try {
        // Kết nối cơ sở dữ liệu
        await connectDB();
        console.log("Connected to DB successfully");

        // Bắt đầu server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error during server startup:", error.message);
        process.exit(1); // Thoát với mã lỗi 1 nếu có lỗi khởi động server
    }
};

// Gọi hàm khởi động server
startServer();
