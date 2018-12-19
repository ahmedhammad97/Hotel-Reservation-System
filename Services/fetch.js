//Database module
const dbConnection = require(__dirname + '/../Database/connection');
const timer = require(__dirname + '/../Timer/serverTimer');
const moment = require('moment');

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
  },

  getPending(req, res){
    let sql = "SELECT * FROM PendingHotel";
    dbConnection.query(sql, (err, result)=>{
      if(err) throw err;
      if(result.length>0){
        res.render('pending', {"date": timer.getTimeNow(), "data": result})
      }
      else{res.send("No pending requests for now.")}
    })
  },

  getReport(req, res){
    let sql = `SELECT Reservation.Hname as Hname, SUM(HotelRoom.price) as price
    FROM Reservation WHERE did_show = ? AND date_from > ?
    INNER JOIN HotelRoom ON Reservation.Hname = HotelRoom.Hname AND
    Reservation.roomNo = HotelRoom.roomNo`;

    let monthAgo = moment().subtract(1, "months").format("YYYY/MM/DD, HH:mm:ss");

    dbConnection.query(sql, [true, monthAgo], (err, result)=>{
      if(err) throw err;
      if(result.length>0){
        res.render('report', {"date": timer.getTimeNow(), "data": result})
      }
      else{res.send("No transaction for this month.")}

    })
  }


}
