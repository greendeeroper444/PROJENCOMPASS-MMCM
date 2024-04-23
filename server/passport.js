const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");
const UserModel = require("./models/userModel");
const jwt = require('jsonwebtoken');
const sendTokenUser = require("./utils/jwtTokenUser");

const CLIENT_ID = "191698580777-gne2s9tr0qog8blk3h5kshnvs96d0skk.apps.googleusercontent.com"
const CLIENT_SECRET = "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"

passport.use(new OAuth2Strategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback",
    scope: ["profile", "email"],
},
    async(accessToken, refreshToken, profile, done) => {
        try {
            let user =  await UserModel.findOne({ googleId: profile.id });
            
            if(!user){
                user = new UserModel({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile._json.email,
                    image: profile._json.picture
                });

                await user.save();
            }

            // sendTokenUser(user, 200, res);
            user.image = profile._json.picture;

            return done(null, user)
        } catch (error) {
            return done(error, null)
        }
    }
));

//api key = AIzaSyC48dtOLWX9mAwDYn_X2yZcEXkagornlRs

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = {
    googleAuth: passport.authenticate("google", { scope: ["profile", "email"] }),

    googleCallback: passport.authenticate("google", {
        successRedirect: "http://localhost:5173/home",
        failureRedirect: "http://localhost:5173/"
    }),
};