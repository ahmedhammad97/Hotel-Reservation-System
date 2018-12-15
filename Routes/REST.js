//Dependencies
const timer = require(__dirname + '/../Timer/serverTimer');
const router = require('express').Router();
const bodyParser = require('body-parser');
const creation = require(__dirname + '/../Services/creations');
const auth = require(__dirname + '/../Services/auth');
const update = require(__dirname + '/../Services/updates');
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
router.post('/rate', jsonParser, update.rateHotel)

module.exports = router;
