const express = require("express");
const router = express.Router();
const axios = require("axios");
const Joi = require("joi");

//route qui permet de récupérer tous les événements d'un participant
router.get("/user/:id", async (req, res, next) => {

    const schema = Joi.object({
        id: Joi.string().required(),
    }); 

    const { error, value } = schema.validate(req.params);

    if(!error){
        try {
            if(!req.headers["authorization"]){
                return res.sendStatus(401);
            }
            const Authorization = req.headers["authorization"].split(" ")[1];
            await axios
                .get(`http://node_auth:3000/auth/validate`, {
                    headers: { Authorization: `Bearer ${Authorization}` },
                })

            let link = "http://node_event:3000" + req.originalUrl;
            const response = await axios.get(link)

            let resTab = []

            if( response.data.events.length == 0){
                res.json(resTab);
            }
            for(let i = 0; i < response.data.events.length; i++){
                let event = response.data.events[i].event;
                console.log(event);
                let creator = await axios.get("http://node_auth:3000/auth/userId/" + event.uid);
                console.log(response.data.events[i].status);

                resTab.push({
                    event : event,
                    status : response.data.events[i].status,
                    creator : creator.data.user.name + " " + creator.data.user.firstname
                })
            }
            console.log("ici");
            res.json(resTab);
        }
        catch (error) {
             if(!error.response){
                res.sendStatus(500);
            }else{
                res.sendStatus(error.response.status);
            }
        }
    }else{
        res.sendStatus(400);
    }
});

//route qui permet de recupérer tous les participants d'un evenement
router.get("/event/:id", async (req, res, next) => {
    
        const schema = Joi.object({
            id: Joi.string().required(),
        }); 
    
        const { error, value } = schema.validate(req.params);
    
        if(!error){
            try {
                if(!req.headers["authorization"]){
                    return res.sendStatus(401);
                }
                const Authorization = req.headers["authorization"].split(" ")[1];
                await axios
                    .get(`http://node_auth:3000/auth/validate`, {
                        headers: { Authorization: `Bearer ${Authorization}` },
                    })
    
                let link = "http://node_event:3000" + req.originalUrl;
                const response = await axios.get(link)
                res.json(response.data);
            }
            catch (error) {
                if(!error.response){
                    res.sendStatus(500);
                }else{
                    res.sendStatus(error.response.status);
                }
            }
        }else{
            res.sendStatus(400);
        }
    }  
);

router.post("/add", async (req, res, next) => {
    const schema = Joi.object({
        uid: Joi.string().required(),
        eid: Joi.string().required(),
        name: Joi.string().required(),
        firstname: Joi.string().required(),
    });

     const { error, value } = schema.validate(req.body);

        if(!error){
            try {
                if(!req.headers["authorization"]){
                    return res.sendStatus(401);
                }
                const Authorization = req.headers["authorization"].split(" ")[1];
                await axios
                    .get(`http://node_auth:3000/auth/validate`, {
                        headers: { Authorization: `Bearer ${Authorization}` },
                    })

                let link = "http://node_event:3000" + req.originalUrl;
                const response = await axios.post(link ,{ uid: value.uid, eid: value.eid, name: value.name, firstname: value.firstname})
                res.json(response.data);
            }
            catch (error) {
                if(!error.response){
                    res.sendStatus(500);
                }else{
                    res.sendStatus(error.response.status);
                }
            }
        }else{
            res.sendStatus(400);
        }
    
});

router.put("/accept", async (req, res, next) => {
    const schema = Joi.object({
        uid: Joi.string().required(),
        eid: Joi.string().required(),
        status: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);

    if(!error){
        try {
            if(!req.headers["authorization"]){
                return res.sendStatus(401);
            }
            const Authorization = req.headers["authorization"].split(" ")[1];
            await axios
                .get(`http://node_auth:3000/auth/validate`, {
                    headers: { Authorization: `Bearer ${Authorization}` },
                })

            let link = "http://node_event:3000" + req.originalUrl;

            const response = await axios.put(link ,{ uid: value.uid, eid: value.eid, status: value.status})

            res.json(response.data);

        }catch(error){
            if(!error.response){
                res.sendStatus(500);
            }else{
                res.sendStatus(error.response.status);
            }
        }
    }else{  
        res.sendStatus(400);
    }
});

router.post("/comment/add", async (req, res, next) => {
    const schema = Joi.object({
        uid: Joi.string().required(),
        eid: Joi.string().required(),
        content: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body); 

    if(!error){
        try {
            let link = "http://node_event:3000" + req.originalUrl;
            const response = await axios.post(link ,{ uid: value.uid, eid: value.eid, content: value.content});
            res.json(response.data);
        }
        catch (error) {
            if(!error.response){
                res.sendStatus(500);
            }else{
                res.sendStatus(error.response.status);
            }
        }
    }else{
        res.sendStatus(400);
    }
});

router.get("/comment/:eid", async (req, res, next) => {
    const schema = Joi.object({
        eid: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.params);

    if(!error){
        try {
            let link = "http://node_event:3000" + req.originalUrl;
            const response = await axios.get(link)
            res.json(response.data);
        }
        catch (error) {
            if(!error.response){
                res.sendStatus(500);
            }else{
                res.sendStatus(error.response.status);
            }   
        }
    }else{
        res.sendStatus(400);
    }
});





module.exports = router;