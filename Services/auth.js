//Dependencies
const dbConnection = require(__dirname + '/../Database/connection');
const bcrypt = require('bcrypt');
const session = require('cookie-session');
const keys = require(__dirname + '/keys/admin');
const timer = require(__dirname + '/../Timer/serverTimer');
const bcryptKey = require(__dirname + '/keys/bcrypt');
var cookieParser = require('cookie-parser');

var sess;
module.exports = {

    adminLogin(req, res) {
        bcrypt.compare(req.body.username, keys.username, (err1, rep1) => {
            if (err1) {
                throw err;
            }
            if (rep1) {
                bcrypt.compare(req.body.password, keys.password, (err2, rep2) => {
                    if (err2) throw err;
                    if (rep2) {
                        res.render('brokerView', { "date": timer.getTimeNow(), "email":req.body.username });
                    } else {
                        res.send({
                            "message": "Wrong password"
                        });
                    }
                })
            } else {
                res.send({
                    "message": "Wrong username"
                });
            }
        })

    },

    customerLogin(req, res) {

        reqEmail = req.body.email;
        reqPassword = req.body.password;

        //Query
        let sql = "SELECT name, password FROM Customer WHERE email = ?";
        dbConnection.query(sql, reqEmail, (err, result) => {
            if (err) throw err;

            //Check if any results returned
            if (result.length != 0) {

                //Verify password
                bcrypt.compare(reqPassword, result[0].password, (err, rep) => {
                    if (rep) {
                        //Store user login info in cookies
                        let sess = req.session;
                        sess.email = req.body.email;
                        sess.password = req.body.password;
                        sess.resave = true;
                        console.log(`logged in`);
                        let redirect = req.session.redirectTo || '/';
                        delete req.session.redirectTo;
                        res.redirect('/');
                    } else {
                        res.send({
                            "message": "Wrong password"
                        });
                    }
                });
            } else { //No matched email
                res.send({
                    "message": "No such a user"
                });
            }


        });
    },

    customerRegister(req, res) {
        let password = bcrypt.hashSync(req.body.password, 7);
        let sql = `INSERT INTO Customer (email, name, password) VALUES (?, ?, ?)`;

        //Query
        dbConnection.query(sql, [req.body.email, req.body.name, password], (err, result) => {
            if (err) {
                throw err;
                res.send({
                    "message": "User already exists"
                });
            } else { //Valid regiseration
                res.send(`Thank you, Fuck off`);
                //  res.render('customerView', {"name" : req.body.name}); not done yet the Customer view
            }
        })
    },

    ownerLogin(req, res) {
        let reqEmail = req.body.email;
        //Query
        let sql = "SELECT name, password FROM HotelOwner WHERE email = ?";
        dbConnection.query(sql, reqEmail, (err, result) => {
            if (err) throw err;

            //Check if any results returned
            if (result.length != 0) {

                //Verify password
                bcrypt.compare(req.body.password, result[0].password, (err, rep) => {
                    if (rep) {
                      let sql = "SELECT name FROM Hotel WHERE O_email = ?";
                      dbConnection.query(sql, reqEmail, (err, result)=>{
                        if(err){throw err; res.send("Error occured");}
                        else{
                            res.render("ownerView", {"date": timer.getTimeNow(), "hotels":result, "email":reqEmail})
                        }
                      })
                    } else {
                        res.send({
                            "message": "Wrong password"
                        });
                    }
                })

            } else { //No matched email
                res.send({
                    "message": "No such hotel owner"
                });
            }
        })
    },

    ownerRegister(req, res) {
        bcrypt.hash(req.body.password, bcryptKey.salt, (error, hash) => {
            if (error) throw error;

            let sql = `INSERT INTO HotelOwner (email, name, password) VALUES (?, ?, ?)`;

            //Query
            dbConnection.query(sql, [req.body.email, req.body.name, hash], (err, result) => {
                if (err) {
                    throw err;
                    res.send({
                        "message": "Owner already exists"
                    });
                } else { //Valid regiseration

                  let sql = "SELECT name FROM Hotel WHERE O_email = ?";
                  dbConnection.query(sql, req.body.email, (err, result)=>{
                    if(err){throw err; res.send("Error occured");}
                    else{
                        res.render("ownerView", {"date": timer.getTimeNow(), "hotels":result, "email":req.body.email})
                    }
                  })
                }
            })
        });
    }

}
