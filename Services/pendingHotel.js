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
    //Keep the data for second insertions
    let sql = "SELECT * FROM pendingHotel WHERE name = ?";
    dbConnection.query(sql, req.body.name, (err1, res1)=>{
      if(err1) {throw err; res.send("Failed to delete from pending");}
      else{
        //Remove from pending,
        sql = "DELETE FROM pendingHotel WHERE name = ?";
        dbConnection.query(sql, req.body.name, (err2, res2)=>{
          if(err) {throw err; res.send("Failed to delete from pending");}
          else{
            //Add To Hotel
            req.body.stars = res1[0].stars;
            req.body.premium = res1[0].premium;
            req.body.O_email = res1[0].O_email;
            req.body.pool = res1[0].pool;
            req.body.gym = res1[0].gym;
            req.body.bar = res1[0].bar;
            req.body.country = res1[0].country;
            req.body.city = res1[0].city;
            req.body.district = res1[0].district;
            creations.createHotel(req, res);
          }
        })
      }
    })
  }

}
