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

router.get('/get-one-phim-by-id/:id/:idNguoiDung', apiController.getOnePhimById);

router.post('/add-luot-xem', apiController.addLuotXem);

router.post('/add-danh-gia', apiController.addDanhGia);

router.post('/add-theo-doi', apiController.addTheoDoi);

router.post('/kiem-tra-theo-doi', apiController.kiemTraTheoDoi);

router.post('/delete-theo-doi', apiController.deleteTheoDoi);

router.get('/get-list-binh-luan-theo-id-phim/:idPhim', apiController.getListBinhLuanByIdPhim);

router.post('/add-binh-luan', apiController.addBinhLuan);

router.get('/get-list-lich-su-theo-id-nguoi-dung/:idNguoiDung', apiController.getListLichSuTheoIdNguoiDung);

router.post('/add-lich-su', apiController.addLichSu);

router.post('/delete-lich-su', apiController.deleteLichSu);

router.get('/get-one-tap-by-id/:idTap/:idPhim/:idNguoiDung', apiController.getOneTapById);

router.post('/list-phim-theo-loai', apiController.getPhimTheoLoai);

router.post('/list-phim-xep-hang', apiController.getPhimXepHang);

module.exports = router;
