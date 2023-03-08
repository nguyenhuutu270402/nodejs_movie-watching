var database = require('../database');

const apiController = {
    addUser: async (req, res) => {
        try {
            const { email, matkhau } = req.body;
            database.query("INSERT INTO nguoidung (email, matkhau, tennguoidung, phanquyen) VALUES (?, ?, '', '1')", [email, matkhau], (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    res.status(200).json({ insertId: results.insertId });
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, matkhau } = req.body;
            const qr = `SELECT * FROM nguoidung WHERE email = '${email}'`;
            database.query(qr, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else if (results.rows.length > 0) {
                    const result = results.rows[0];
                    if (result) {
                        if (result.matkhau === matkhau) {
                            res.status(200).json({
                                success: true,
                                results: result,
                            });
                        } else {
                            res.status(200).json({
                                success: false,
                                message: 'Tài khoản hoặc mật khẩu không đúng',
                            });
                        }
                    } else {
                        res.status(200).json({
                            success: false,
                            message: 'Tài khoản hoặc mật khẩu không đúng',
                        });
                    }
                } else {
                    res.status(200).json({
                        success: false,
                        message: 'Tài khoản hoặc mật khẩu không đúng',
                    });
                }

            });
        } catch (error) {
            res.status(500).json(error);
        }
    },





    getAllPhim: async (req, res) => {
        try {
            qr = `SELECT phim.*, 
            (
              SELECT json_agg(tap_info) 
              FROM (
                SELECT id, tentap, tapso, ngaycapnhat, idphim, video 
                FROM tap 
                WHERE idphim = phim.id 
                ORDER BY tapso desc
                LIMIT 3
              ) AS tap_info
            ) AS ds_tap
     FROM phim
     `;
            database.query(qr, (err, results) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    res.status(200).json({ results: results.rows });
                }
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },






}
module.exports = apiController;
