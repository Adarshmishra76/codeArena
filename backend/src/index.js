
const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisclient = require('./config/redis');
const problemRouter = require('./routes/problemCreater');
const submitRouter = require("./routes/submit");
const aiRouter=require("./routes/aiChatting")
const videoRouter = require("./routes/videoCreator");

const cors = require('cors');


app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://codearena03.netlify.app"
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("CodeArena Backend is running 🚀");
    
app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);
// ✅ Global error handler - prevents crashes
app.use((err, req, res, next) => {
    console.error('❌ Global error:', err.message);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

const InitalizeConnection = async () => {
    try {
        await main();
        console.log("✅ MongoDB connected");

        // ✅ Try Redis, but don't crash if it fails
        try {
            await redisclient.connect();
            console.log("✅ Redis connected");
        } catch (redisError) {
            console.error("❌ Redis connection failed:", redisError.message);
            console.log("⚠️ Server will continue without Redis");
            // Redis will retry in background
        }

        const server = app.listen(process.env.PORT || 3000, () => {
            console.log(`🚀 Server listening at port ${process.env.PORT || 3000}`);
        });

        return server;
    } catch (err) {
        console.error("❌ Error starting server:", err);
        setTimeout(InitalizeConnection, 5000);
    }
};

InitalizeConnection();

// ✅ Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Shutting down...');
    if (redisclient.isReady) {
        await redisclient.quit();
        console.log('✅ Redis connection closed');
    }
    process.exit(0);
});

module.exports = app;
