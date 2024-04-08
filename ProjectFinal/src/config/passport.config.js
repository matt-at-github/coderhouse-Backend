const passport = require('passport');
const strategyGitHub = require('passport-github2');
const jwt = require('passport-jwt');

const { jwtConfig, passportConfig } = require('../config/config.js');

const UserController = require('../controllers/user.controller.js');
const userController = new UserController();

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {

  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: jwtConfig.secretOrKey,
  }, async (jwt_payload, done) => {
    try {
      console.log('passport.config', 'JWT', 'jwt_payload', jwt_payload);
      const result = await userController.findUserById(jwt_payload.user.id);
      console.log('passport.config', 'JWT', result);
      if (!result.success) {
        return done(null, false);
      }
      return done(null, result.user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    console.log('passport.config', 'serializeUser', user);
    done(null, user);
  });

  passport.deserializeUser(async (user, done) => {

    try {

      // if (user.role === 'admin') { return done(null, user); }

      console.log('passport.config', 'deserializeUser', user.id);
      let result = await userController.findUserById(user.id);

      console.log('passport.config', 'deserializeUser', result.success);
      if (!result.success) { return done(result.message, false); }
      console.log('passport.config', 'deserializeUser', result.user);
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
    callbackURL: 'http://localhost:8080/users/githubcallback'
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
    token = req.cookies[jwtConfig.tokenName];
    //Si hay cookie, tomamos la que yo necesito. 
  }
  return token;
};

module.exports = initializePassport;