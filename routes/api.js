var express = require('express');
var router = express.Router();
var apiController = require('../components/controllers/apiController');


// test
router.get('/get-test', apiController.getTessst);




// http://localhost:3000/api/

router.post('/login', apiController.loginUser);

router.post('/add-user', apiController.addUser);

router.get('/get-all-phim', apiController.getAllPhim);

router.get('/get-top-10-phim', apiController.getTop10Phim);

router.post('/update-user', apiController.updateUser);

router.post('/update-password-user', apiController.updatePasswordUser);

router.get('/get-one-phim-by-id/:id', apiController.getOnePhimById);

module.exports = router;
