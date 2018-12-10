//Database module
const dbconnection = require(__dirname + '/../Database/connection');

module.exports = {

  createHotel(req, res){
    let sql = "INSERT INTO Hotel (name, stars, premium, O_email) VALUES(?, ?, ?, ?)";

    //Create hotel
    dbConnection.query(sql, [req.body.name, req.body.stars, req.body.premium, req.body.O_email], (err, res)=>{
      if(err){
        throw err;
        res.send({"message": "Hotel creation failed"});
      }
      else{
        sql = "INSERT INTO H_Facilites (Hname, pool, gym, bar) VALUES (?, ?, ?, ?)";

        //Create hotel facilities
        dbConnection.query(sql, [req.body.name, req.body.pool, req.body.gym, req.body.bar], (err, res)=>{
          if(err){
            throw err;
            sql = "DELETE FROM Hotel WHERE name = ?";
            dbConnection.query(sql, req.body.name);
            res.send({"message": "Hotel creation failed"});
          }
          else{
            sql = "INSERT INTO Location (Hname, country, city, district) VALUES (?, ?, ?, ?)";

            //Create hotel location
            dbConnection.query(sql, [req.body.name, req.body.country, req.body.city, req.body.district], (err, res)=>{
              if(err){
                throw err;
                sql = "DELETE FROM Hotel WHERE name = ?";
                dbConnection.query(sql, req.body.name);
                sql = "DELETE FROM H_Facilites WHERE Hname = ?";
                dbConnection.query(sql, req.body.hotelName);
                res.send({"message": "Hotel creation failed"});
              }
              else{
                res.send({"message" : "Hotel added successfully"});
              }
            })
          }
        })
      }
    })
  },

  createRoom(req, res){
    let sql = "INSERT INTO HotelRoom (roomNo, Hname, type, rooms_count, price) VALUES (?, ?, ?, ?, ?)";

    //Create room
    dbConnection.query(sql, [req.body.number, req.body.hotelName, req.body.type, req.body.count, req.body.price], (err, res)=>{
      if(err){
        throw err;
        res.send({"message": "Creation failed"});
      }
      else{
        sql = "INSERT INTO R_Facilites (roomNo, Hname, room_view, wifi, bar) VALUES (?, ?, ?, ?, ?)";

        //Create room facilities
        dbConnection.query(sql, [req.body.number, req.body.hotelName, req.body.view, req.body.wifi, req.body.bar], (err, res)=>{
          if(err){
            throw err;
            sql = "DELETE FROM HotelRoom WHERE roomNo = ? AND Hname = ?";
            dbConnection.query(sql, [req.body.number, req.body.hotelName]);
            res.send({"message": "Creation failed"});
          }
          else{
            res.send({"message" : "Hotel added successfully"});
          }
        })
      }
    })

  }


}
