// plugins/mongodb.js
const fp = require("fastify-plugin");
const mongoose = require("mongoose");

module.exports = fp(async (fastify, opts) => {
  try {
    // MongoDB se connect karo
    await mongoose.connect(process.env.MONGODB_URI);

    // Fastify instance me mongoose inject kar rahe hain
    fastify.decorate("mongoose", mongoose);

    fastify.log.info("✅ MONGODB connected successfully!");
  } catch (err) {
    fastify.log.error("❌ MongoDB connection failed!");
    fastify.log.error(err);
    process.exit(1);
  }
});
