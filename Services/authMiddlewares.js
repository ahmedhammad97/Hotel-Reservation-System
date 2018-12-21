const keys = require(__dirname + '/keys/admin');
const bcrypt = require('bcrypt')

module.exports = {

  isAdmin(req, res, next){
    bcrypt.compare(req.cookies.email, keys.username, function(err, result) {
      if(err) throw err;
      if(result!==true){
        res.send("You don't have the privilage.");
      }
      else{
        return next()
      }
    });
  },

  isUser(req, res, next){
    if(!req.cookies.email){
      res.send("You don't have the privilage.");
    }
    else{
      return next()
    }
  }

}
