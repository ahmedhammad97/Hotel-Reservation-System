//Dependencies
var dbconnection = require(__dirname + '/../Database/connection');


module.exports = {

    getResults(req, res) {
        let Hname = req.body.Hname,
            price = req.body.price,
            rate = req.body.rate,
            country = req.body.country,
            city = req.body.city,
            district = req.body.district,
            date_from = req.body.dateFrom,
            date_to = req.body.dateTo,
            stars = req.body.stars,
            type = req.body.roomType,
            bar = req.body.bar,
            pool = req.body.pool,
            gym = req.body.gym;
        pool = bar = 0;
        gym = 1;
        console.log(`${req.body.Hname}`);
        if (price == "") price = 0;



        let sql = ` SELECT * FROM hotelroom 
                    INNER JOIN h_facilites on h_facilites.Hname = hotelroom.Hname
                    INNER JOIN location on location.Hname = hotelroom.Hname
                    
                    WHERE  1=1                                                             AND
                    ("${Hname}" ="" OR hotelroom.Hname = '${Hname}')                       AND
                    (${price} =0  OR hotelroom.price = ${price} )                         AND
                    ("${type}"="Room Type"  OR hotelroom.type = '${type}' )               AND
                  
                    (${bar} IS NULL   OR h_facilites.bar = ${bar} )                        AND
                    (${gym} IS NULL   OR h_facilites.gym = ${gym} )                        AND
                    (${pool} IS NULL   OR h_facilites.pool = ${pool})                      AND
                    ("${city}" =""   OR location.city = '${city}')                         AND
                    ("${country}"=""   OR location.country = '${country}')                 AND
                    ("${district}"=""   OR location.district = '${district}') 
                    
                    `;

        console.log(sql);
        console.log(date_from = "");



        dbconnection.query(sql, (err, result) => {
            if (err) throw err;
            console.log({ "data": result });
            console.log(result.length);
            res.render("searchResult", { "results": result });
        });

    }
}