var dbconnection = require(__dirname + '/../Database/connection');
const TOTAL_MILLISECONDS_IN_A_WEEK = 1000 * 60 * 24 * 7;
var timeOutForHotelconfirm;

module.exports = {
    reserve(req, res) {

        let c_email = req.body.c_email,
            date_from = req.body.date_from,
            date_to = req.body.date_to,
            H_name = req.body.H_name,
            room_no = req.body.room_no;

        //Phase 1: Blacklist checking...
        let sql = `SELECT "blackListed" FROM CUSTOMER WHERE email = '${c_email}'`;

        dbconnection.query(sql, (err, rows) => {
            if (err) throw err;

            // If no user exists with this Email 
            if (rows.lenght < 1) {
                return res.send("No user with such Email");
            } else
                // Phase 1: If the user is Blacklisted (the rows is only one row with value 1)
                if (rows[0].blackListed == 1) {

                    // Phase 2: Check  if the block period has ended.-
                    let date_sql = `SELECT MAX(date_from) as "maxDate" from reservation WHERE c_email = "${c_email}" `;
                    dbconnection.query(date_sql, (err, result) => {
                        if (err) throw err;
                        let now = new Date() //Getting the current date
                            ,
                            block_date = new Date(result[0].maxDate) //Getting the TimeStamp of the Date when the user has been blocked
                            ,
                            diff = now - block_date; //Difference between the two dates
                        if (Math.floor(diff / TOTAL_MILLISECONDS_IN_A_WEEK) >= 7) { //if(diff >TOTAL_MILLISECONDS_IN_A_WEEK)

                            console.log("User blocking period has ended :D :D ");
                        } else {
                            return res.send("user is Blocked,Operation is denied, so Fuck OfF"); //The motherfucker is still blocked.
                        }

                        res.send(result);

                    });


                } else {
                    // Phase 3: Reserve the room for the User and inserd it into the Database
                    // The reservation shall be done unless the Hotel cancels/approves it within 30 seconds...
                    timeOutForHotelconfirm = setTimeout(() => {
                        let sql_reserve = `INSERT INTO reservation  VALUES
                                                ('${H_name}','${room_no}','${c_email}','${date_to}','${date_from}',0) `;

                        dbconnection.query(sql_reserve, (err, result) => {
                            if (err) throw err;
                            return res.send("TimeOut: reservation is done without the approval of the HOTEL!");
                        });


                    }, 30000);

                }

        });

    },
    // Case 1: The reservation has been rejected by the Hotel within 30 seconds.
    rejectReservation(req, res) {
        clearTimeout(timeOutForHotelconfirm);
        return req.send(`Reservation is rejected by the Hotel`);
    },
    // Case 2: the Hotel has approved the reservation within 30 seconds.
    approvereservation(req, res) {
        clearTimeout(timeOutForHotelconfirm);
        let sql_reserve = `INSERT INTO reservation  VALUES
                                                ('${H_name}','${room_no}','${c_email}','${date_to}','${date_from}',0) `;

        dbconnection.query(sql_reserve, (err, result) => {
            if (err) throw err;
            return res.send("reservation is done!");
        });
    }
}