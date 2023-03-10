var database = require('../database');

const apiController = {
    /// test
    getTessst: async (req, res) => {
        try {
            const qr = `INSERT INTO luotxem (idtap, idnguoidung) VALUES (4, 2)`;
            const result1 = await database.query(qr);
            console.log(result1);
            res.status(200).json(result1);
        } catch (error) {
            console.log("API error getTessst: ", error);
            res.status(500).json(error);
        }
    },




    addUser: async (req, res) => {
        try {
            const { email, matkhau } = req.body;
            const result1 = await database.query(`SELECT * FROM nguoidung WHERE email = '${email}' `);
            if (result1.rows.length > 0) {
                // email da dang ky
                res.status(200).json({ result: false });
            } else {
                await database.query(`INSERT INTO nguoidung (email, matkhau, tennguoidung, phanquyen) VALUES ('${email}', '${matkhau}', '', 1)`);
                res.status(200).json({ result: true });
            }
        } catch (error) {
            console.log("API error addUser: ", error);
            res.status(500).json(error);
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, matkhau } = req.body;
            const result1 = await database.query(`SELECT * FROM nguoidung WHERE email = '${email}' 0`);
            if (result1.rows.length > 0) {
                if (matkhau === result1.rows[0].matkhau) {
                    res.status(200).json({ result: true, data: result1.rows[0] });
                } else {
                    res.status(200).json({ result: false });
                }
            } else {
                res.status(200).json({ result: false });
            }
        } catch (error) {
            console.log("API error loginUser: ", error);
            res.status(500).json(error);
        }
    },

    updateUser: async (req, res) => {
        try {
            const { tennguoidung, avatar, id } = req.body;
            await database.query(`UPDATE nguoidung SET tennguoidung = '${tennguoidung}', avatar = '${avatar}' WHERE id = ${id}`);
            res.status(200).json({ result: true });
        } catch (error) {
            console.log("API error updateUser: ", error);
            res.status(500).json(error);
        }
    },

    updatePasswordUser: async (req, res) => {
        try {
            const { matkhau, id } = req.body;
            await database.query(`UPDATE nguoidung SET matkhau = '${matkhau}' WHERE id = ${id}`);
            res.status(200).json({ result: true });
        } catch (error) {
            console.log("API error updatePasswordUser: ", error);
            res.status(500).json(error);
        }
    },

    getAllPhim: async (req, res) => {
        try {
            const result1 = await database.query(`
            SELECT 
            phim.id,
            phim.tenphim, 
            phim.image,
            CASE 
                WHEN phim.dinhdang > 1 AND phim.phan > 0 THEN CONCAT('Season ', phim.phan::text)
                WHEN phim.chatluong = 1 THEN 'SD'
                ELSE 'HD'
            END AS phan_hoac_chatluong,
            CASE 
                WHEN trangthai = 2 AND dinhdang = 2 
                    THEN CONCAT('Full (', MAX(tap.tapso)::text, '/', phim.sotap::text, ')')
                ELSE (
                    SELECT tentap 
                    FROM tap 
                    WHERE tap.tapso = (
                        SELECT MAX(tap.tapso) 
                        FROM tap 
                        WHERE tap.idphim = phim.id
                    )
                    AND tap.idphim = phim.id
                )
            END AS thong_tin_tap
        FROM phim
        LEFT JOIN tap ON phim.id = tap.idphim 
        GROUP BY phim.id, phim.tenphim, phim.image, phim.sotap
        ORDER BY MAX(tap.ngaycapnhat) desc
          `);

            res.status(200).json({ data: result1.rows });
        } catch (error) {
            console.log("API error getAllPhim: ", error);
            res.status(500).json(error);
        }
    },

    getTop10Phim: async (req, res) => {
        try {
            const result1 = await database.query(`
            SELECT 
            phim.id,
            phim.tenphim, 
            phim.image,
            COUNT(DISTINCT luotxem.id) AS tongluotxem,
            CASE 
                WHEN dinhdang > 1 AND phan > 0 THEN CONCAT('Season ', phan::text)
                WHEN chatluong = 1 THEN 'SD'
                ELSE 'HD'
            END AS phan_hoac_chatluong,
            CASE 
                WHEN trangthai = 2 AND dinhdang = 2 
                    THEN CONCAT('Full (', MAX(tap.tapso)::text, '/', phim.sotap::text, ')')
                ELSE (
                    SELECT tentap 
                    FROM tap 
                    WHERE tap.tapso = (
                        SELECT MAX(tap.tapso) 
                        FROM tap 
                        WHERE tap.idphim = phim.id
                    )
                    AND tap.idphim = phim.id
                )
            END AS thong_tin_tap
        FROM phim
        LEFT JOIN tap ON phim.id = tap.idphim 
        LEFT JOIN luotxem ON tap.id = luotxem.idtap
        GROUP BY phim.id, phim.tenphim, phim.image, phim.sotap
        ORDER BY COUNT(DISTINCT luotxem.id) DESC LIMIT 10
          `);

            res.status(200).json({ data: result1.rows });
        } catch (error) {
            console.log("API error getTop10Phim: ", error);
            res.status(500).json(error);
        }
    },

    getOnePhimById: async (req, res) => {
        try {
            var id = req.params.id;
            const result1 = await database.query(`
            SELECT 
            phim.*,
            COUNT(DISTINCT luotxem.id) AS tongluotxem,
            COUNT(DISTINCT theodoi.id) AS tongtheodoi,
            COUNT(DISTINCT danhgia.id) AS tongdanhgia,
            AVG(danhgia.sosao)sosaotrungbinh, 
            MAX(tap.ngaycapnhat) AS ngaycapnhat,
            (
                SELECT json_agg(tap_info) 
                FROM (
                    SELECT id, tentap, tapso, ngaycapnhat, idphim, video 
                    FROM tap 
                    WHERE idphim = phim.id 
                    ORDER BY tapso DESC
                ) AS tap_info
            ) AS ds_tap,
            (
                SELECT json_agg(daodien_info) 
                FROM (
                    SELECT daodien.id, daodien.tendaodien
                    FROM ct_daodien 
                    INNER JOIN daodien ON daodien.id = ct_daodien.iddaodien
                    WHERE ct_daodien.idphim = phim.id 
                ) AS daodien_info
            ) AS ds_daodien,
            (
                SELECT json_agg(dienvien_info) 
                FROM (
                    SELECT dienvien.id, dienvien.tendienvien
                    FROM ct_dienvien
                    INNER JOIN dienvien ON dienvien.id = ct_dienvien.iddienvien
                    WHERE ct_dienvien.idphim = phim.id 
                    ORDER BY ct_dienvien.id
                ) AS dienvien_info
            ) AS ds_dienvien,
            (
                SELECT json_agg(theloai_info) 
                FROM (
                    SELECT theloai.id, theloai.tentheloai
                    FROM ct_theloai
                    INNER JOIN theloai ON theloai.id = ct_theloai.idtheloai
                    WHERE ct_theloai.idphim = phim.id 
                    ORDER BY theloai.tentheloai
                ) AS theloai_info
            ) AS ds_theloai,
            (
                SELECT json_agg(quocgia_info) 
                FROM (
                    SELECT quocgia.id, quocgia.tenquocgia
                    FROM ct_quocgia
                    INNER JOIN quocgia ON quocgia.id = ct_quocgia.idquocgia
                    WHERE ct_quocgia.idphim = phim.id 
                    ORDER BY quocgia.tenquocgia
                ) AS quocgia_info
            ) AS ds_quocgia
        FROM phim
        LEFT JOIN tap ON tap.idphim = phim.id
        LEFT JOIN luotxem ON luotxem.idtap = tap.id
        LEFT JOIN theodoi ON theodoi.idphim = phim.id
        LEFT JOIN danhgia ON danhgia.idphim = phim.id
        WHERE phim.id = ${id}
        GROUP BY phim.id;
            `);

            res.status(200).json({ result: true, data: result1.rows[0] });
        } catch (error) {
            console.log("API error getOnePhimById: ", error);
            res.status(500).json(error);
        }
    },


}
module.exports = apiController;
