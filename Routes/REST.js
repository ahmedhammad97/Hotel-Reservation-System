//Dependencies
const timer = require(__dirname + '/../Timer/serverTimer');
const router = require('express').Router();
const bodyParser = require('body-parser');
const creation = require(__dirname + '/../Services/creations');
const auth = require(__dirname + '/../Services/auth');
const update = require(__dirname + '/../Services/updates');
const searchService = require(__dirname + '/../Services/searchResult');
const reserve = require(__dirname + '/../Services/reserve');

//BodyParser
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res)=>{
  res.render('index');
});

router.post('/create', jsonParser, creation.createRoom);
router.post('/approve', jsonParser, creation.approveHotel);
router.post('/reject', jsonParser, creation.rejectHotel);
router.get('/search',jsonParser,searchService.getResults);
router.post('/rate', jsonParser, update.rateHotel);
router.post('/reserve', jsonParser, reserve.reserve);


module.exports = router;
