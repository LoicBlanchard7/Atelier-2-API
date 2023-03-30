const express = require("express");
const router = express.Router();
const axios = require("axios");
const Joi = require("joi");

router.get("/", async (req, res, next) => {
        try {
            if(!req.headers["authorization"]){
                return res.sendStatus(401);
            }
            const authorization = req.headers["authorization"].split(" ")[1];
            console.log("ici1");
            await axios.get(`http://node_auth:3000/auth/validate`, {
                    headers: { Authorization: `Bearer ${authorization}` },
                })
            console.log("ici2");
            let link = "http://node_event:3000" + req.originalUrl;
            const response = await axios.get(link)
            res.json(response.data);
        } catch (error) {
            if(!error.response){
                res.sendStatus(500);
            }else{
                res.sendStatus(error.response.status);
            }
        }
    });

router.get("/getEvent/:id", async (req, res, next) => {
    try {
        if(!req.headers["authorization"]){
                return res.sendStatus(401);
        }
        const authorization = req.headers["authorization"].split(" ")[1];
        await axios
            .get(`http://node_auth:3000/auth/validate`, {
                headers: { Authorization: `Bearer ${authorization}` },
            })

        let link = "http://node_event:3000" + req.originalUrl;
        const response = await axios.get(link)
        res.json(response.data);
    } catch (error) {
        if(!error.response){
                res.sendStatus(500);
            }else{
                res.sendStatus(error.response.status);
            }
    }
});

router.delete("/deleteEvent/:id", async (req, res, next) => {
    try {
        if(!req.headers["authorization"]){
            return res.sendStatus(401);
        }
        const authorization = req.headers["authorization"].split(" ")[1];
        await axios
            .get(`http://node_auth:3000/auth/validate`, {
                headers: { Authorization: `Bearer ${authorization}` },
            })

        let link = "http://node_event:3000" + req.originalUrl;
        console.log(link);
        const response = await axios.delete(link)
        res.json(response.data);
    } catch (error) {
         if(!error.response){
                res.sendStatus(500);
            }else{
                res.sendStatus(error.response.status);
            }
    }
});

router.post("/createEvent", async (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        date: Joi.string().required(),
        posX: Joi.number().required(),
        posY: Joi.number().required(),
        uid: Joi.string().required(),   
    });
    const { error, value } = schema.validate(req.body);
    if (!error) {
        try {
            if(!req.headers["authorization"]){
                console.log(req.headers["authorization"]);
                return res.sendStatus(401);
            }
            const authorization = req.headers["authorization"].split(" ")[1];
            const userid = await axios.get(`http://node_auth:3000/auth/validate`, {
                    headers: { Authorization: `Bearer ${authorization}` },
                })

            let link = "http://node_event:3000" + req.originalUrl;

            const response = await axios.post(link, {
                title: value.title,
                description: value.description,
                date: value.date,
                posX: value.posX,
                posY: value.posY,
                uid: value.uid,
            })
            res.json(response.data);
        } catch (err) {
            // Si une erreur est survenue lors de l'execution, on renvoie une erreur 500
             if(!err.response){
                res.sendStatus(500);
            }else{
                res.sendStatus(err.response.status);
            }
        }
    } else {
        // Si une erreur de validation du body est survenue, on renvoie une erreur 400
        res.sendStatus(400);
    }
});

//router pour récupérer les événements crée par un utilisateur
router.get("/getEventByUser/:uid", async (req, res, next) => {  
    try {
        if(!req.headers["authorization"]){
            return res.sendStatus(401);
        }
        const authorization = req.headers["authorization"].split(" ")[1];
        await axios
            .get(`http://node_auth:3000/auth/validate`, {
                headers: { Authorization: `Bearer ${authorization}` },
            })


        let link = "http://node_event:3000" + req.originalUrl;
        const response = await axios.get(link)
        res.json(response.data);
    } catch (error) {
        if(!error.response){
                res.sendStatus(500);
            }else{
                res.sendStatus(error.response.status);
            }
    }
});


router.all("/createEvent", async (req, res, next) => {
    res.status(405).json({
        type: "error",
        error: 405,
        message: "Requête non authorisée",
    });
});

router.all("/", async (req, res, next) => {
    res.status(405).json({
        type: "error",
        error: 405,
        message: "Requête non authorisée",
    });
});

router.all("/:id", async (req, res, next) => {
    res.status(405).json({
        type: "error",
        error: 405,
        message: "Requête non authorisée",
    });
});

module.exports = router;
