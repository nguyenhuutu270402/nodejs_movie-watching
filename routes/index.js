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
router.get('/nguoi-dung', [authentication.checkLogin], controller.getNguoiDung);

router.get('/add-dao-dien', [authentication.checkLogin], controller.getAddDaoDien);
router.post('/post-add-dao-dien', [authentication.checkLogin], controller.postAddDaoDien);
router.get('/update-dao-dien/:id', [authentication.checkLogin], controller.getUpdateDaoDien);
router.post('/post-update-dao-dien', [authentication.checkLogin], controller.postUpdateDaoDien);

router.get('/add-dien-vien', [authentication.checkLogin], controller.getAddDienVien);
router.post('/post-add-dien-vien', [authentication.checkLogin], controller.postAddDienVien);
router.get('/update-dien-vien/:id', [authentication.checkLogin], controller.getUpdateDienVien);
router.post('/post-update-dien-vien', [authentication.checkLogin], controller.postUpdateDienVien);


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
    const { tentruyen, tenkhac, mota, tacgias, theloais } = req.body;
    database.query("INSERT INTO truyen (tentruyen, tenkhac, tinhtrang, mota, imagelink) VALUES (? , ?, 1, ?, ?)", [tentruyen, tenkhac, mota, url], (err, results) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        for (let index = 0; index < tacgias.length; index++) {
          const element = tacgias[index];
          database.query("INSERT INTO ct_tacgia (idtruyen, idtacgia) VALUES (? , ?)", [results.insertId, element], (err, results) => {
            if (err) {
              res.status(500).json({ message: err.message });
            } else {

            }
          });
        }
        for (let index = 0; index < theloais.length; index++) {
          const element = theloais[index];
          database.query("INSERT INTO ct_theloai (idtruyen, idtheloai) VALUES (? , ?)", [results.insertId, element], (err, results) => {
            if (err) {
              res.status(500).json({ message: err.message });
            } else {

            }
          });
        }
      }
    });
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while uploading the image.');
  }
});
router.get('/update-truyen/:id', [authentication.checkLogin], controller.getUpdatePhim);
router.post('/post-update-truyen', [authentication.checkLogin, upload.single('image')], async (req, res) => {
  try {
    if (req.file == undefined) {
      // sửa truyen
      const { tentruyen, tenkhac, tinhtrang, mota, tacgias, theloais, id } = req.body;

      database.query(`UPDATE truyen
                  SET tentruyen = ? , tenkhac = ? , tinhtrang = ? , mota = ? 
                  WHERE id = ?`, [tentruyen, tenkhac, tinhtrang, mota, id], (err, results) => {
        if (err) {
          res.status(500).json({ message: err.message });
        } else {
          // xóa các chi tiết cũ và insert lại 
          database.query(" DELETE FROM ct_tacgia WHERE idtruyen = ?", [id], (err, results) => {
            if (err) {
              res.status(500).json({ message: err.message });
            } else {

            }
          });
          database.query(" DELETE FROM ct_theloai WHERE idtruyen = ?", [id], (err, results) => {
            if (err) {
              res.status(500).json({ message: err.message });
            } else {

            }
          });
          if (isNaN(tacgias) == false) {
            database.query("INSERT INTO ct_tacgia (idtruyen, idtacgia) VALUES (? , ?)", [id, tacgias], (err, results) => {
              if (err) {
                res.status(500).json({ message: err.message });
              } else {

              }
            });
          } else {

            for (let index = 0; index < tacgias.length; index++) {
              const element = tacgias[index];
              database.query("INSERT INTO ct_tacgia (idtruyen, idtacgia) VALUES (? , ?)", [id, element], (err, results) => {
                if (err) {
                  res.status(500).json({ message: err.message });
                } else {

                }
              });
            }

          }
          if (isNaN(theloais) == false) {
            database.query("INSERT INTO ct_theloai (idtruyen, idtheloai) VALUES (? , ?)", [id, theloais], (err, results) => {
              if (err) {
                res.status(500).json({ message: err.message });
              } else {

              }
            });
          } else {
            for (let index = 0; index < theloais.length; index++) {
              const element = theloais[index];
              database.query("INSERT INTO ct_theloai (idtruyen, idtheloai) VALUES (? , ?)", [id, element], (err, results) => {
                if (err) {
                  res.status(500).json({ message: err.message });
                } else {

                }
              });
            }
          }

        }
      });
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

      // sửa truyen

      const { tentruyen, tenkhac, tinhtrang, mota, tacgias, theloais, id } = req.body;
      // xóa đi ảnh cũ
      database.query(" select * from truyen WHERE id = ?", [id], (err, results) => {
        if (err) {
          res.status(500).json({ message: err.message });
        } else {
          try {
            const fileUrl = results[0].imagelink;
            const urlObj = new URL(fileUrl);
            const pathname = decodeURIComponent(urlObj.pathname);
            const filename = pathname.split('/').pop();
            const file = bucket.file('truyen/' + filename);

            file.delete().then(() => {
            }).catch((error) => {
              console.error('Error deleting file:', error);
            });
          } catch (error) {
            console.error(error);
          }

        }
      });
      database.query(`UPDATE truyen
      SET tentruyen = ? , tenkhac = ? , tinhtrang = ? , mota = ? , imagelink = ? 
      WHERE id = ?`, [tentruyen, tenkhac, tinhtrang, mota, url, id], (err, results) => {
        if (err) {
          res.status(500).json({ message: err.message });
        } else {
          // xóa các chi tiết cũ và insert lại 
          database.query(" DELETE FROM ct_tacgia WHERE idtruyen = ?", [id], (err, results) => {
            if (err) {
              res.status(500).json({ message: err.message });
            } else {

            }
          });
          database.query(" DELETE FROM ct_theloai WHERE idtruyen = ?", [id], (err, results) => {
            if (err) {
              res.status(500).json({ message: err.message });
            } else {

            }
          });
          for (let index = 0; index < tacgias.length; index++) {
            const element = tacgias[index];
            database.query("INSERT INTO ct_tacgia (idtruyen, idtacgia) VALUES (? , ?)", [id, element], (err, results) => {
              if (err) {
                res.status(500).json({ message: err.message });
              } else {

              }
            });
          }
          for (let index = 0; index < theloais.length; index++) {
            const element = theloais[index];
            database.query("INSERT INTO ct_theloai (idtruyen, idtheloai) VALUES (? , ?)", [id, element], (err, results) => {
              if (err) {
                res.status(500).json({ message: err.message });
              } else {

              }
            });
          }
        }
      });
    }

    res.redirect('/');
  } catch (error) {
    console.error(error);
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
