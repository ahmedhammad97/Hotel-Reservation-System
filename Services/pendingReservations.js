const dbConnection = require(__dirname + '/../Database/connection');
const timer = require(__dirname + '/../Timer/serverTimer');

var waiting = []

module.exports = {

  createReservation(req, res){
    var counter = setTimeout(()=>{
      actualCreation(req.body);
    },30000)
    waiting.push({"counter": counter, "data": req.body});
  },

  approve(req, res){
    let i = searchForObject(req.body)
    if(i){
      clearTimeout(waiting[i].counter)
      actualCreation(req.body)
    }
  },

  reject(req, res){
    let i = searchForObject(req.body)
    if(i){
      clearTimeout(waiting[i].counter)
    }
  },

  getPendingReservations(req, res){
    let result = [];
    for(let i=0; i<waiting.length; i++){
      result.push(waiting[i].data);
    }
    res.render("owner/pendingReservations", {"date": timer.getTimeNow(), "data":result})
  }


}

//Helper functions
function actualCreation(data){
  let sql = "INSERT INTO Reservation (Hname, roomNo, c_email, date_to, date_from) VALUES(?, ?, ?, ?, ?)";
  dbConnection.query(sql, [data.Hname, data.number, data.email, data.toDate, data.fromDate], (err, result)=>{
    if(err) throw err;
    else{
      console.log("Created successfully");
    }
  })
}

function searchForObject(obj){
  for(let i=0; i<waiting.length; i++){
    if(JSON.stringify(waiting[i].data) === JSON.stringify(obj)){return i;}
    console.log("Cannot found");
    return null;
  }
}
