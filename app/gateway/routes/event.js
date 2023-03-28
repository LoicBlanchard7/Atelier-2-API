const express = require("express");
const router = express.Router();
const axios = require("axios");
const join = require("joi");

router
    .route("/")
    .get(async (req, res, next) => {
        try {
            const authorization = req.headers.authorization.split(" ")[1];
            await axios
                .get(`http://node_auth:3000/auth/validate`, {
                    headers: { Authorization: `Bearer ${authorization}` },
                })

            let link = "http://node_event:3000" + req.originalUrl;
            const response = await axios.get(link)
            res.json(response.data);
        } catch (error) {
            res.sendStatus(error.response.status);
        }
    })
    .all(async (req, res, next) => {
        res.status(405).json({ code: 405, message: "Erreur 405 custom" });
    });

router
    .route("/:id")
    .get(async (req, res, next) => {
        try {
            const authorization = req.headers.authorization.split(" ")[1];
            await axios
                .get(`http://node_auth:3000/auth/validate`, {
                    headers: { Authorization: `Bearer ${authorization}` },
                })

            let link = "http://node_event:3000" + req.originalUrl;
            const response = await axios.get(link)
            res.json(response.data);
        } catch (error) {
            res.sendStatus(error.response.status);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const authorization = req.headers.authorization.split(" ")[1];
            await axios
                .get(`http://node_auth:3000/auth/validate`, {
                    headers: { Authorization: `Bearer ${authorization}` },
                })

            let link = "http://node_event:3000" + req.originalUrl;
            const response = await axios.delete(link)
            res.json(response.data);
        } catch (error) {
            res.sendStatus(error.response.status);
        }
    })
    .all(async (req, res, next) => {
        res.status(405).json({ code: 405, message: "Erreur 405 custom" });
    });


module.exports = router;
