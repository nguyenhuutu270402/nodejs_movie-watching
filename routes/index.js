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
    const { tenphim, tenkhac, mota, namphathanh, dinhdang, sotap, chatluong, thoiluong, daodiens, dienviens, quocgias, theloais } = req.body;
    const result1 = await database.query(`
    INSERT INTO phim (tenphim, tenkhac, trangthai, mota, image, namphathanh, sotap, chatluong, thoiluong, dinhdang) 
    VALUES ('${tenphim}', '${tenkhac}', 1, '${mota}', '${url}', ${namphathanh}, ${sotap}, ${chatluong}, ${thoiluong}, ${dinhdang}) returning *`);
    const idphim = result1.rows[0].id;

    // tại vì nếu list id trả về chỉ có 1 phần tử nên nó tự biến thành số. nên cần kiểm tra xem nó có phải là số hay không để thêm dữ liệu vào
    if (isNaN(daodiens) == false) {
      await database.query(`INSERT INTO ct_daodien (idphim, iddaodien) VALUES (${idphim}, ${daodiens})`);
    } else {
      for (const iddaodien of daodiens) {
        await database.query(`INSERT INTO ct_daodien (idphim, iddaodien) VALUES (${idphim}, ${iddaodien})`);
      }
    }

    if (isNaN(dienviens) == false) {
      await database.query(`INSERT INTO ct_dienvien (idphim, iddienvien) VALUES (${idphim}, ${dienviens})`);
    } else {
      for (const iddienvien of dienviens) {
        await database.query(`INSERT INTO ct_dienvien (idphim, iddienvien) VALUES (${idphim}, ${iddienvien})`);
      }
    }

    if (isNaN(quocgias) == false) {
      await database.query(`INSERT INTO ct_quocgia (idphim, idquocgia) VALUES (${idphim}, ${quocgias})`);
    } else {
      for (const idquocgia of quocgias) {
        await database.query(`INSERT INTO ct_quocgia (idphim, idquocgia) VALUES (${idphim}, ${idquocgia})`);
      }
    }

    if (isNaN(theloais) == false) {
      await database.query(`INSERT INTO ct_theloai (idphim, idtheloai) VALUES (${idphim}, ${theloais})`);
    } else {
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
      const { id, tenphim, tenkhac, mota, namphathanh, dinhdang, sotap, chatluong, thoiluong, trangthai, daodiens, dienviens, quocgias, theloais } = req.body;
      await database.query(`UPDATE phim
      SET tenphim = '${tenphim}', tenkhac = '${tenkhac}', mota = '${mota}', namphathanh = ${namphathanh}, dinhdang = ${dinhdang}, sotap = ${sotap}, chatluong = ${chatluong}, thoiluong = ${thoiluong}, trangthai = ${trangthai}
      WHERE id = ${id}`);

      // xóa đi các chi tiết cũ và insert cái mới
      await database.query(`DELETE FROM ct_daodien WHERE idphim = ${id}`);
      await database.query(`DELETE FROM ct_dienvien WHERE idphim = ${id}`);
      await database.query(`DELETE FROM ct_quocgia WHERE idphim = ${id}`);
      await database.query(`DELETE FROM ct_theloai WHERE idphim = ${id}`);

      // tại vì nếu list id trả về chỉ có 1 phần tử nên nó tự biến thành số. nên cần kiểm tra xem nó có phải là số hay không để thêm dữ liệu vào
      if (isNaN(daodiens) == false) {
        await database.query(`INSERT INTO ct_daodien (idphim, iddaodien) VALUES (${id}, ${daodiens})`);
      } else {
        for (const iddaodien of daodiens) {
          await database.query(`INSERT INTO ct_daodien (idphim, iddaodien) VALUES (${id}, ${iddaodien})`);
        }
      }

      if (isNaN(dienviens) == false) {
        await database.query(`INSERT INTO ct_dienvien (idphim, iddienvien) VALUES (${id}, ${dienviens})`);
      } else {
        for (const iddienvien of dienviens) {
          await database.query(`INSERT INTO ct_dienvien (idphim, iddienvien) VALUES (${id}, ${iddienvien})`);
        }
      }

      if (isNaN(quocgias) == false) {
        await database.query(`INSERT INTO ct_quocgia (idphim, idquocgia) VALUES (${id}, ${quocgias})`);
      } else {
        for (const idquocgia of quocgias) {
          await database.query(`INSERT INTO ct_quocgia (idphim, idquocgia) VALUES (${id}, ${idquocgia})`);
        }
      }

      if (isNaN(theloais) == false) {
        await database.query(`INSERT INTO ct_theloai (idphim, idtheloai) VALUES (${id}, ${theloais})`);
      } else {
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
      const { id, tenphim, tenkhac, mota, namphathanh, dinhdang, sotap, chatluong, thoiluong, trangthai, daodiens, dienviens, quocgias, theloais } = req.body;
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
              dinhdang = ${dinhdang}, sotap = ${sotap}, chatluong = ${chatluong}, thoiluong = ${thoiluong}, trangthai = ${trangthai}, image = '${url}'
              WHERE id = ${id}`);

      // xóa đi các chi tiết cũ và insert cái mới
      await database.query(`DELETE FROM ct_daodien WHERE idphim = ${id}`);
      await database.query(`DELETE FROM ct_dienvien WHERE idphim = ${id}`);
      await database.query(`DELETE FROM ct_quocgia WHERE idphim = ${id}`);
      await database.query(`DELETE FROM ct_theloai WHERE idphim = ${id}`);

      // tại vì nếu list id trả về chỉ có 1 phần tử nên nó tự biến thành số. nên cần kiểm tra xem nó có phải là số hay không để thêm dữ liệu vào
      if (isNaN(daodiens) == false) {
        await database.query(`INSERT INTO ct_daodien (idphim, iddaodien) VALUES (${id}, ${daodiens})`);
      } else {
        for (const iddaodien of daodiens) {
          await database.query(`INSERT INTO ct_daodien (idphim, iddaodien) VALUES (${id}, ${iddaodien})`);
        }
      }

      if (isNaN(dienviens) == false) {
        await database.query(`INSERT INTO ct_dienvien (idphim, iddienvien) VALUES (${id}, ${dienviens})`);
      } else {
        for (const iddienvien of dienviens) {
          await database.query(`INSERT INTO ct_dienvien (idphim, iddienvien) VALUES (${id}, ${iddienvien})`);
        }
      }

      if (isNaN(quocgias) == false) {
        await database.query(`INSERT INTO ct_quocgia (idphim, idquocgia) VALUES (${id}, ${quocgias})`);
      } else {
        for (const idquocgia of quocgias) {
          await database.query(`INSERT INTO ct_quocgia (idphim, idquocgia) VALUES (${id}, ${idquocgia})`);
        }
      }

      if (isNaN(theloais) == false) {
        await database.query(`INSERT INTO ct_theloai (idphim, idtheloai) VALUES (${id}, ${theloais})`);
      } else {
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












router.get('/update-truyen/:idTruyen/chuong', [authentication.checkLogin], controller.getChuong);

router.get('/update-truyen/:idTruyen/add-chuong', [authentication.checkLogin], controller.getAddChuong);
router.get('/update-truyen/:idTruyen/update-chuong/:idChuong', [authentication.checkLogin], controller.getUpdateChuong);


router.post('/update-truyen/:idTruyen/post-add-chuong', upload.array('images'), async (req, res) => {
  try {
    const files = req.files;
    files.sort((a, b) => a.originalname.localeCompare(b.originalname));

    // Upload các file lên Firebase Storage và trả về các URL
    const urls = await Promise.all(files.map(async (file) => {
      const bucket = firebase.storage().bucket();
      const firebaseFileName = `${Date.now()}_${file.originalname}`;
      const firebaseFile = bucket.file(`chuong/${firebaseFileName}`);
      const fileStream = firebaseFile.createWriteStream();
      fileStream.end(file.buffer);
      await new Promise((resolve, reject) => {
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
      });
      const [url] = await firebaseFile.getSignedUrl({ action: 'read', expires: '01-01-2500' });
      return url;
    }));
    const { tenchuong, sochuong } = req.body;
    database.query("INSERT INTO chuong (tenchuong, sochuong, ngaycapnhat, idtruyen) VALUES (?, ? , now() , ?)", [tenchuong, sochuong, req.params.idTruyen], (err, results) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        for (let index = 0; index < urls.length; index++) {
          const element = urls[index];
          database.query("INSERT INTO image_chuong (imagelink, idchuong) VALUES (?, ? )", [element, results.insertId], (err, results) => {
            if (err) {
              res.status(500).json({ message: err.message });
            } else {
            }
          });
        }

      }
    });
    res.redirect(`/update-truyen/${req.params.idTruyen}/chuong`);
    // Trả về các URL đã upload
    // res.status(200).json({ urls });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while uploading the files.');
  }
});

router.post('/update-truyen/:idTruyen/post-update-chuong', upload.array('images'), async (req, res) => {
  try {
    if (req.files[0] == undefined) {

      const { tenchuong, sochuong, id } = req.body;
      database.query(`UPDATE chuong
      SET tenchuong = ? , sochuong = ?, ngaycapnhat = now()
      WHERE id = ?`, [tenchuong, sochuong, id], (err, results) => {
        if (err) {
          res.status(500).json({ message: err.message });
        } else {

        }
      });
    } else {

      const files = req.files;
      files.sort((a, b) => a.originalname.localeCompare(b.originalname));

      // Upload các file lên Firebase Storage và trả về các URL
      const urls = await Promise.all(files.map(async (file) => {
        const bucket = firebase.storage().bucket();
        const firebaseFileName = `${Date.now()}_${file.originalname}`;
        const firebaseFile = bucket.file(`chuong/${firebaseFileName}`);
        const fileStream = firebaseFile.createWriteStream();
        fileStream.end(file.buffer);
        await new Promise((resolve, reject) => {
          fileStream.on('finish', resolve);
          fileStream.on('error', reject);
        });
        const [url] = await firebaseFile.getSignedUrl({ action: 'read', expires: '01-01-2500' });
        return url;
      }));
      const { tenchuong, sochuong, id } = req.body;
      database.query(`UPDATE chuong
    SET tenchuong = ? , sochuong = ?, ngaycapnhat = now()
    WHERE id = ?`, [tenchuong, sochuong, id], (err, results) => {
        if (err) {
          res.status(500).json({ message: err.message });
        } else {

          // xóa đi ảnh cũ
          database.query(" select * from image_chuong WHERE idchuong = ?", [id], (err, results) => {
            if (err) {
              res.status(500).json({ message: err.message });
            } else {
              try {
                for (let index = 0; index < results.length; index++) {
                  const bucket = firebase.storage().bucket();
                  const fileUrl = results[index].imagelink;
                  const urlObj = new URL(fileUrl);
                  const pathname = decodeURIComponent(urlObj.pathname);
                  const filename = pathname.split('/').pop();
                  const file = bucket.file('chuong/' + filename);
                  file.delete().then(() => {
                  }).catch((error) => {
                    console.error('Error deleting file:', error);
                  });
                }

              } catch (error) {
                console.error(error);
              }

            }
          });


          database.query("DELETE FROM image_chuong WHERE idchuong = ?", [id], (err, results) => {
            if (err) {
              res.status(500).json({ message: err.message });
            } else {
            }
          });
          for (let index = 0; index < urls.length; index++) {
            const element = urls[index];
            database.query("INSERT INTO image_chuong (imagelink, idchuong) VALUES (?, ? )", [element, id], (err, results) => {
              if (err) {
                res.status(500).json({ message: err.message });
              } else {
              }
            });
          }

        }
      });
    }
    res.redirect(`/update-truyen/${req.params.idTruyen}/chuong`);
    // Trả về các URL đã upload
    // res.status(200).json({ urls });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while uploading the files.');
  }
});

module.exports = router;
