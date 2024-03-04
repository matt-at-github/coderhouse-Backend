const passport = require('passport');
const strategyLocal = require('passport-local');
const strategyGitHub = require('passport-github2');

const UserController = require('../controllers/user.controller.js');
const userController = new UserController();

const SessionController = require('../controllers/session.controller.js');
const sessionController = new SessionController(passport);

const LocalStrategy = strategyLocal.Strategy;

const initializePassport = () => {

  // Passport Local Strategy
  passport.use('register',
    new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {

        try {
          req.body.password = password;
          const result = await userController.createUser(req);
          if (!result.success) return done(result.message, false);

          return done(null, result.user);
        } catch (error) {
          return done(error);
        }
      })
  );

  passport.use('login',
    new LocalStrategy({ usernameField: 'email' },
      async (email, password, done) => {
        try {

          const req = { body: { email: email, password: password }, session: { login: false } };
          console.log('passport', req);
          const result = await sessionController.authenticate(req);
          if (!result.success) { return done(result.message, false); }

          return done(null, result.user);
        } catch (error) {
          return done(error);
        }
      })
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (user, done) => {
    
    try {

      if (user.role === 'admin') { return done(null, user); }

      let result = await userController.findUserById({ _id: user._id });
      if (!result.success) { return done(result.message, false); }
      return done(null, result.user);
    }
    catch (error) {
      return done(error);
    }
  });

  // Passport GitHub Strategy 
  passport.use('github', new strategyGitHub({
    clientID: 'Iv1.7e41068a2165f5cd',
    clientSecret: '70ba7055f7fcb2402260043e195b1ec06870169c',
    callbackURL: 'http://localhost:8080/sessions/githubcallback'
  }, async (accessToken, refreshToken, profile, done) => {

    try {

      const newUserResult = await userController.createGithubUser(profile);
      if (!newUserResult.success) {
        if (!newUserResult.user) { // duplicated key error code
          return done(newUserResult.message, false);
        }
      }
      return done(null, newUserResult.user);
    } catch (error) {
      return done(error);
    }

  }));
};

module.exports = initializePassport;