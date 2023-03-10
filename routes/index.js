var express = require('express');
require('dotenv').config();
var router = express.Router();
var database = require('../components/database');
const controller = require('../components/controllers/controller');
const authentication = require('../middle/auth');
const serviceAccount = require('../firebase-adminsdk.json');
const firebase = require('firebase-admin');
const multer = require('multer');
// Initialize Firebase App
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});
// Create a Multer storage engine to handle file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: null }
});



/* GET home page. */

router.get('/login', function (req, res, next) {
  res.render('login');
});
router.post('/login', controller.loginAdmin);

router.get('/logout', [authentication.checkLogin], function (req, res, next) {
  req.session.destroy(function (err) {
    // nếu đăng xuất thành công chuyển qua đăng nhập
    res.redirect('login');
  })
});

router.get('/', [authentication.checkLogin], controller.getPhim);
router.get('/the-loai', [authentication.checkLogin], controller.getTheLoai);
router.get('/dao-dien', [authentication.checkLogin], controller.getDaoDien);
router.get('/dien-vien', [authentication.checkLogin], controller.getDienVien);
router.get('/quoc-gia', [authentication.checkLogin], controller.getQuocGia);
router.get('/nguoi-dung', [authentication.checkLogin], controller.getNguoiDung);

router.get('/add-dao-dien', [authentication.checkLogin], controller.getAddDaoDien);
router.post('/post-add-dao-dien', [authentication.checkLogin], controller.postAddDaoDien);
router.get('/update-dao-dien/:id', [authentication.checkLogin], controller.getUpdateDaoDien);
router.post('/post-update-dao-dien', [authentication.checkLogin], controller.postUpdateDaoDien);

router.get('/add-dien-vien', [authentication.checkLogin], controller.getAddDienVien);
router.post('/post-add-dien-vien', [authentication.checkLogin], controller.postAddDienVien);
router.get('/update-dien-vien/:id', [authentication.checkLogin], controller.getUpdateDienVien);
router.post('/post-update-dien-vien', [authentication.checkLogin], controller.postUpdateDienVien);

router.get('/add-quoc-gia', [authentication.checkLogin], controller.getAddQuocGia);
router.post('/post-add-quoc-gia', [authentication.checkLogin], controller.postAddQuocGia);
router.get('/update-quoc-gia/:id', [authentication.checkLogin], controller.getUpdateQuocGia);
router.post('/post-update-quoc-gia', [authentication.checkLogin], controller.postUpdateQuocGia);


router.get('/add-the-loai', [authentication.checkLogin], controller.getAddTheLoai);
router.post('/post-add-the-loai', [authentication.checkLogin], controller.postAddTheLoai);
router.get('/update-the-loai/:id', [authentication.checkLogin], controller.getUpdateTheLoai);
router.post('/post-update-the-loai', [authentication.checkLogin], controller.postUpdateTheLoai);

router.get('/add-phim', [authentication.checkLogin], controller.getAddPhim);
router.post('/post-add-phim', [authentication.checkLogin, upload.single('image')], async (req, res) => {
  try {
    // Get the uploaded file
    const file = req.file;

    // Upload file to Firebase Storage
    const bucket = firebase.storage().bucket();
    const firebaseFileName = `${Date.now()}_${file.originalname}`;
    const firebaseFile = bucket.file(`phim/${firebaseFileName}`);
    const fileStream = firebaseFile.createWriteStream();
    fileStream.end(file.buffer);
    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    // Get public URL for the uploaded file
    const [url] = await firebaseFile.getSignedUrl({ action: 'read', expires: '01-01-2500' });

    // them phim
    const { tenphim, tenkhac, mota, namphathanh, dinhdang, sotap, chatluong, thoiluong, phan, daodiens, dienviens, quocgias, theloais } = req.body;
    const result1 = await database.query(`
    INSERT INTO phim (tenphim, tenkhac, trangthai, mota, image, namphathanh, sotap, chatluong, thoiluong, dinhdang, phan) 
    VALUES ('${tenphim}', '${tenkhac}', 1, '${mota}', '${url}', ${namphathanh}, ${sotap}, ${chatluong}, ${thoiluong}, ${dinhdang}, ${phan}) returning *`);
    const idphim = result1.rows[0].id;

    // tại vì nếu list id trả về chỉ có 1 phần tử nên nó tự biến thành số. nên cần kiểm tra xem nó có phải là số hay không để thêm dữ liệu vào
    if (isNaN(daodiens) == false) {
      await database.query(`INSERT INTO ct_daodien (idphim, iddaodien) VALUES (${idphim}, ${daodiens})`);
    } else if (daodiens != undefined) {
      for (const iddaodien of daodiens) {
        await database.query(`INSERT INTO ct_daodien (idphim, iddaodien) VALUES (${idphim}, ${iddaodien})`);
      }
    }

    if (isNaN(dienviens) == false) {
      await database.query(`INSERT INTO ct_dienvien (idphim, iddienvien) VALUES (${idphim}, ${dienviens})`);
    } else if (dienviens != undefined) {
      for (const iddienvien of dienviens) {
        await database.query(`INSERT INTO ct_dienvien (idphim, iddienvien) VALUES (${idphim}, ${iddienvien})`);
      }
    }

    if (isNaN(quocgias) == false) {
      await database.query(`INSERT INTO ct_quocgia (idphim, idquocgia) VALUES (${idphim}, ${quocgias})`);
    } else if (quocgias != undefined) {
      for (const idquocgia of quocgias) {
        await database.query(`INSERT INTO ct_quocgia (idphim, idquocgia) VALUES (${idphim}, ${idquocgia})`);
      }
    }

    if (isNaN(theloais) == false) {
      await database.query(`INSERT INTO ct_theloai (idphim, idtheloai) VALUES (${idphim}, ${theloais})`);
    } else if (theloais != undefined) {
      for (const idtheloai of theloais) {
        await database.query(`INSERT INTO ct_theloai (idphim, idtheloai) VALUES (${idphim}, ${idtheloai})`);
      }
    }
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while uploading the image.');
  }
});
router.get('/update-phim/:id', [authentication.checkLogin], controller.getUpdatePhim);
router.post('/post-update-phim', [authentication.checkLogin, upload.single('image')], async (req, res) => {
  try {
    // kiểm tra xem có đổi ảnh hay không
    if (req.file == undefined) {
      // sửa phim
      const { id, tenphim, tenkhac, mota, namphathanh, dinhdang, sotap, chatluong, thoiluong, trangthai, phan, daodiens, dienviens, quocgias, theloais } = req.body;
      await database.query(`UPDATE phim
      SET tenphim = '${tenphim}', tenkhac = '${tenkhac}', mota = '${mota}', namphathanh = ${namphathanh}, dinhdang = ${dinhdang}, sotap = ${sotap}, chatluong = ${chatluong}, thoiluong = ${thoiluong}, trangthai = ${trangthai}, phan = ${phan}
      WHERE id = ${id}`);

      // xóa đi các chi tiết cũ và insert cái mới
      await database.query(`DELETE FROM ct_daodien WHERE idphim = ${id}`);
      await database.query(`DELETE FROM ct_dienvien WHERE idphim = ${id}`);
      await database.query(`DELETE FROM ct_quocgia WHERE idphim = ${id}`);
      await database.query(`DELETE FROM ct_theloai WHERE idphim = ${id}`);

      // tại vì nếu list id trả về chỉ có 1 phần tử nên nó tự biến thành số. nên cần kiểm tra xem nó có phải là số hay không để thêm dữ liệu vào
      if (isNaN(daodiens) == false) {
        await database.query(`INSERT INTO ct_daodien (idphim, iddaodien) VALUES (${id}, ${daodiens})`);
      } else if (daodiens != undefined) {
        for (const iddaodien of daodiens) {
          await database.query(`INSERT INTO ct_daodien (idphim, iddaodien) VALUES (${id}, ${iddaodien})`);
        }
      }

      if (isNaN(dienviens) == false) {
        await database.query(`INSERT INTO ct_dienvien (idphim, iddienvien) VALUES (${id}, ${dienviens})`);
      } else if (dienviens != undefined) {
        for (const iddienvien of dienviens) {
          await database.query(`INSERT INTO ct_dienvien (idphim, iddienvien) VALUES (${id}, ${iddienvien})`);
        }
      }

      if (isNaN(quocgias) == false) {
        await database.query(`INSERT INTO ct_quocgia (idphim, idquocgia) VALUES (${id}, ${quocgias})`);
      } else if (quocgias != undefined) {
        for (const idquocgia of quocgias) {
          await database.query(`INSERT INTO ct_quocgia (idphim, idquocgia) VALUES (${id}, ${idquocgia})`);
        }
      }

      if (isNaN(theloais) == false) {
        await database.query(`INSERT INTO ct_theloai (idphim, idtheloai) VALUES (${id}, ${theloais})`);
      } else if (theloais != undefined) {
        for (const idtheloai of theloais) {
          await database.query(`INSERT INTO ct_theloai (idphim, idtheloai) VALUES (${id}, ${idtheloai})`);
        }
      }
    } else {
      // Get the uploaded file
      const file = req.file;

      // Upload file to Firebase Storage
      const bucket = firebase.storage().bucket();
      const firebaseFileName = `${Date.now()}_${file.originalname}`;
      const firebaseFile = bucket.file(`truyen/${firebaseFileName}`);
      const fileStream = firebaseFile.createWriteStream();
      fileStream.end(file.buffer);
      await new Promise((resolve, reject) => {
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
      });

      // Get public URL for the uploaded file
      const [url] = await firebaseFile.getSignedUrl({ action: 'read', expires: '01-01-2500' });

      // xóa đi ảnh cũ
      const { id, tenphim, tenkhac, mota, namphathanh, dinhdang, sotap, chatluong, thoiluong, trangthai, phan, daodiens, dienviens, quocgias, theloais } = req.body;
      const result = await database.query(`select * from phim WHERE id = ${id}`);

      const fileUrl = result.rows[0].image;
      const urlObj = new URL(fileUrl);
      const pathname = decodeURIComponent(urlObj.pathname);
      const filename = pathname.split('/').pop();
      const fileDelete = bucket.file('phim/' + filename);
      fileDelete.delete().then(() => {
      }).catch((error) => {
        console.log('Error deleting file:', error);
      });


      // sửa phim
      await database.query(`UPDATE phim
              SET tenphim = '${tenphim}', tenkhac = '${tenkhac}', mota = '${mota}', namphathanh = ${namphathanh}, 
              dinhdang = ${dinhdang}, sotap = ${sotap}, chatluong = ${chatluong}, thoiluong = ${thoiluong}, trangthai = ${trangthai}, phan = ${phan}, image = '${url}'
              WHERE id = ${id}`);

      // xóa đi các chi tiết cũ và insert cái mới
      await database.query(`DELETE FROM ct_daodien WHERE idphim = ${id}`);
      await database.query(`DELETE FROM ct_dienvien WHERE idphim = ${id}`);
      await database.query(`DELETE FROM ct_quocgia WHERE idphim = ${id}`);
      await database.query(`DELETE FROM ct_theloai WHERE idphim = ${id}`);

      // tại vì nếu list id trả về chỉ có 1 phần tử nên nó tự biến thành số. nên cần kiểm tra xem nó có phải là số hay không để thêm dữ liệu vào
      if (isNaN(daodiens) == false) {
        await database.query(`INSERT INTO ct_daodien (idphim, iddaodien) VALUES (${id}, ${daodiens})`);
      } else if (daodiens != undefined) {
        for (const iddaodien of daodiens) {
          await database.query(`INSERT INTO ct_daodien (idphim, iddaodien) VALUES (${id}, ${iddaodien})`);
        }
      }

      if (isNaN(dienviens) == false) {
        await database.query(`INSERT INTO ct_dienvien (idphim, iddienvien) VALUES (${id}, ${dienviens})`);
      } else if (dienviens != undefined) {
        for (const iddienvien of dienviens) {
          await database.query(`INSERT INTO ct_dienvien (idphim, iddienvien) VALUES (${id}, ${iddienvien})`);
        }
      }

      if (isNaN(quocgias) == false) {
        await database.query(`INSERT INTO ct_quocgia (idphim, idquocgia) VALUES (${id}, ${quocgias})`);
      } else if (quocgias != undefined) {
        for (const idquocgia of quocgias) {
          await database.query(`INSERT INTO ct_quocgia (idphim, idquocgia) VALUES (${id}, ${idquocgia})`);
        }
      }

      if (isNaN(theloais) == false) {
        await database.query(`INSERT INTO ct_theloai (idphim, idtheloai) VALUES (${id}, ${theloais})`);
      } else if (theloais != undefined) {
        for (const idtheloai of theloais) {
          await database.query(`INSERT INTO ct_theloai (idphim, idtheloai) VALUES (${id}, ${idtheloai})`);
        }
      }
    }
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while uploading the image.');
  }
});


router.get('/update-phim/:idPhim/tap', [authentication.checkLogin], controller.getTap);
router.get('/update-phim/:idPhim/add-tap', [authentication.checkLogin], controller.getAddTap);
router.get('/update-phim/:idPhim/update-tap/:idTap', [authentication.checkLogin], controller.getUpdateTap);
router.post('/update-phim/:idPhim/post-add-tap', [authentication.checkLogin], controller.postAddTap);
router.post('/update-phim/:idPhim/post-update-tap', [authentication.checkLogin], controller.postUpdateTap);


module.exports = router;
