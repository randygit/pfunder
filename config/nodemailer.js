var nodemailer = require('nodemailer');

module.exports = function(nodemailer) {
  var smtpTransport = nodemailer.createTransport('SMTP', {
	  service: 'Gmail',
	  auth: {
	    user: "mintlifesavers@gmail.com",
	    pass: "19mint12"
	  }
  });
}



