var express = require('express');
var router = express.Router();
var apiController = require('../components/controllers/apiController');

// http://localhost:3000/api/

router.post('/login', apiController.loginUser);
router.get('/get-all-phim', apiController.getAllPhim);



module.exports = router;
