const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    // Constants
    app.get("/api", mid.requiresSecure, controllers.Database.api);
    app.get("/notFound", mid.requiresSecure, controllers.Database.notFound);

    // Accounts
    app.get("/login", mid.requiresSecure, mid.requiresLogout, controllers.Database.login);
    app.get("/signup", mid.requiresSecure, mid.requiresLogout, controllers.Database.signup);
    app.get("/logout", mid.requiresSecure, mid.requiresLogin, controllers.Database.logout);
    app.get("/updateAccount", mid.requiresSecure, mid.requiresLogin, controllers.Database.updateAccount);
    app.get("/getAccountByID", mid.requiresSecure, controllers.Database.getAccountByID);

    // Projects
    app.get("/createProject", mid.requiresSecure, mid.requiresLogin, controllers.Database.createProject);
    app.get("/updateProjectByID", mid.requiresSecure, mid.requiresLogin, mid.requiresProjectAdmin, controllers.Database.updateProjectByID);
    app.get("/getProjectByID", mid.requiresSecure, controllers.Database.getProjectByID);

    // Posts
    app.get("/createPost", mid.requiresSecure, mid.requiresLogin, mid.requiresProjectAdmin, controllers.Database.createPost);
    app.get("/updatePostByID", mid.requiresSecure, mid.requiresLogin, mid.requiresProjectAdmin, mid.requiresPostAuthor, controllers.Database.updatePostByID);
    app.get("/getPostByID", mid.requiresSecure, controllers.Database.getPostByID);

    // Comments
    app.get("/createComment", mid.requiresSecure, mid.requiresLogin, controllers.Database.createComment);
    app.get("/updateCommentByID", mid.requiresSecure, mid.requiresLogin, mid.requiresCommentAuthor, controllers.Database.updateCommentByID);
    app.get("/getCommentByID", mid.requiresSecure, controllers.Database.getCommentByID);

    // Messages 
    app.get("/createMessage", mid.requiresSecure, mid.requiresLogin, controllers.Database.createMessage);
    app.get("/updateMessageByID", mid.requiresSecure, mid.requiresLogin, mid.requiresMessageSender, controllers.Database.updateMessageByID);
    app.get("/getMessageByID", mid.requiresSecure, mid.requiresLogin, controllers.Database.getMessageByID);

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