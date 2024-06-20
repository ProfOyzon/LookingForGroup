const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    // Constants
    app.get("/api", mid.requiresSecure, controllers.Database.api);
    app.get("/default", mid.requiresSecure, controllers.Database.defaultPage);
    app.get("/notFound", mid.requiresSecure, controllers.Database.notFound);

    // Accounts
    app.get("/login", mid.requiresSecure, controllers.Database.login);
    app.get("/signup", mid.requiresSecure, controllers.Database.signup);
    app.get("/updateAccountByID", mid.requiresSecure, controllers.Database.updateAccountByID);
    app.get("/getAccountByID", mid.requiresSecure, controllers.Database.getAccountByID);
    app.get("/addSkillsByAccountID", mid.requiresSecure, controllers.Database.addSkillsByAccountID);

    // Projects
    app.get("/createProject", mid.requiresSecure, controllers.Database.createProject);
    app.get("/updateProjectByID", mid.requiresSecure, controllers.Database.updateProjectByID);

    // Posts
    app.get("/createPost", mid.requiresSecure, controllers.Database.createPost);
    app.get("/updatePostByID", mid.requiresSecure, controllers.Database.updatePostByID);

    // Comments
    app.get("/createComment", mid.requiresSecure, controllers.Database.createComment);
    app.get("/updateCommentByID", mid.requiresSecure, controllers.Database.updateCommentByID);

    // Messages 
    app.get("/createMessage", mid.requiresSecure, controllers.Database.createMessage);
    app.get("/updateMessageByID", mid.requiresSecure, controllers.Database.updateMessageByID);

    // Testing 
    app.get("/TestAccountSchema", mid.requiresSecure, controllers.Tests.makeFakeAccount);
    app.get("/TestProjectSchema", mid.requiresSecure, controllers.Tests.makeFakeProject);
    app.get("/TestMessageSchema", mid.requiresSecure, controllers.Tests.makeFakeMessage);
    app.get("/TestPostSchema", mid.requiresSecure, controllers.Tests.makeFakePost);
    app.get("/TestCommentSchema", mid.requiresSecure, controllers.Tests.makeFakeComment);

    app.get("/", mid.requiresSecure, controllers.Database.api);
    app.get("/*", mid.requiresSecure, controllers.Database.notFound);
};

module.exports = router;