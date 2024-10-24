import { createClient } from 'redis';

let redisClient;

const initializeRedisClient = async () => {
  if (!redisClient) {
    redisClient = await createClient({ socket: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT } });

    redisClient.on('error', (error) => console.error(`Redis CLient Error: ${error}`));
  }

  try {
    await redisClient.connect();
    console.log('Redis connection successful');
  } catch (error) {
    console.log(`Error connecting to Redis: ${error}`);
  }

  return redisClient;
};

const getCacheValue = async (key) => {
  try {
    const client = await initializeRedisClient();
    const value = await client.get(key);

    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Unable to get value ${key}: ${error}`)
    return null;
  }
};

const setCacheValue = async (key, value) => {
  try {
    const client = await initializeRedisClient();
    await client.set(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to set cache for key ${key}: ${error}`);
  }
};

export { getCacheValue, setCacheValue };
