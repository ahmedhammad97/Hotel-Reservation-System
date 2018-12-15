//Database module
const dbConnection = require(__dirname + '/../Database/connection');

module.exports = {

  getCustomerReservations(req, res){
    let sql = "SELECT * FROM Reservation WHERE c_email = ?";
    dbConnection.query(sql, req.body.email, (err, result)=>{
      if(err) {throw err; res.send("Failed to retrieve reservations");}
      else{
        res.send(JSON(result));
      }
    })
  },

  getHotelReservations(req, res){
    let sql = "SELECT * FROM Reservation WHERE Hname = ?";
    dbConnection.query(sql, req.body.name, (err, result)=>{
      if(err) {throw err; res.send("Failed to retrieve reservations");}
      else{
        res.send(JSON(result));
      }
    })
  },

  whoWillCheckIn(req, res){
    let sql = "SELECT * FROM Customer JOIN Reservation ON Customer.email = Reservation.c_email WHERE Hname = ? AND date_from = ?";
    dbConnection.query(sql, [req.body.name, req.body.date], (err, result)=>{
      if(err) {throw err; res.send("Failed to retrieve reservations");}
      else{
        res.send(JSON(result));
      }
    })
  },

  whoWillCheckOut(req, res){
    let sql = "SELECT * FROM Customer JOIN Reservation ON Customer.email = Reservation.c_email WHERE Hname = ? AND date_to = ?";
    dbConnection.query(sql, [req.body.name, req.body.date], (err, result)=>{
      if(err) {throw err; res.send("Failed to retrieve reservations");}
      else{
        res.send(JSON(result));
      }
    })
  }


}
