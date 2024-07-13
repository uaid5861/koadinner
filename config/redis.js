const Redis = require('ioredis');

const redisClient = new Redis({
    host: 'localhost',
    port: 6379,
    // password: 'your-redis-password', // 如果 Redis 需要密码
});

const redisSubscriber = new Redis({
    host: 'localhost',
    port: 6379,
    // password: 'your-redis-password', // 如果 Redis 需要密码
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (error) => {
    console.error('Redis connection error:', error);
});

redisSubscriber.on('connect', () => {
    console.log('Connected to Redis Subscriber');
});

redisSubscriber.on('error', (error) => {
    console.error('Redis Subscriber connection error:', error);
});

module.exports = { redisClient, redisSubscriber };
