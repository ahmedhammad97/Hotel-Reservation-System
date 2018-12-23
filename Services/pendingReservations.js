const dbConnection = require(__dirname + '/../Database/connection');
const timer = require(__dirname + '/../Timer/serverTimer');
const moment = require('moment');

//Assuming only one reservation is being held
var waiting = [];

module.exports = {

  createReservation(req, res){
    res.send({"message": "Sent. Should be approved within 30 seconds"})
    var counter = setTimeout(()=>{
      actualCreation(req.body);
    },30000)
    waiting.push({"counter": counter, "data": req.body});
  },

  approve(req, res){
    clearTimeout(waiting[0].counter)
    actualCreation(waiting[0].data)
    waiting.shift();
    res.send({"message" : "Approved successfully"})
  },

  reject(req, res){
    clearTimeout(waiting[0].counter);
    waiting.shift();
    res.send({"message" : "Rejected successfully"})
  },

  getPendingReservations(req, res){
    let result = [];
    for(let i=0; i<waiting.length; i++){
      result.push(waiting[i].data)
    }
    res.render("owner/pendingReservations", {"date": timer.getTimeNow(), "data": result})
  }


}

//Helper functions
function actualCreation(data){
  let sql = "INSERT INTO Reservation (Hname, roomNo, c_email, date_to, date_from) VALUES(?, ?, ?, ?, ?)";
  try {
    dbConnection.query(sql, [data.name, data.room, data.email, moment(data.to, "DD/MM/YYYY").format("YYYY-MM-DD"), moment(data.from, "DD/MM/YYYY").format("YYYY-MM-DD")], (err, result)=>{
      if(err) throw err;
      else{
        console.log("Created successfully");
      }
    })
  } catch (e) {
    console.log("Duplicated Slot .. Cannot book");
  }
}
