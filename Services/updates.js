//Database module
const dbConnection = require(__dirname + '/../Database/connection');

module.exports = {

  rateHotel(req, res){
    // Fetch for the rating and rating count
    let sql = "SELECT rating, r_count from Hotel WHERE name = ?";
    dbConnection.query(sql, req.body.name, (err1, result1)=>{
      if(err1){throw err1; res.send({"message": "Failed to update"});}
      else{
        // Calculate new rating
        let rating = +(result1[0].rating);
        let ratingCount = +(result1[0].r_count);
        rating = (( rating * ratingCount ) + +(req.body.rating)) / (ratingCount+1);

        // Update the relation
        sql = "UPDATE Hotel SET rating = ? , r_count = ? WHERE name = ?";
        dbConnection.query(sql, [rating, ratingCount+1, req.body.name], (err2, result2)=>{
          if(err2){throw err2; res.send({"message": "Failed to update"});}
          else{res.send({"message": "Rated successfully"});}
        })
      }
    })
  },

  customerShow(req, res){
    let sql = "UPDATE Reservation SET did_show = ? WHERE Hname = ? AND roomNo = ? AND c_email = ?";
    dbConnection.query(sql, [true, req.body.name, req.body.room, req.body.email], (err, result)=>{
      if(err){throw err; res.send("Failed to update");}
      else{
        res.send({"message": "Customer updated successfully"});
      }
    })
  },

  suspendHotel(req, res){
    let sql = "UPDATE Hotel SET suspend = ? WHERE name = ?";
    dbConnection.query(sql, [true, req.body.name], (err, result)=>{
      if(err){throw err; res.send("Wrong query");}
      else{
        if(result.affectedRows > 0){res.send("Suspended successfully");}
        else{res.send("Wrong Hotel name");}
      }
    })
  },

  unsuspendHotel(req, res){
    let sql = "UPDATE Hotel SET suspend = ? WHERE name = ?";
    dbConnection.query(sql, [false, req.body.name], (err, result)=>{
      if(err){throw err; res.send("Wrong query");}
      else{
        if(result.affectedRows > 0){res.send("Unsuspended successfully");}
        else{res.send("Wrong Hotel name");}
      }
    })
  },

  blacklistCustomer(req, res){
    let sql = "UPDATE Customer SET blackListed = ? WHERE email = ?";
    dbConnection.query(sql, [true, req.body.email], (err, result)=>{
      if(err){throw err; res.send("Wrong query");}
      else{
        if(result.affectedRows > 0){res.send("Blacklisted successfully");}
        else{res.send("Wrong Customer name");}
      }
    })
  }

}
