//Database module
const dbConnection = require(__dirname + '/../Database/connection');
const timer = require(__dirname + '/../Timer/serverTimer');
const moment = require('moment');

module.exports = {

  getCustomerReservations(req, res){
    let sql = "SELECT * FROM Reservation WHERE c_email = ?";
    dbConnection.query(sql, req.cookies.email, (err, result)=>{
      if(err) {throw err; res.send("Failed to retrieve reservations");}
      else{
        res.render('customer/customerReservations', {"date": timer.getTimeNow(), "data": result})
      }
    })
  },

  getHotelReservations(req, res){
    let sql = "SELECT * FROM Reservation WHERE Hname = ? AND date_from >= ? AND date_to <= ?";
    dbConnection.query(sql, [req.body.name, req.body.fromDate, req.body.toDate], (err, result)=>{
      if(err) {throw err; res.send("Failed to retrieve reservations");}
      else{
        res.render('owner/reservations', {"date": timer.getTimeNow(), "data": result})
      }
    })
  },

  whoWillCheckInOut(req, res){
    let sql = "SELECT Customer.email FROM Customer JOIN Reservation ON Customer.email = Reservation.c_email WHERE Hname = ? AND date_from = ?";
    dbConnection.query(sql, [req.body.name, req.body.date], (err1, result1)=>{
      if(err1) {throw err1; res.send("Failed to retrieve reservations");}
      else{
        sql = "SELECT Customer.email FROM Customer JOIN Reservation ON Customer.email = Reservation.c_email WHERE Hname = ? AND date_to = ?";
        dbConnection.query(sql, [req.body.name, req.body.date], (err2, result2)=>{
          if(err2){throw err2; res.send("Failed to retrieve reservations");}
          else{
            res.render("owner/checkInOut", {"date": timer.getTimeNow(), "inn": result1, "out": result2});
          }
        })
      }
    })
  },

  getPending(req, res){
    let sql = "SELECT * FROM PendingHotel";
    dbConnection.query(sql, (err, result)=>{
      if(err) throw err;
      if(result.length>0){
        res.render('broker/pendingHotels', {"date": timer.getTimeNow(), "data": result})
      }
      else{res.send("No pending requests for now.")}
    })
  },

  getReport(req, res){
    let sql = `SELECT Reservation.Hname as Hname,
    SUM(HotelRoom.price * 0.09 * TIMESTAMPDIFF(DAY, Reservation.date_from, Reservation.date_to) +1) as price
    FROM Reservation LEFT JOIN HotelRoom ON (Reservation.Hname = HotelRoom.Hname AND
    Reservation.roomNo = HotelRoom.roomNo)
    WHERE Reservation.did_show = ? AND Reservation.date_from > ? AND Reservation.date_to < ?
    GROUP BY Hname`;

    let monthAgo = moment(timer.getTimeNow(), "DD/MM/YYYY, h:mm:ss a").subtract(1, "months").format("YYYY/MM/DD");
    let now = moment(timer.getTimeNow(), "DD/MM/YYYY, h:mm:ss a").format("YYYY/MM/DD");

    dbConnection.query(sql, [true, monthAgo, now], (err, result)=>{
      if(err) throw err;
      if(result.length>0){
        res.render('broker/report', {"date": timer.getTimeNow(), "data": result})
      }
      else{res.send("No transaction for this month.")}

    })
  },

  getHotelsbyOwner(req, res){
    let ownerEmail = req.cookies.email;
    let sql = "SELECT name FROM Hotel WHERE O_email = ?";
    dbConnection.query(sql, ownerEmail, (err, result)=>{
      if(err){throw err; res.send("Error occured");}
      else{
        if(result.length>0){
          res.render("owner/createRoom", {"date": timer.getTimeNow(), "hotels":result})
        }
        else{res.send("You don't have any approved Hotels yet.")}
      }
    })
  }


}
