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
  res.render('index', {"date": timer.getTimeNow()});
});

router.get('/login', (req, res)=>{
  res.render('login', {"date": timer.getTimeNow()})
})

router.get('/signup', (req, res)=>{
  res.render('signup', {"date": timer.getTimeNow()})
})

router.get('/backdoor', (req, res)=>{
  res.render('backdoor', {"date": timer.getTimeNow()})
})

router.post('/backdoor', urlencodedParser, auth.adminLogin)

router.get('/fakeTime', (req, res)=>{
  res.render('time', {"date": timer.getTimeNow()})
})

router.post('/fakeTime', urlencodedParser, (req, res)=>{
  if(req.body.btn == "Fake to this time"){
    timer.fakeDate(req.body.date)
    res.send("Time faked successfully ;)");
  }
  else if(req.body.btn == "Reset to real time"){
    timer.resetDate();
    res.send("Time reseted successfully");
  }
  else{res.send("Error, Wrong choice")}
})

router.post('/login', urlencodedParser, (req, res)=>{
  if(req.body.type == "owner") auth.ownerLogin(req, res);
  else if(req.body.type == "customer") auth.customerLogin(req, res);
  else{res.send("Error! Wrong choice")}
})

router.post('/signup', urlencodedParser, (req, res)=>{
  if(req.body.type == "owner") auth.ownerRegister(req, res);
  else if(req.body.type == "customer") auth.customerRegister(req, res);
  else{res.send("Error! Wrong choice")}
})


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
