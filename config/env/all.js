var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    root: rootPath,
    port: process.env.PORT || 3000,
    db: process.env.MONGOHQ_URL,
    mailer: {
      auth: {
        user: 'patakfund@gmail.com',
        pass: '19patak08'
      
      },
      defaultFromAddress: 'noreply@patakfund.com'
    }
}
