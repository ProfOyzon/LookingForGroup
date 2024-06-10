const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    // Constants
    app.get("/api", mid.requiresSecure, controllers.Database.api);
    app.get("/default", mid.requiresSecure, controllers.Database.defaultPage);
    app.get("/notFound", mid.requiresSecure, controllers.Database.notFound);

    app.get("/", mid.requiresSecure, controllers.Database.api);
    app.get("/*", mid.requiresSecure, controllers.Database.notFound);
};

module.exports = router;