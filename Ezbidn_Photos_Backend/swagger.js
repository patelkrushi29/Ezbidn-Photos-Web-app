const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
      version: "1.0.0",
      title: "Project",
      description: "Swagger Dev apis",
    },
    host: "https://api.ezbidn.com",
  };
  const outputFile = "./swagger.json";
  const routes = ["./src/routes/index.js"];
  swaggerAutogen(outputFile, routes, doc);
  