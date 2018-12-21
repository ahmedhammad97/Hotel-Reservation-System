//Dependencies
const timer = require(__dirname + '/../Timer/serverTimer');
const express = require('express');
const router = require('express').Router();
const bodyParser = require('body-parser');
const creation = require(__dirname + '/../Services/creations');
const auth = require(__dirname + '/../Services/auth');
const authMiddleware = require(__dirname + '/../Services/authMiddlewares');
const fetch = require(__dirname + '/../Services/fetch');
const pending = require(__dirname + '/../Services/pendingReservations')
const update = require(__dirname + '/../Services/updates');
const searchService = require(__dirname + '/../Services/searchResult');
const reserve = require(__dirname + '/../Services/reserve');

//BodyParser
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res) => {
    res.render('index', { "date": timer.getTimeNow() });
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

router.post('/suspendHotel', urlencodedParser, update.suspendHotel)

router.post('/unsuspendHotel', urlencodedParser, update.unsuspendHotel)

router.get('/report' , authMiddleware.isAdmin, fetch.getReport)

router.get('/pending', authMiddleware.isAdmin, fetch.getPending)

router.post('/approveHotel', urlencodedParser, creation.approveHotel);

router.post('/rejectHotel', urlencodedParser, creation.rejectHotel);

router.get('/createHotel', authMiddleware.isUser, (req, res) => {
    res.render('owner/createHotel', { "date": timer.getTimeNow() })
})

router.post('/createHotel', urlencodedParser, creation.createPendingHotel)

router.get('/createRoom', authMiddleware.isUser, fetch.getHotelsbyOwner)

router.post('/createRoom', urlencodedParser, creation.createRoom)

router.post('/checkInOut', urlencodedParser, fetch.whoWillCheckInOut)

router.post('/viewHReservations', urlencodedParser, fetch.getHotelReservations)

router.get('/checkReservations', authMiddleware.isUser, pending.getPendingReservations)

router.post('/checkin', update.customerShow)

router.post('/blacklist', update.blacklistCustomer)





router.post('/search', urlencodedParser, searchService.getResults);
router.post('/rate', jsonParser, update.rateHotel);
router.post('/reserve', urlencodedParser, reserve.reserve);

module.exports = router;
