import { createClient } from 'redis';

let client;

const initializeRedisClient = async () => {
  if (!client) {
    client = await createClient({ socket: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT } });

    client.on('error', (error) => console.error(`Redis CLient Error: ${error}`));
  }

  try {
    await client.connect();
    console.log('Redis connection successful');
  } catch (error) {
    console.log(`Error connecting to Redis: ${error}`);
  }

  return client;
};

const getCacheValue = async (key) => {
  try {
    const value = await client.get(key);

    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Unable to get value ${key}: ${error}`)
    return null;
  }
};

const setCacheValue = async (key, value) => {
  try {
    await client.set(key, JSON.stringify(value));
    await client.expire(key, process.env.REDIS_TTL)
  } catch (error) {
    console.error(`Unable to set cache for key ${key}: ${error}`);
  }
};

export { getCacheValue, initializeRedisClient, setCacheValue };
