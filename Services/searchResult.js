//Dependencies
const dbconnection = require(__dirname + '/../Database/connection');


module.exports = {

    getResults(req,res){
        let hotelName = req.body.hotelname,
            numberOfRooms = req.body.numberOfRooms,
            price = req.body.price,
            rate = req.body.rate,
            countryLocation = req.body.countryLocation,
            cityLocation = req.body.cityLocation,
            districtLocation = req.body.districtLocation,
            fromDate = req.body.fromDate,
            toDate = req.body.toDate,
            stars = req.body.stars,
            roomType = req.body.roomType;

        let sql=`SELECT * FROM hotelroom AS r WHERE r.count >0 `;


        if (countryLocation) {
            sql += `INNER JOIN location on location.country = ${countryLocation}  `;
        }
        if (cityLocation) {
            sql += `INNER JOIN location on location.city = ${cityLocation}  `;
        }
        if (districtLocation) {
            sql += `INNER JOIN location on location.district = ${districtLocation}  `;
        }
        if(fromDate){
            sql +=` INNER JOIN reservation on reservation.date_from <> ${fromDate} `
        }
        if (toDate) {
            sql += ` INNER JOIN reservation on reservation.date_to <> ${toDate} `
        }

        if(hotelName){
            sql +=` AND r.Hname = ${hotalName} `;
        }
        if (numberOfRooms) {
            sql += ` AND r.rooms_count = ${numberOfRooms} `;
        }
        if (price) {
            sql += ` AND r.rooms_count = ${price} `;
        }
        if(rate){
            sql+= `AND r.price = ${rate} `;
        }
        if (roomType) {
            sql += `AND r.roomType = ${roomType} `;
        }
        if (stars) {
            sql += `AND r.star = ${stars} `;
        }

        dbConnection.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send({"data" : result});
        });

    }
}
