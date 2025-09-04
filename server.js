const auth = require("./routes/auth");

require("dotenv").config();
const fastify = require("fastify")({ logger: true });   //SERVER APNI ACTIVITY CONSOLE ME PRINT KREGA

fastify.register(require("@fastify/cors"))
fastify.register(require("@fastify/sensible"))
fastify.register(require("@fastify/env"),{
    dotenv:true,
    schema : {
        type: 'object',
        required : ['PORT' , "MONGODB_URI", "JWT_TOKEN"],
        properties:{
            PORT:{type:'string' , default:3000},
            MONGODB_URI:{type:'string'},
            JWT_TOKEN:{type:'string'},
        }
    }
})



// add custom plugins


fastify.register(require("./plugins/mongodb"));
fastify.register(require("@fastify/jwt"))


fastify.register(require('./routes/auth'),{prefix:api/auth})
// Route  to print hello wrld

fastify.get("/", (request, reply) => {
  reply.send({ hello: "world" });
});

// test database connection

fastify.get("/test-db", async (request, reply) => {
  try {
    const mongoose = fastify.mongoose;
    const connectionState = mongoose.connection.readyState;

    let status = "";
    switch (connectionState) {
      case 0:
        status = "disconnected";
        break;
      case 1:
        status = "connected";
        break;
      case 2:
        status = "connecting";
        break;
      case 3:
        status = "disconnecting";
        break;
      default:
        status = "unknown";
        break;
    }

    return { dbStatus: status };
  } catch (err) {
    fastify.log.error(err);
    reply.status(500).send({ error: "Failed to test database" });
  }
});



const start = async () => {  // fastify.listen() promise return thats why async
  try {
    await fastify.listen({ port: process.env.PORT });  // server ko start kregi
    fastify.log.info(
      `Server is running at http://localhost:${process.env.PORT}`
    );
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
