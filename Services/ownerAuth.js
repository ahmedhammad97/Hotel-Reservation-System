//Dependencies
const dbconnection = require(__dirname + '/../Database/connection');
const bcrypt = require('bcrypt');

module.exports = {

  login(req, res){
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

  register(req, res){
    let password = bcrypt.hashSync(req.body.password, 7);
    let sql = `INSERT INTO HotelOwner (email, name, password) VALUES (?, ?, ?)`;

    //Query
    dbConnection.query(sql, [req.body.email, req.body.name, password], (err, result)=>{
      if(err){
          throw err;
          res.send({"message" : "Owner already exists"});
      }
      else{ //Valid regiseration
        //Admin must approve!
        res.redner('ownerView', {"name" : req.body.name});
      }
    })
  }

}
