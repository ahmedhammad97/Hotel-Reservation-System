const dbConnection = require(__dirname + '/../Database/connection');
const timer = require(__dirname + '/../Timer/serverTimer');

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
  dbConnection.query(sql, [data.name, data.room, data.email, new Date(data.to), new Date(data.from)], (err, result)=>{
    if(err) throw err;
    else{
      console.log("Created successfully");
    }
  })
}
