/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Verification Token Schema
 */

var VerificationTokenSchema = new Schema({
    purpose: {type: String, required: true},        // for new user, forgot password, 
    _userId: {type: Schema.Types.ObjectId, required:true, ref: 'Xuser'},
    token: {type: String, required:true},
    createdAt: {type: Date, required: true, default: Date.now, expires: '4h'}
});

var uuid = require('node-uuid');

VerificationTokenSchema.methods = {

  createVerificationToken: function(done) {
      var verificationToken = this;
      var token = uuid.v4();
      verificationToken.set('token', token);
      verificationToken.save(function(err) {
          console.log("Verification Token created and saved ", verificationToken);
          if(err) return(err);
          return done(null,token);
      });
  }
};

mongoose.model('ZerificationToken',VerificationTokenSchema);


