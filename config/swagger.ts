export default {
    path: __dirname + "/../",
    title: "MarketX", // use info instead
    version: "1.0.0", // use info instead
    description: "MarketPlace API", // use info instead
    tagIndex: 2,
    info: {
        title: "MarketX",
        version: "1.0.0",
        description: "MarketPlace API developed with AdonisJS and a MySQL database",
    },
    snakeCase: true,
  
    debug: false, // set to true, to get some useful debug output
    ignore: ["/swagger", "/docs", "/", "/uploads/**" ],
    preferredPutPatch: "PUT", // if PUT/PATCH are provided for the same route, prefer PUT
    common: {
      parameters: {}, // OpenAPI conform parameters that are commonly used
      headers: {}, // OpenAPI conform headers that are commonly used
    },
    securitySchemes: {}, // optional
    authMiddlewares: ["auth", "auth:api"], // optional
    defaultSecurityScheme: "BearerAuth", // optional
    persistAuthorization: true, // persist authorization between reloads on the swagger page
    showFullPath: false, // the path displayed after endpoint summary
};
