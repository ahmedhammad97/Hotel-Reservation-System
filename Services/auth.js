//Dependencies
const dbConnection = require(__dirname + '/../Database/connection');
const bcrypt = require('bcrypt');
const keys = require(__dirname + '/keys/admin');
const bcryptKey = require(__dirname + '/keys/bcrypt');

module.exports = {

  adminLogin(req, res){
    bcrypt.compare(req.body.username, keys.username, (err1, rep1)=>{
      if(err1){throw err;}
      if(rep1){
        bcrypt.compare(req.body.password, keys.password, (err2, rep2)=>{
          if(err2) throw err;
          if(rep2){
            res.render("brokerView");
          }
          else{ res.send({"message": "Wrong password"});}
        })
      }
      else{res.send({"message": "Wrong username"});}
    })
  },

  customerLogin(req, res){
    let reqEmail = req.body.email;
    //Query
    let sql = "SELECT name, password FROM Customer WHERE email = ?";
    dbConnection.query(sql, reqEmail, (err, result)=>{
      if(err) throw err;

      //Check if any results returned
      if(result.length != 0){

        //Verify password
        bcrypt.compare(req.body.password, result[0].password, (err, rep)=>{
          if(rep){res.render('customerView', {"name" : result[0].name});}
          else{res.send({"message" : "Wrong password"});}
        })

      }
      else{ //No matched email
        res.send({"message" : "No such a user"});
      }
    })
  },

  customerRegister(req, res){
    let password = bcrypt.hashSync(req.body.password, 7);
    let sql = `INSERT INTO Customer (email, name, password) VALUES (?, ?, ?)`;

    //Query
    dbConnection.query(sql, [req.body.email, req.body.name, password], (err, result)=>{
      if(err){
          throw err;
          res.send({"message" : "User already exists"});
      }
      else{ //Valid regiseration
        res.render('customerView', {"name" : req.body.name});
      }
    })
  },

  ownerLogin(req, res){
    let reqEmail = req.body.email;
    //Query
    let sql = "SELECT name, password FROM HotelOwner WHERE email = ?";
    dbConnection.query(sql, reqEmail, (err, result)=>{
      if(err) throw err;

      //Check if any results returned
      if(result.length != 0){

        //Verify password
        bcrypt.compare(req.body.password, result[0].password, (err, rep)=>{
          if(rep){res.render('ownerView', {"name": result[0].name, "email": reqEmail});}
          else{res.send({"message" : "Wrong password"});}
        })

      }
      else{ //No matched email
        res.send({"message" : "No such hotel owner"});
      }
    })
  },

  ownerRegister(req, res){
    bcrypt.hash(req.body.password, bcryptKey.salt, (error, hash)=>{
      if(error) throw error;

      let sql = `INSERT INTO HotelOwner (email, name, password) VALUES (?, ?, ?)`;

      //Query
      dbConnection.query(sql, [req.body.email, req.body.name, hash], (err, result)=>{
        if(err){
            throw err;
            res.send({"message" : "Owner already exists"});
        }
        else{ //Valid regiseration

          res.render('ownerView', {"name": req.body.name, "email": req.body.email});
        }
      })
    });
  }

}
