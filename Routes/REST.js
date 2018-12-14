//Dependencies
const timer = require(__dirname + '/../Timer/serverTimer');
const router = require('express').Router();
const bodyParser = require('body-parser');
const creation = require(__dirname + '/../Services/creations');
const auth = require(__dirname + '/../Services/auth');
const searchService = require(__dirname + '/../Services/searchResult');

//BodyParser
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res)=>{
  res.render('index');
});

router.post('/create', jsonParser, creation.createRoom);
router.post('/approve', jsonParser, creation.approveHotel);
router.post('/reject', jsonParser, creation.rejectHotel);
router.post('/search',jsonParser,searchService.getResults);

router.post('/fakeTime', jsonParser, (req, res)=>{
  timer.fakeDate(req.body.time);
  res.end()
  //res.send("Time now: " + timer.getTimeNow())
})

router.post('/getTime', jsonParser, (req, res)=>{
  res.send("Time now: " + timer.getTimeNow())
})

module.exports = router;
