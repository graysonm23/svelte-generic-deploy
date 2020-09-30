const User = require("./user");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  // here we are defining the localStrategy to be used when we call upon passport
  passport.use(
    new localStrategy((username, password, done) => {
      User.findOne({ username }, (err, user) => {
        if (err) throw err;
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    })
  );

  // serializeUser takes a cookie and stores it into the browser, the second parameter as you guessed  in the callback will store the users id
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  // this will unravel the cookie, checking the id in the database to make sure that user is who they say they are
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      // here we are defining what information will be sent back when we unravel who they are
      const userInformation = {
        username: user.username,
      };
      //? we don't want to bring back the users password into the front end so we created an object to decide what comes back
      cb(err, userInformation);
    });
  });
};
