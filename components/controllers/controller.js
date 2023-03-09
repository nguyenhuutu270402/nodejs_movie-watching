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
            CASE WHEN dinhdang = 1 THEN 'Phim lẻ' ELSE 'Phim bộ' END AS dinhdang_text, 
            CASE WHEN trangthai = 1 THEN 'Đang chiếu' WHEN trangthai = 2 THEN 'Hoàn thành' WHEN trangthai = 3 THEN 'Ngừng hoạt động' ELSE '' END AS trangthai_text
            FROM phim
            ORDER BY phim.id`;
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
    getQuocGia: async (req, res) => {
        try {
            let user = {};
            let listQuocGia = [];

            const qr0 = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    user = results.rows[0];
                    const qr = "select * from quocgia";
                    database.query(qr, (err, results) => {
                        if (err) {
                            res.status(500).json({ message: err.message });
                        } else {
                            listQuocGia = results.rows;
                            res.render('quocgia', { user: user, listQuocGia: listQuocGia });
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

    getAddQuocGia: async (req, res) => {
        try {
            let user = {};
            const qr0 = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`

            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    user = results.rows[0];
                    res.render('addquocgia', { user: user });
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    postAddQuocGia: async (req, res) => {
        try {
            const { tenquocgia } = req.body;
            const qr = `INSERT INTO quocgia (tenquocgia) VALUES ('${tenquocgia}')`
            database.query(qr, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    res.redirect('/quoc-gia');
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getUpdateQuocGia: async (req, res) => {
        try {
            let user = {};
            let quocgia = {};
            const qr0 = `SELECT id, tenquocgia FROM quocgia WHERE id = ${req.params.id}`;
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    quocgia = results.rows[0];
                    const qr1 = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`
                    database.query(qr1, (err, results) => {
                        if (err) {
                            res.status(500).json({ message: err.message });
                        } else if (results.rows.length > 0) {
                            user = results.rows[0];
                            res.render('updatequocgia', { user: user, quocgia: quocgia });
                        }
                    });
                }
            });

        } catch (error) {
            res.status(500).json(error);
        }
    },
    postUpdateQuocGia: async (req, res) => {
        try {
            const { tenquocgia, id } = req.body;
            const qr0 = `UPDATE quocgia SET tenquocgia = '${tenquocgia}'  WHERE id = ${id}`;
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    res.redirect('/quoc-gia');
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
            let listQuocGia = [];
            let listDangPhim = [
                {
                    "value": 1,
                    "option": "Phim lẻ",
                    "selected": null
                },
                {
                    "value": 2,
                    "option": "Phim bộ",
                    "selected": null
                }
            ];
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

            const result5 = await database.query("SELECT * FROM quocgia ORDER BY tenquocgia");
            listQuocGia = result5.rows;
            res.render('addphim', { user: user, listDaoDien: listDaoDien, listDienVien: listDienVien, listTheLoai: listTheLoai, listChatLuong: listChatLuong, listQuocGia: listQuocGia, listDangPhim: listDangPhim });
        } catch (error) {
            res.status(500).json(error);
            console.log(error);
        }
    },

    getUpdatePhim: async (req, res) => {
        try {
            let user = {};
            let phim = {};
            let listDaoDien = [];
            let listDienVien = [];
            let listTheLoai = [];
            let listQuocGia = [];
            let listDangPhim = [
                {
                    "value": 1,
                    "option": "Phim lẻ",
                    "selected": null
                },
                {
                    "value": 2,
                    "option": "Phim bộ",
                    "selected": null
                }
            ];
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
            let listTrangThai = [
                {
                    "value": 1,
                    "option": "Đang tiến hành",
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
            // Thực hiện các truy vấn lần lượt và chờ kết quả trả về bằng Promise và await
            const result1 = await database.query(`
                        SELECT daodien.*, ct_daodien.idphim as checkdaodien
                        FROM daodien
                        LEFT JOIN ct_daodien ON daodien.id = ct_daodien.iddaodien AND ct_daodien.idphim = ${id}
                        group by daodien.id, ct_daodien.idphim
                        order by daodien.tendaodien`);
            listDaoDien = result1.rows;

            const result2 = await database.query(`
                        SELECT dienvien.*, ct_dienvien.idphim as checkdienvien
                        FROM dienvien
                        LEFT JOIN ct_dienvien ON dienvien.id = ct_dienvien.iddienvien AND ct_dienvien.idphim = ${id}
                        group by dienvien.id, ct_dienvien.idphim
                        order by dienvien.tendienvien`);
            listDienVien = result2.rows;

            const result3 = await database.query(`
                        SELECT theloai.*, ct_theloai.idphim as checktheloai
                        FROM theloai
                        LEFT JOIN ct_theloai ON theloai.id = ct_theloai.idtheloai AND ct_theloai.idphim = ${id}
                        group by theloai.id, ct_theloai.idphim
                        order by theloai.tentheloai`);
            listTheLoai = result3.rows;

            const result4 = await database.query("SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = $1", [global.idNguoiDung]);
            user = result4.rows[0];

            const result5 = await database.query(`
                        SELECT quocgia.*, ct_quocgia.idphim as checkquocgia
                        FROM quocgia
                        LEFT JOIN ct_quocgia ON quocgia.id = ct_quocgia.idquocgia AND ct_quocgia.idphim = ${id}
                        group by quocgia.id, ct_quocgia.idphim
                        order by quocgia.tenquocgia`);
            listQuocGia = result5.rows;

            const result6 = await database.query(`SELECT * from phim where id = ${id}`);
            phim = result6.rows[0];

            // check các option
            for (let i = 0; i < listTrangThai.length; i++) {
                if (listTrangThai[i].value === phim.trangthai) {
                    listTrangThai[i].selected = true;
                }
            }
            for (let i = 0; i < listChatLuong.length; i++) {
                if (listChatLuong[i].value === phim.chatluong) {
                    listChatLuong[i].selected = true;
                }
            }
            for (let i = 0; i < listDangPhim.length; i++) {
                if (listDangPhim[i].value === phim.dangphim) {
                    listDangPhim[i].selected = true;
                }
            }

            res.render('updatephim', { user: user, listDaoDien: listDaoDien, listDienVien: listDienVien, listTheLoai: listTheLoai, listChatLuong: listChatLuong, listQuocGia: listQuocGia, listDangPhim: listDangPhim, phim: phim, listTrangThai: listTrangThai });


        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },

    //////////////////
    getTap: async (req, res) => {
        try {
            let user = {};
            let listTap = [];
            const qr0 = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    user = results.rows[0];
                    const qr = `SELECT tap.*, phim.tenphim FROM tap 
                    LEFT JOIN phim ON tap.idphim = phim.id
                    WHERE tap.idphim = ${req.params.idPhim} 
                    order by tap.tapso desc`;
                    database.query(qr, (err, results) => {
                        if (err) {
                            res.status(500).json({ message: err.message });
                        } else {
                            listTap = results.rows;
                            res.render('tap', { user: user, listTap: listTap, idPhim: req.params.idPhim });
                        }
                    });
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },















    getAddTap: async (req, res) => {
        try {
            let user = {};
            const qr0 = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`

            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    user = results.rows[0];
                    res.render('addtap', { user: user, idPhim: req.params.idPhim });
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    postAddTap: async (req, res) => {
        try {
            const { tentap, tapso, video } = req.body;
            const qr = `INSERT INTO tap (tentap, tapso, ngaycapnhat, idphim, video) 
                        VALUES ('${tentap}', ${tapso}, now(), ${req.params.idPhim}, '${video}')`
            database.query(qr, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    res.redirect(`/update-phim/${req.params.idPhim}/tap`);
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getUpdateTap: async (req, res) => {
        try {
            let user = {};
            let tap = {};
            const qr0 = `SELECT id, tentap, tapso, idphim, video FROM tap WHERE id = ${req.params.idTap}`;
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    tap = results.rows[0];
                    const qr1 = `SELECT id, email, tennguoidung, avatar FROM nguoidung WHERE id = ${global.idNguoiDung}`
                    database.query(qr1, (err, results) => {
                        if (err) {
                            res.status(500).json({ message: err.message });
                        } else if (results.rows.length > 0) {
                            user = results.rows[0];
                            res.render('updatetap', { user: user, tap: tap });
                        }
                    });
                }
            });

        } catch (error) {
            res.status(500).json(error);
        }
    },
    postUpdateTap: async (req, res) => {
        try {
            const { tentap, tapso, video, id } = req.body;
            const qr0 = `UPDATE tap SET tentap = '${tentap}', tapso = '${tapso}', video = '${video}', ngaycapnhat = now() WHERE id = ${id}`;
            database.query(qr0, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    res.redirect(`/update-phim/${req.params.idPhim}/tap`);
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

};
module.exports = controller;