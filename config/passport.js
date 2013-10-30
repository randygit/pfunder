var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('User'),
    config = require('./config');


module.exports = function(passport) {
    //Serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, function(err, user) {
            done(err, user);
        });
    });

    //Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            console.log("passport.local ");
            User.findOne({
                email: email
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    console.log("passport.local unknown user");
                    return done(null, false, {
                        message: 'Passport.local: Unknown user'
                    });
                }
                if (!user.authenticate(password)) {
                    console.log("passport.local invalid password");
                    return done(null, false, {
                        message: 'Passport.local: Invalid password'
                    });
                }
                return done(null, user);
            });
        }
    ));

};
