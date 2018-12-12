//Dependencies
var dbconnection = require(__dirname + '/../Database/connection');


module.exports = {

    getResults(req,res){
        let Hname = req.body.Hname ,
            price = req.body.price,
            rate = req.body.rate,
            country = req.body.country,
            city = req.body.city,
            district = req.body.district,
            date_from = req.body.date_from,
            date_to = req.body.date_to,
            stars = req.body.stars,
            type = req.body.type,
            bar = req.body.bar,
            pool = req.body.pool,
            gym = req.body.gym;

        console.log(`${req.body.Hname}`);
        let sql =  ` SELECT * FROM hotelroom 
                    INNER JOIN h_facilites on h_facilites.Hname = hotelroom.Hname
                    INNER JOIN location on location.Hname = hotelroom.Hname
                    INNER JOIN reservation on reservation.roomNo = hotelroom.roomNo
                    WHERE  1=1                                                                       AND
                    ("${Hname}" ="" OR hotelroom.Hname = '${Hname}')                             AND
                    ("${price}"=""  OR hotelroom.price = ${price} )                        AND
                    ("${type}"=""  OR hotelroom.type = '${type}' )                         AND
                    ("${date_from}"=""   OR reservation.date_to < '${date_from}' )         AND
                    ("${date_to}"=""   OR reservation.date_from > '${date_to}' )           AND
                    ("${bar}"=""   OR h_facilites.bar = ${bar} )                           AND
                    ("${gym}"=""   OR h_facilites.gym = ${gym} )                           AND
                    ("${pool}"=""   OR h_facilites.pool = ${pool})                         AND
                    ("${city}"=""   OR location.city = '${city}')                          AND
                    ("${country}"=""   OR location.country = '${country}')                 AND
                    ("${district}"=""   OR location.district = '${district}') 
                    
                    `;

                    console.log(sql);


        /*
        if (countryLocation) {
            sql += `INNER JOIN location on location.country = '${countryLocation} '  `;
        }
        if (cityLocation) {
            sql += `INNER JOIN location on location.city = '${cityLocation}'  `;
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
        */

        

        dbconnection.query(sql, (err, result) => {
            if(err) throw err;
            console.log({"data" : result});
            res.send({"data" : result});
        });

    }
}
