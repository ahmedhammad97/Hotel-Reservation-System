//Dependencies
const dbconnection = require(__dirname + '/../Database/connection');
const timer = require(__dirname + '/../Timer/serverTimer');
const moment = require('moment')

module.exports = {

    getResults(req, res) {
        let Hname = req.body.Hname,
            minPrice = req.body.minPrice,
            maxPrice = req.body.maxPrice,
            rating = req.body.rating,
            country = req.body.country,
            city = req.body.city,
            date_from = req.body.fromDate,
            date_to = req.body.toDate,
            stars = req.body.stars,
            type = req.body.type;

            let AndBool = false;

        let sql = ` SELECT Hotel.name, Hotel.stars, Hotel.rating, Location.country, Location.city,
                    HotelRoom.roomNo, HotelRoom.type, HotelRoom.price
                    FROM HotelRoom INNER JOIN Hotel ON Hotel.name = HotelRoom.Hname
                    INNER JOIN Location on Location.Hname = HotelRoom.Hname
                    LEFT JOIN Reservation ON
                    (Hotel.name = Reservation.Hname AND HotelRoom.roomNo = Reservation.roomNo) `;


                    if(Hname !== ""){
                      if(AndBool){sql += " AND ";}
                      else{AndBool=true; sql+= " WHERE Hotel.suspend = false AND  "}
                      sql += `Hotel.name = "${Hname}"`
                    }
                    if(rating !== ""){
                      if(AndBool){sql += " AND ";}
                      else{AndBool=true; sql+= " WHERE Hotel.suspend = false AND  "}
                      sql += `Hotel.rating >= ${rating}`
                    }
                    if(stars !== ""){
                      if(AndBool){sql += " AND ";}
                      else{AndBool=true; sql+= " WHERE Hotel.suspend = false AND  "}
                      sql += `Hotel.stars = ${stars}`
                    }
                    if(type !== ""){
                      if(AndBool){sql += " AND ";}
                      else{AndBool=true; sql+= " WHERE Hotel.suspend = false AND  "}
                      sql += `HotelRoom.type = "${type}"`
                    }
                    if(country !== ""){
                      if(AndBool){sql += " AND ";}
                      else{AndBool=true; sql+= " WHERE Hotel.suspend = false AND  "}
                      sql += `Location.country = "${country}"`
                    }
                    if(city !== ""){
                      if(AndBool){sql += " AND ";}
                      else{AndBool=true; sql+= " WHERE Hotel.suspend = false AND  "}
                      sql += `Location.city = "${city}"`
                    }
                    if(minPrice !== ""){
                      if(AndBool){sql += " AND ";}
                      else{AndBool=true; sql+= " WHERE Hotel.suspend = false AND  "}
                      sql += `HotelRoom.price >= ${minPrice}`
                    }
                    if(maxPrice !== ""){
                      if(AndBool){sql += " AND ";}
                      else{AndBool=true; sql+= " WHERE Hotel.suspend = false AND  "}
                      sql += `HotelRoom.price <= ${maxPrice}`
                    }
                    if(date_from !== ""){
                      if(AndBool){sql += " AND ";}
                      else{AndBool=true; sql+= " WHERE Hotel.suspend = false AND  "}
                      sql += `Reservation.date_from < "${date_from}" AND Reservation.date_to > "${date_from}"`
                    }
                    if(date_to !== ""){
                      if(AndBool){sql += " AND ";}
                      else{AndBool=true; sql+= " WHERE Hotel.suspend = false AND  "}
                      sql += `"${date_to}" > Reservation.date_from AND "${date_to}" < Reservation.date_to`
                    }

                    sql+= " ORDER BY Hotel.premium DESC";


        dbconnection.query(sql, (err, result) => {
            if (err) throw err;
            res.render("customer/searchResults", { "date": timer.getTimeNow(), "data": result });
            res.end()
        });

    }
}
