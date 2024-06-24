// makes sure that the user is logged in or redirects to the login page
const requiresLogin = (req, res, next) => {
    if (!req.session.account) {
        return res.redirect('/login');
    }
    return next();
};

// makes sure that the user is logged out or redirects to the default home page
const requiresLogout = (req, res, next) => {
    if (req.session.account) {
        return res.redirect('/').json({ message: "user is not logged in" });
    }
    return next();
};

const requiresSecure = (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.hostname}${req.url}`);
    }
    return next();
};

const bypassSecure = (req, res, next) => {
    next();
};

if (process.env.NODE_ENV === 'production') {
    module.exports.requiresSecure = requiresSecure;
} else {
    module.exports.requiresSecure = bypassSecure;
}

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;