
const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});

redisClient.on("error", (error) => {
    console.error("Redis error:", error.message);
});

async function connectRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    const response = await redisClient.ping();
    console.log("Redis connection successful:", response);
}

module.exports = { redisClient, connectRedis };
