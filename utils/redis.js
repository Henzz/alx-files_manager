const { createClient } = require("redis");

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on("error", (err) =>
      console.error(`Error connecting to Redis: ${err}`)
    );

    this.client.connect().catch((err) => {
      console.error(`Failed to connect to Redis: ${err}`);
    });
  }

  async isAlive() {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      console.error(`Error checking Redis status: ${error}`);
      return false;
    }
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (error) {
      console.error(`Error retrieving value for key "${key}": ${error}`);
      return null;
    }
  }

  async set(key, value, duration) {
    try {
      await this.client.set(key, value, { EX: duration });
    } catch (error) {
      console.error(`Error setting value for key "${key}": ${error}`);
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error("Error deleting key: ", error);
    }
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
