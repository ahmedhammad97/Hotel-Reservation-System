//Dependencies
const router = require('express').Router();
const bodyParser = require('body-parser');
const creationService = require(__dirname + '/../Services/creations');
const auth = require(__dirname + '/../Services/auth');
const pendingService = require(__dirname + '/../Services/pendingHotel');
const searchService = require(__dirname + '/../Services/searchResult');

//BodyParser
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res)=>{
  res.render('index');
});

router.post('/testLogin', jsonParser, auth.customerLogin);
router.post('/testRegister', jsonParser, auth.customerRegister);


module.exports = router;
