const express = require("express");
const router = express.Router();
const knex = require("../db_connection");
const Joi = require("joi");


//Route pour récupérer tous les participants
router.get("/", async (req, res, next) => {
    try {
        const participants = await knex("Participant");
    
        if (!participants) {
        res.status(404).json({ code: 404, message: error });
        } else {
        res.json({ participants });
        }
    } catch (error) {
        res.status(500).json({ code: 500, message: error });
    }
});

//Route pour récupérer tous les participants d'un événement
router.get("/event/:eid", async (req, res, next) => {

    const schema = Joi.object({
        eid: Joi.string().required(),
    });

    const { error , value } = schema.validate(req.params);

    if(!error){
    try {
        const participants = await knex("Participant").where({ eid: value.eid });
        if (!participants) {
        res.status(404).json({ code: 404, message: error });
        } else {
        res.json({ participants });
        }
    } catch (error) {
        res.status(500).json({ code: 500, message: error });
    }
    }else{
        res.status(400).json({ code: 400, message: error });
    }
});


//Route pour récupérer tous les événements d'un participant
router.get("/user/:uid", async (req, res, next) => {
    
        const schema = Joi.object({
            uid: Joi.string().required(),
        });
    
        const { error , value } = schema.validate(req.params);
    
        if(!error){
        try {
            const participants = await knex("Participant").where({ uid: value.uid });
            let events = [];
            for (let i = 0; i < participants.length; i++) {
                const event = await knex("Event").where({ eid: participants[i].eid });
                let eventObj = {
                    "event" : event[0],
                    "status": participants[i].status
                }
                events.push(eventObj);
            }
            res.json({ events });
        } catch (error) {
            res.status(500).json({ code: 500, message: error });
        }
        }else{
            res.status(400).json({ code: 400, message: error });
        }
    });

//Route pour ajouter un participant à un événement
router.post("/add", async (req, res, next) => {
    const schema = Joi.object({
        uid: Joi.string().required(),
        eid: Joi.string().required(),
        name: Joi.string().required(),
        firstname: Joi.string().required(),
    });

    const { error , value } = schema.validate(req.body);
    if(!error){
        try {
            const partExist = await knex("Participant").where({ uid: value.uid, eid: value.eid });

            const partAndEvenetExist = partExist.find(element => element.eid === value.eid);
            if(partAndEvenetExist ){
                res.status(409).json({ code: 409, message: "Participant already exists" });
            }else{  
                const participants = await knex("Participant").insert({ uid: value.uid, eid: value.eid, name: value.name,firstname:value.firstname, status: "pending"  });
                res.json({ participants });
            }
        } catch (error) {
            res.status(500).json({ code: 500, message: error });
        }
    }else{
        res.status(400).json({ code: 400, message: error });
    }
});

//Route pour qu'un participant accepte un événement
router.put("/accept", async (req, res, next) => {
    const schema = Joi.object({
        uid: Joi.string().required(),
        eid: Joi.string().required(),
        status : Joi.string().required(),
    });

    const { error , value } = schema.validate(req.body);

    if(!error){
    try {
        const participants = await knex("Participant").update({ status: value.status}).where({ uid: value.uid, eid: value.eid});
        res.json({ participants });
    } catch (error) {
        res.status(500).json({ code: 500, message: error });
    }
    }else{
        res.status(400).json({ code: 400, message: error });
    }
});

router.post("/comment/add", async (req, res, next) => {
    const schema = Joi.object({
        uid : Joi.string().required(),
        eid: Joi.string().required(),
        content : Joi.string().required(),
    });

    const { error , value } = schema.validate(req.body);   

    if(!error){
        try {
            const comments = await knex("Comment").insert({ uid: value.uid, eid: value.eid, content: value.content });
            res.json({ comments });
        } catch (error) {   
            res.status(500).json({ code: 500, message: error });
        }
    }else{
        res.status(400).json({ code: 400, message: error });
    }
}); 

router.get("/comment/:eid", async (req, res, next) => {
    const schema = Joi.object({
        eid: Joi.string().required(),
    });

    const { error , value } = schema.validate(req.params);

    if(!error){
        try {
            const comments = await knex("Comment").where({ eid: value.eid });
            res.json({ comments });
        } catch (error) {
            res.status(500).json({ code: 500, message: error });
        }
    }else{
        res.status(400).json({ code: 400, message: error });
    }
});



//

module.exports = router;