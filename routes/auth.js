const authController = require("../controllers/authController.js");

module.exports = async function (fastify, opts) {
  // Register
  fastify.post("/register", authController.register);

  // Login
  fastify.post("/login", authController.login);

  // Forgot password
  fastify.post("/forgot-password", authController.forgotPassword);

  // Reset password (with token param)
  fastify.post("/reset-password/:token", authController.resetPassword);

  // Logout (protected route - needs authentication)
  fastify.post(
    "/logout",
    { preHandler: [fastify.authenticate] },
    authController.logout
  );
};
