//imported modules
const dbconnection = require(__dirname + '/../Database/connection');
const creations = require(__dirname + '/creations');

module.exports = {

  createPendingHotel(req, res){
    let sql = "INSERT INTO pendingHotel (name, stars, premium, O_email, pool, gym, bar, city, country, district) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    //Create pending hotel
    dbConnection.query(sql, [
      req.body.name, req.body.stars, req.body.premium, req.body.O_email,
      req.body.pool, req.body.gym, req.body.bar,
      req.body.city, req.body.country, req.body.district
    ], (err, res)=>{
      if(err){
        throw err;
        res.send({"message": "Hotel creation failed"});
      }
      else{
        res.send({"message" : "Created successfully"});
      }
    })
  },

  approveHotel(req, res){
    //Remove from pending,
    let sql = "DELETE FROM pendingHotel WHERE name = ?";
    dbConnection.query(sql, req.body.name, (err, res)=>{
      if(err) {throw err; res.send("Failed to delete from pending");}
      else{
        //Add To Hotel
        creations.createHotel(req, res);
      }
    })
  }

}
