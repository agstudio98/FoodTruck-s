const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    // Estructura del usuario que viene de Google
    const newUser = {
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName
    };

    try {
      // Buscar si el usuario ya existe por email
      let user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // Si existe, lo vinculamos con googleId si no lo tenía
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      } else {
        // Si no existe, lo creamos
        user = await User.create(newUser);
        return done(null, user);
      }
    } catch (err) {
      console.error(err);
      return done(err, null);
    }
  }));
};