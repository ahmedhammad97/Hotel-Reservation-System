const keys = require(__dirname + '/keys/admin');
const bcrypt = require('bcrypt')
const dbConnection = require(__dirname + '/../Database/connection');

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

  isOwner(req, res, next){
    if(!req.cookies.email){
      res.send("You don't have the privilage.");
    }
    else{
      let sql = "Select * FROM HotelOwner WHERE email = ?";
      dbConnection.query(sql, req.cookies.email, (err, result)=>{
        if(err) throw err;
        else{
          if(result.length === 0){
            res.send("You don't have the privilage.");
          }
          else{
            return next()
          }
        }
      })
    }
  },

  isCustomer(req, res, next){
    if(!req.cookies.email){
      res.send("You don't have the privilage.");
    }
    else{
      let sql = "Select * FROM Customer WHERE email = ?";
      dbConnection.query(sql, req.cookies.email, (err, result)=>{
        if(err) throw err;
        else{
          if(result.length === 0){
            res.send("You don't have the privilage.");
          }
          else{
            return next()
          }
        }
      })
    }
  }

}
