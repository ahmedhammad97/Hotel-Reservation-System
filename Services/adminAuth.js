//Dependencies
const bcrypt = require('bcrypt');
const keys = require(__dirname + '/keys/admin');

module.exports = {

  login(req, res){
    let username = bcrypt.hashSync(req.body.usename, 5);
    let password = bcrypt.hashSync(req.body.password, 5);

    bcrypt.compare(username, keys.username, (err1, rep1)=>{
      if(err1){throw err;}
      if(re1){
        bcrypt.compare(password, keys.password, (err2, rep2)=>{
          if(err2) throw err;
          if(rep2){
            res.render("brokerView");
          }
          else{ res.send("message", "Wrong password");}
        })
      }
      else{res.send("message", "Wrong username");}
    })
  }

}
