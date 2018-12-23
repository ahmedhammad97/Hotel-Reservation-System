var dbconnection = require(__dirname + '/../Database/connection');
const timer = require(__dirname + '/../Timer/serverTimer');
const moment = require('moment')
const TOTAL_MILLISECONDS_IN_A_MONTH = 60*60*24*30;

module.exports = {
    reserve(req, res, next) {
            let c_email = req.body.email;
            let date_from = req.body.from;
            let date_to = req.body.to;
            let H_name = req.body.name;
            let room_no = req.body.room;

        //Phase 1: Blacklist checking...
        let sql = "SELECT blackListed FROM Customer WHERE email = ?";

        dbconnection.query(sql, c_email, (err, rows) => {
            if (err) throw err;

            // If no user exists with this Email
            if (rows.length < 1) {
                res.send({"message" : "Not authorised user .. Login first, please"});
            }
            else{
              // Phase 1: If the user is Blacklisted (the rows is only one row with value 1)
              if (rows[0].blackListed == 1) {

                  // Phase 2: Check  if the block period has ended.-
                  // Get the Last reservation (DATE_FROM) from the DB and check if it has been 1 week since then or not
                  let date_sql = `SELECT MAX(date_from) AS maxDate FROM Reservation WHERE c_email = "${c_email}" `;
                  dbconnection.query(date_sql, (err, result) => {
                      if (err) throw err;
                      let now = moment(timer.getTimeNow(), "DD/MM/YYYY, h:mm:ss a") //Getting the current date

                      let block_datePlusMonth = moment(result[0].maxDate).add(1, "Months") //Getting the TimeStamp of the Date when the user has been blocked

                      if (block_datePlusMonth.isBefore(now)) { //Duration has ended
                        sql = "UPDATE Customer SET blackListed = false WHERE email = ?";
                        dbconnection.query(sql, c_email, (err, result)=>{
                          if(err) throw err;
                          else{return next()}
                        })
                        //Do reservation
                      } else {
                          return res.send({"message": "You're still blocked"});
                      }

                  });
              }
              else{
                return next()
              }
            }
        });

    }
}
