// utils/db.js

const { MongoClient } = require("mongodb");

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || "localhost";
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || "files_manager";

    const uri = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(uri, { useUnifiedTopology: true });
    this.connected = false;

    this.client
      .connect()
      .then(() => {
        this.connected = true;
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
      });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    try {
      const database = this.client.db();
      const usersCollection = database.collection("users");
      return await usersCollection.countDocuments();
    } catch (error) {
      console.error("Error counting users:", error);
      return 0;
    }
  }

  async nbFiles() {
    try {
      const database = this.client.db();
      const filesCollection = database.collection("files");
      return await filesCollection.countDocuments();
    } catch (error) {
      console.error("Error counting files:", error);
      return 0;
    }
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
module.exports = dbClient;
