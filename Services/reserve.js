var dbconnection = require(__dirname + '/../Database/connection');
const TOTAL_MILLISECONDS_IN_A_WEEK = 1000 * 60 * 24 * 7;
var timeOutForHotelconfirm;
var c_email, date_from, date_to, H_name, room_no;
module.exports = {
    reserve(req, res) {
        console.log(req.body);
        c_email = req.session.email,
            date_from = req.body.date_from,
            date_to = req.body.date_to,
            H_name = req.body.Hname.trim(),
            room_no = req.body.roomNo.trim();
        console.log(`email: ${c_email} hName = ${H_name}`);
        //Phase 1: Blacklist checking...
        let sql = `SELECT "blackListed" FROM CUSTOMER WHERE email = '${c_email}'`;

        dbconnection.query(sql, (err, rows) => {
            if (err) throw err;

            // If no user exists with this Email 
            if (rows.lenght < 1) {
                return res.send("No user with such Email");
            }
            // Phase 1: If the user is Blacklisted (the rows is only one row with value 1)
            if (rows[0].blackListed == 1) {

                // Phase 2: Check  if the block period has ended.-
                // Get the Last reservation (DATE_FROM) from the DB and check if it has been 1 week since then or not
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

                    res.write(result);

                });


            }
            // Phase 3: Reserve the room for the User and inserd it into the Database
            // The reservation shall be done unless the Hotel cancels/approves it within 30 seconds...
            // res.write("Waiting for the Hotel to approve");
            console.log("Waiting for the Hotel to approve");

            timeOutForHotelconfirm = setTimeout(() => {
                let sql_reserve = `INSERT INTO reservation  VALUES
                                                ('${H_name}','${room_no}','${c_email}','${date_to}','${date_from}',0) `;

                dbconnection.query(sql_reserve, (err, result) => {
                    if (err) throw err;
                    console.log("TimeOut: reservation is done without the approval of the HOTEL!");
                    return res.send("TimeOut: reservation is done without the approval of the HOTEL!");
                });


            }, 30000);



        });

    },
    // Case 1: The reservation has been rejected by the Hotel within 30 seconds.
    rejectReservation(req, res) {
        clearTimeout(timeOutForHotelconfirm);
        return res.send(`Reservation is rejected by the Hotel`);
    },
    // Case 2: the Hotel has approved the reservation within 30 seconds.
    approveReservation(req, res) {
        clearTimeout(timeOutForHotelconfirm);
        let sql_reserve = `INSERT INTO reservation  VALUES
                                                ('${H_name}','${room_no}','${c_email}','${date_to}','${date_from}',0) `;

        dbconnection.query(sql_reserve, (err, result) => {
            if (err) throw err;
            console.log("Time out canceled, Reservation is Done");
            return res.send("reservation is done!");
        });
    }
}