//Dependencies
const timer = require(__dirname + '/../Timer/serverTimer');
const express = require('express');
const router = require('express').Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const creation = require(__dirname + '/../Services/creations');
const auth = require(__dirname + '/../Services/auth');
const fetch = require(__dirname + '/../Services/fetch');
const update = require(__dirname + '/../Services/updates');
const searchService = require(__dirname + '/../Services/searchResult');
const reserve = require(__dirname + '/../Services/reserve');
const session = require('cookie-session');

//router.use(multer);
//BodyParser
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(session({
    secret: 'secretkeyForSecuirty',
    name: "login_cookies",
    cookie: {
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
}));

router.get('/', (req, res) => {
    res.render('indexbs', { "date": timer.getTimeNow() });
});

router.get('/login', (req, res) => {
    res.render('login', { "date": timer.getTimeNow() })
})

router.get('/signup', (req, res) => {
    res.render('signup', { "date": timer.getTimeNow() })
})

router.get('/backdoor', (req, res) => {
    res.render('backdoor', { "date": timer.getTimeNow() })
})

router.post('/backdoor', urlencodedParser, auth.adminLogin)

router.get('/fakeTime', (req, res) => {
    res.render('time', { "date": timer.getTimeNow() })
})

router.post('/fakeTime', urlencodedParser, (req, res) => {
    if (req.body.btn == "Fake to this time") {
        timer.fakeDate(req.body.date)
        res.send("Time faked successfully ;)");
    } else if (req.body.btn == "Reset to real time") {
        timer.resetDate();
        res.send("Time reseted successfully");
    } else { res.send("Error, Wrong choice") }
})

router.post('/login', urlencodedParser, (req, res, next) => {
    if (req.body.type == "owner") auth.ownerLogin(req, res, next);
    else if (req.body.type == "customer") auth.customerLogin(req, res, next);
    else { res.send("Error! Wrong choice") }
})

router.post('/signup', urlencodedParser, (req, res) => {
    if (req.body.type == "owner") auth.ownerRegister(req, res);
    else if (req.body.type == "customer") auth.customerRegister(req, res);
    else { res.send("Error! Wrong choice") }
})

router.get('/brokerView', (req, res) => {
    res.render('brokerView', { "date": timer.getTimeNow() })
})

router.post('/suspendHotel', urlencodedParser, update.suspendHotel)

router.post('/unsuspendHotel', urlencodedParser, update.unsuspendHotel)

router.get('/report', fetch.getReport)

router.get('/pending', fetch.getPending)

router.post('/approveHotel', urlencodedParser, creation.approveHotel);

router.post('/rejectHotel', urlencodedParser, creation.rejectHotel);

router.post('/searchtry', urlencodedParser, (req, res) => {
    console.log(req.body);
})
router.post('/create', jsonParser, creation.createRoom);
router.post('/search', urlencodedParser, searchService.getResults);
router.post('/rate', jsonParser, update.rateHotel);
router.post('/reserve', urlencodedParser, isAuthenticated, reserve.reserve);
router.get('/hotelapprove', jsonParser, reserve.approveReservation);
router.post('/hotelreject', jsonParser, reserve.rejectReservation);

module.exports = router;

//Function to check if the user is logged in or not (Protection function)
function isAuthenticated(req, res, next) {
    console.log(req.body);
    let sess = req.session;
    if (sess.email) //IF THE USER IS LOGGED IN,
    {
        console.log(sess.email);
        return next();
    }

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM TO LOGIN PAGE

    console.log(req.originalUrl);
    res.redirect('/login', req, res);
}
