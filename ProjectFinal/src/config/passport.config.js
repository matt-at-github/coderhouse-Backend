const passport = require('passport');
const strategyLocal = require('passport-local');
const strategyGitHub = require('passport-github2');
const jwt = require('passport-jwt');

const { jwtConfig, passportConfig } = require('../config/config.js');

const UserController = require('../controllers/user.controller.js');
const userController = new UserController();

const SessionController = require('../controllers/session.controller.js');
const sessionController = new SessionController(passport);

const LocalStrategy = strategyLocal.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {

  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: jwtConfig.secretOrKey,
    //Misma palabra secreta que en la App.js
  }, async (jwt_payload, done) => {
    try {
      return done(null, jwt_payload);
    } catch (error) {
      return done(error);
    }
  }));

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
    clientID: passportConfig.github.clientId,
    clientSecret: passportConfig.github.clientSecret,
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

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['coderCookieToken'];
    //Si hay cookie, tomamos la que yo necesito. 
  }
  return token;
};

module.exports = initializePassport;