//Database module
const dbConnection = require(__dirname + '/../Database/connection');

module.exports = {

  createPendingHotel(req, res){
    let sql = "INSERT INTO PendingHotel (name, stars, premium, O_email, pool, gym, bar, city, country, district) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    //Create pending hotel
    dbConnection.query(sql, [
      req.body.name, req.body.stars, req.body.premium, req.body.O_email,
      req.body.pool, req.body.gym, req.body.bar,
      req.body.city, req.body.country, req.body.district
    ], (err, result)=>{
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
    let sql = "SELECT * FROM PendingHotel WHERE name = ?";
    dbConnection.query(sql, req.body.name, (err1, res1)=>{
      if(err1) {throw err1; res1.send("Failed to delete from pending");}
      else{
        //Remove from pending,
        sql = "DELETE FROM PendingHotel WHERE name = ?";
        dbConnection.query(sql, req.body.name, (err2, res2)=>{
          if(err2) {throw err2; res2.send("Failed to delete from pending");}
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
            createHotel(req, res);
          }
        })
      }
    })
  },

  rejectHotel(req, res){
    //Remove from pending,
    sql = "DELETE FROM PendingHotel WHERE name = ?";
    dbConnection.query(sql, req.body.name, (err, result)=>{
      if(err) {throw err; res.send("Failed to delete from pending");}
      else{
        res.send({"message": "deleted successfully from pending hotels"});
      }
    })
  },

  createRoom(req, res){
    let sql = "INSERT INTO HotelRoom (roomNo, Hname, type, price) VALUES (?, ?, ?, ?)";

    //Create room
    dbConnection.query(sql, [req.body.number, req.body.hotelName, req.body.type, req.body.price], (err1, result1)=>{
      if(err1){
        throw err1;
        res.send({"message": "Creation failed"});
      }
      else{
        sql = "INSERT INTO R_Facilites (roomNo, Hname, room_view, wifi, bar) VALUES (?, ?, ?, ?, ?)";

        //Create room facilities
        dbConnection.query(sql, [req.body.number, req.body.hotelName, req.body.view, req.body.wifi, req.body.bar], (err2, result2)=>{
          if(err2){
            throw err2;
            sql = "DELETE FROM HotelRoom WHERE roomNo = ? AND Hname = ?";
            dbConnection.query(sql, [req.body.number, req.body.hotelName]);
            res.send({"message": "Creation failed"});
          }
          else{
            res.send({"message" : "Hotel room added successfully"});
          }
        })
      }
    })

  }


}

//Helper functions
function createHotel(req, res){
  let sql = "INSERT INTO Hotel (name, stars, premium, O_email) VALUES(?, ?, ?, ?)";

  //Create hotel
  dbConnection.query(sql, [req.body.name, req.body.stars, req.body.premium, req.body.O_email], (err, result1)=>{
    if(err){
      throw err;
      res.send({"message": "Hotel creation failed"});
    }
    else{
      sql = "INSERT INTO H_Facilites (Hname, pool, gym, bar) VALUES (?, ?, ?, ?)";

      //Create hotel facilities
      dbConnection.query(sql, [req.body.name, req.body.pool, req.body.gym, req.body.bar], (err, result2)=>{
        if(err){
          throw err;
          sql = "DELETE FROM Hotel WHERE name = ?";
          dbConnection.query(sql, req.body.name);
          res.send({"message": "Hotel creation failed"});
        }
        else{
          sql = "INSERT INTO Location (Hname, country, city, district) VALUES (?, ?, ?, ?)";

          //Create hotel location
          dbConnection.query(sql, [req.body.name, req.body.country, req.body.city, req.body.district], (err, result)=>{
            if(err){
              throw err;
              sql = "DELETE FROM Hotel WHERE name = ?";
              dbConnection.query(sql, req.body.name);
              sql = "DELETE FROM H_Facilites WHERE Hname = ?";
              dbConnection.query(sql, req.body.hotelName);
              res.send({"message": "Hotel creation failed"});
            }
            else{
              res.send({"message" : "Hotel added successfully"});
            }
          })
        }
      })
    }
  })
}
