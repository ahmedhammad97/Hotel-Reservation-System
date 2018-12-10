//Dependencies
const router = require('express').Router();
const bodyParser = require('body-parser');
const service = require(__dirname + '/../Services/creations');

//BodyParser
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res)=>{
  res.render('index');
});

module.exports = router;
