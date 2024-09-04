// controllers/UsersController.js

const dbClient = require('../utils/db');
const crypto = require('crypto');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check for missing email
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // Check for missing password
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if the email already exists
    const existingUser = await dbClient.client
      .db()
      .collection('users')
      .findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = crypto
      .createHash('sha1')
      .update(password)
      .digest('hex');

    // Create the new user
    const newUser = { email, password: hashedPassword };
    const result = await dbClient.client
      .db()
      .collection('users')
      .insertOne(newUser);

    // Return the new user with only the email and id
    return res.status(201).json({ id: result.insertedId, email });
  }
}

module.exports = UsersController;
