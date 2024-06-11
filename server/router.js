const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    // Constants
    app.get("/api", mid.requiresSecure, controllers.Database.api);
    app.get("/default", mid.requiresSecure, controllers.Database.defaultPage);
    app.get("/notFound", mid.requiresSecure, controllers.Database.notFound);

    // Testing 
    app.get("/TestAccountSchema", mid.requiresSecure, controllers.Database.makeFakeAccount);
    app.get("/TestProjectSchema", mid.requiresSecure, controllers.Database.makeFakeProject);
    app.get("/TestMessageSchema", mid.requiresSecure, controllers.Database.makeFakeMessage);
    app.get("/TestPostSchema", mid.requiresSecure, controllers.Database.makeFakePost);
    app.get("/TestCommentSchema", mid.requiresSecure, controllers.Database.makeFakeComment);

    app.get("/", mid.requiresSecure, controllers.Database.api);
    app.get("/*", mid.requiresSecure, controllers.Database.notFound);
};

module.exports = router;