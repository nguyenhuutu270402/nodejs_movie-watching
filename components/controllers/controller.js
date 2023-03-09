var database = require('../database');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const controller = {

    loginAdmin: async (req, res) => {
        try {
            const { email, matkhau } = req.body;
            const qr = `SELECT * FROM nguoidung WHERE email = '${email}' AND phanquyen = 0`
            database.query(qr, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {

                    const result = results.rows[0];
                    if (result) {
                        if (result.matkhau === matkhau) {
                            const token = jwt.sign({ id: result.id, email: result.email }, process.env.APP_SECRET, { expiresIn: '1h' })
                            req.session.token = token;
                            global.idNguoiDung = result.id;
                            res.json({
                                success: true
                            });
                        } else {
                            res.json({
                                success: false,
                                message: 'Tài khoản hoặc mật khẩu không đúng',
                            });
                        }
                    } else {
                        res.json({
                            success: false,
                            message: 'Tài khoản hoặc mật khẩu không đúng',
                        });
                    }
                } else {
                    res.json({
                        success: false,
                        message: 'Tài khoản hoặc mật khẩu không đúng',
                    });
                }

            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getPhim: async (req, res) => {
        try {
            let user = {};
            let listPhim = [];
            const qr = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`
            database.query(qr, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    user = results.rows[0];
                    const qr1 = `SELECT phim.*, 
            CASE WHEN dinhdang = 0 THEN 'Phim lẻ' ELSE 'Phim bộ' END AS dinhdang_text, 
            CASE WHEN trangthai = 1 THEN 'Đang chiếu' WHEN trangthai = 2 THEN 'Hoàn thành' WHEN trangthai = 3 THEN 'Ngừng hoạt động' ELSE '' END AS trangthai_text
            FROM phim;`;
                    database.query(qr1, (err, results) => {
                        if (err) {
                            res.status(500).json({ message: err.message });
                        } else {
                            listPhim = results.rows;
                            res.render('index', { user: user, listPhim: listPhim });
                        }
                    });
                }
            });


        } catch (error) {
            res.status(500).json(error);
        }
    },

    getTheLoai: async (req, res) => {
        try {
            let user = {};
            let listTheLoai = [];


            const qr0 = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    user = results.rows[0];
                    const qr = "select * from theloai";
                    database.query(qr, (err, results) => {
                        if (err) {
                            res.status(500).json({ message: err.message });
                        } else {
                            listTheLoai = results.rows;
                            res.render('theloai', { user: user, listTheLoai: listTheLoai });
                        }
                    });
                }
            });


        } catch (error) {
            res.status(500).json(error);
        }
    },

    getNguoiDung: async (req, res) => {
        try {
            let user = {};
            let listNguoiDung = [];

            const qr0 = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    user = results.rows[0];
                    const qr = "select * from nguoidung";
                    database.query(qr, (err, results) => {
                        if (err) {
                            res.status(500).json({ message: err.message });
                        } else {
                            listNguoiDung = results.rows;
                            res.render('nguoidung', { user: user, listNguoiDung: listNguoiDung });
                        }
                    });
                }
            });

        } catch (error) {
            res.status(500).json(error);
        }
    },

    getDaoDien: async (req, res) => {
        try {
            let user = {};
            let listDaoDien = [];

            const qr0 = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    user = results.rows[0];
                    const qr = "select * from daodien";
                    database.query(qr, (err, results) => {
                        if (err) {
                            res.status(500).json({ message: err.message });
                        } else {
                            listDaoDien = results.rows;
                            res.render('daodien', { user: user, listDaoDien: listDaoDien });
                        }
                    });
                }
            });


        } catch (error) {
            res.status(500).json(error);
        }
    },
    getDienVien: async (req, res) => {
        try {
            let user = {};
            let listDienVien = [];

            const qr0 = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    user = results.rows[0];
                    const qr = "select * from dienvien";
                    database.query(qr, (err, results) => {
                        if (err) {
                            res.status(500).json({ message: err.message });
                        } else {
                            listDienVien = results.rows;
                            res.render('dienvien', { user: user, listDienVien: listDienVien });
                        }
                    });
                }
            });


        } catch (error) {
            res.status(500).json(error);
        }
    },

    getAddDaoDien: async (req, res) => {
        try {
            let user = {};
            const qr0 = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`

            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    user = results.rows[0];
                    res.render('adddaodien', { user: user });
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    postAddDaoDien: async (req, res) => {
        try {
            const { tendaodien } = req.body;
            const qr = `INSERT INTO daodien (tendaodien) VALUEs ('${tendaodien}')`
            database.query(qr, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    res.redirect('/dao-dien');
                    console.log("add neffff: ", results);
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getUpdateDaoDien: async (req, res) => {
        try {
            let user = {};
            let daodien = {};
            const qr0 = `SELECT id, tendaodien FROM daodien WHERE id = ${req.params.id}`;
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    daodien = results.rows[0];
                    const qr1 = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`
                    database.query(qr1, (err, results) => {
                        if (err) {
                            res.status(500).json({ message: err.message });
                        } else if (results.rows.length > 0) {
                            user = results.rows[0];
                            res.render('updatedaodien', { user: user, daodien: daodien });
                        }
                    });
                }
            });

        } catch (error) {
            res.status(500).json(error);
        }
    },
    postUpdateDaoDien: async (req, res) => {
        try {
            const { tendaodien, id } = req.body;
            const qr0 = `UPDATE daodien SET tendaodien = '${tendaodien}'  WHERE id = ${id}`;
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    res.redirect('/dao-dien');
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getAddDienVien: async (req, res) => {
        try {
            let user = {};
            const qr0 = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`

            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    user = results.rows[0];
                    res.render('adddienvien', { user: user });
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    postAddDienVien: async (req, res) => {
        try {
            const { tendienvien } = req.body;
            const qr = `INSERT INTO dienvien (tendienvien) VALUEs ('${tendienvien}') returning *`
            database.query(qr, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    res.redirect('/dien-vien');
                    console.log("add neffff: ", results);
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getUpdateDienVien: async (req, res) => {
        try {
            let user = {};
            let dienvien = {};
            const qr0 = `SELECT id, tendienvien FROM dienvien WHERE id = ${req.params.id}`;
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    dienvien = results.rows[0];
                    const qr1 = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`
                    database.query(qr1, (err, results) => {
                        if (err) {
                            res.status(500).json({ message: err.message });
                        } else if (results.rows.length > 0) {
                            user = results.rows[0];
                            res.render('updatedienvien', { user: user, dienvien: dienvien });
                        }
                    });
                }
            });

        } catch (error) {
            res.status(500).json(error);
        }
    },
    postUpdateDienVien: async (req, res) => {
        try {
            const { tendienvien, id } = req.body;
            const qr0 = `UPDATE dienvien SET tendienvien = '${tendienvien}'  WHERE id = ${id}`;
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    res.redirect('/dien-vien');
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getAddTheLoai: async (req, res) => {
        try {
            let user = {};
            const qr0 = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`

            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    user = results.rows[0];
                    res.render('addtheloai', { user: user });
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    postAddTheLoai: async (req, res) => {
        try {
            const { tentheloai } = req.body;
            const qr = `INSERT INTO theloai (tentheloai) VALUES ('${tentheloai}')`
            database.query(qr, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    res.redirect('/the-loai');
                    console.log("add neffff: ", results);
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getUpdateTheLoai: async (req, res) => {
        try {
            let user = {};
            let theloai = {};
            const qr0 = `SELECT id, tentheloai FROM theloai WHERE id = ${req.params.id}`;
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    theloai = results.rows[0];
                    const qr1 = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`
                    database.query(qr1, (err, results) => {
                        if (err) {
                            res.status(500).json({ message: err.message });
                        } else if (results.rows.length > 0) {
                            user = results.rows[0];
                            res.render('updatetheloai', { user: user, theloai: theloai });
                        }
                    });
                }
            });

        } catch (error) {
            res.status(500).json(error);
        }
    },
    postUpdateTheLoai: async (req, res) => {
        try {
            const { tentheloai, id } = req.body;
            const qr0 = `UPDATE theloai SET tentheloai = '${tentheloai}'  WHERE id = ${id}`;
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    res.redirect('/the-loai');
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },




    getAddPhim: async (req, res) => {
        try {
            let user = {};
            let listDaoDien = [];
            let listDienVien = [];
            let listTheLoai = [];
            let listChatLuong = [
                {
                    "value": 1,
                    "option": "360p",
                    "selected": null
                },
                {
                    "value": 2,
                    "option": "720p",
                    "selected": null
                },
                {
                    "value": 3,
                    "option": "1080p",
                    "selected": null
                },
                {
                    "value": 4,
                    "option": "1440p",
                    "selected": null
                },
                {
                    "value": 5,
                    "option": "2160p",
                    "selected": null
                }
            ];
            // Thực hiện các truy vấn lần lượt và chờ kết quả trả về bằng Promise và await
            const result1 = await database.query("SELECT * FROM daodien ORDER BY tendaodien");
            listDaoDien = result1.rows;

            const result2 = await database.query("SELECT * FROM dienvien ORDER BY tendienvien");
            listDienVien = result2.rows;

            const result3 = await database.query("SELECT * FROM theloai ORDER BY tentheloai");
            listTheLoai = result3.rows;

            const result4 = await database.query("SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = $1", [global.idNguoiDung]);
            user = result4.rows[0];

            res.render('addphim', { user: user, listDaoDien: listDaoDien, listDienVien: listDienVien, listTheLoai: listTheLoai, listChatLuong: listChatLuong });
        } catch (error) {
            res.status(500).json(error);
            console.log(error);
        }
    },





    getUpdatePhim: async (req, res) => {
        try {
            let user = {};
            let truyen = {};
            let listTacGia = [];
            let listTheLoai = [];
            let tinhtrangs = [
                {
                    "value": 1,
                    "option": "Đang chiếu",
                    "selected": null
                },
                {
                    "value": 2,
                    "option": "Hoàn thành",
                    "selected": null
                },
                {
                    "value": 3,
                    "option": "Ngừng hoạt động",
                    "selected": null
                }
            ];
            const id = req.params.id;
            var qr0 = `SELECT * from truyen where id = ${id}`
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    truyen = results[0];
                    for (let i = 0; i < tinhtrangs.length; i++) {
                        if (tinhtrangs[i].value === results[0].tinhtrang) {
                            tinhtrangs[i].selected = true;
                        }
                    }
                }
            });

            var qr1 = `SELECT theloai.*, ct_theloai.idtruyen as checktheloai
                        FROM theloai
                        LEFT JOIN ct_theloai ON theloai.id = ct_theloai.idtheloai AND ct_theloai.idtruyen = ${id}
                        group by theloai.id
                        order by theloai.tentheloai;`
            database.query(qr1, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    listTheLoai = results;
                }
            });
            var qr2 = `SELECT tacgia.*, ct_tacgia.idtruyen as checktacgia
                        FROM tacgia
                        LEFT JOIN ct_tacgia ON tacgia.id = ct_tacgia.idtacgia AND ct_tacgia.idtruyen = ${id}
                        group by tacgia.id
                        order by tacgia.tentacgia;`
            database.query(qr2, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    listTacGia = results;
                }
            });
            database.query("SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ?", [global.idNguoiDung], (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.length > 0) {
                    user = results[0];
                    res.render('updatetruyen', { user: user, listTacGia: listTacGia, listTheLoai: listTheLoai, truyen: truyen, tinhtrangs: tinhtrangs });
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getChuong: async (req, res) => {
        try {
            let listChuong = [];
            let user = {};

            database.query(`SELECT chuong.*, truyen.tentruyen FROM chuong 
                        LEFT JOIN truyen ON chuong.idtruyen = truyen.id
                        WHERE idtruyen = ? order by chuong.sochuong desc`, [req.params.idTruyen], (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.length > 0) {
                    listChuong = results;
                }
            });
            database.query("SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ?", [global.idNguoiDung], (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.length > 0) {
                    user = results[0];
                    res.render('chuong', { user: user, listChuong: listChuong, idTruyen: req.params.idTruyen });
                }
            });

        } catch (error) {
            res.status(500).json(error);
        }
    },

    getAddChuong: async (req, res) => {
        try {
            let user = {};

            database.query("SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ?", [global.idNguoiDung], (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.length > 0) {
                    user = results[0];
                    res.render('addchuong', { user: user, idTruyen: req.params.idTruyen });
                }
            });

        } catch (error) {
            res.status(500).json(error);
        }
    },

    getUpdateChuong: async (req, res) => {
        try {
            let user = {};
            let chuong = {};
            database.query("SELECT * FROM chuong WHERE id = ?", req.params.idChuong, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.length > 0) {
                    chuong = results[0];
                }
            });
            database.query("SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ?", [global.idNguoiDung], (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.length > 0) {
                    user = results[0];
                    res.render('updatechuong', { user: user, chuong: chuong });
                }
            });

        } catch (error) {
            res.status(500).json(error);
        }
    },

};
module.exports = controller;