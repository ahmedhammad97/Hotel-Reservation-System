//Dependencies
const dbconnection = require(__dirname + '/../Database/connection');
const bcrypt = require('bcrypt');

module.exports = {

  login(req, res){
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

  register(req, res){
    let password = bcrypt.hashSync(req.body.password, 7);
    let sql = `INSERT INTO Customer (email, name, password) VALUES (?, ?, ?)`;

    //Query
    dbConnection.query(sql, [req.body.email, req.body.name, password], (err, result)=>{
      if(err){
          throw err;
          res.send({"message" : "User already exists"});
      }
      else{ //Valid regiseration
        res.redner('customerView', {"name" : req.body.name});
      }
    })
  }

}
