var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    root: rootPath,
    port: process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip: process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",
    db: process.env.MONGOHQ_URL,
    mailer: {
      auth: {
        user: 'patakfund@gmail.com',
        pass: '19patak08'
      
      },
      defaultFromAddress: 'noreply@patakfund.com'
    }
}
