//Dependencies
const timer = require(__dirname + '/../Timer/serverTimer');
const express = require('express');
const router = require('express').Router();
const bodyParser = require('body-parser');
const creation = require(__dirname + '/../Services/creations');
const auth = require(__dirname + '/../Services/auth');
const update = require(__dirname + '/../Services/updates');
const searchService = require(__dirname + '/../Services/searchResult');
const reserve = require(__dirname + '/../Services/reserve');
const session = require('cookie-session');

//BodyParser
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(session ({
  secret: 'secretkeyForSecuirty',
  name: "login_cookies",
  cookie: {
    secure : true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    
  }
  
}));

router.get('/', (req, res)=>{
  res.render('index');
  
});


router.post('/create', jsonParser, creation.createRoom);
router.post('/approve', jsonParser, creation.approveHotel);
router.post('/reject', jsonParser, creation.rejectHotel);
router.get('/search',jsonParser,searchService.getResults);
router.post('/rate', jsonParser, update.rateHotel);
router.post('/reserve', jsonParser, reserve.reserve);
router.post('/hotelapprove', jsonParser, reserve.approveReservation);
router.post('/hotelreject', jsonParser, reserve.rejectReservation);
router.post('/register', jsonParser, auth.customerRegister);
router.post('/login', jsonParser, auth.customerLogin);

module.exports = router;
