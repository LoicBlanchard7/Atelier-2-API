const express = require("express");
const router = express.Router();
const knex = require("../db_connection");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

router.get("/", async (req, res, next) => {
    try {
        const events = await knex('Event');
        res.json({ events });
    } catch (error) {
       res.sendStatus(500);
    }
});

router.get("/:id", async (req, res, next) => {
    const schema = Joi.object({
        eid: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.params);
    if(!error){
        try {
            const events = await knex('Event').where('eid', value.eid);
            res.json({ events });
        } catch (error) {
            res.sendStatus(500);
        }
    }else{
        res.sendStatus(400);
    }
});

router.delete("/:id", async (req, res, next) => {
    const schema = Joi.object({
        eid: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.params);
    console.log(value);
    console.log(error);
    if(!error){
        try {
            await knex('Event').where('eid', value.eid).del();
            res.sendStatus(200);
        } catch (error) {   
            res.sendStatus(500);
        }
    }else{
        res.sendStatus(400);    
    }
});

router.post("/createEvent",async (req, res, next) => {
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
            try{
                await knex
                .insert({
                    eid: uuidv4(),
                    Title: value.title,
                    description: value.description,
                    date: new Date(value.date),
                    PosX: value.posX,
                    PosY: value.posY,
                    //A changé en fonction de l'utilisateur connecté
                    uid: value.uid,
                })
                .into("Event");
                // On retourne un message de succès
                res.status(201).json({
                    type: "success",
                    error: null,
                    message: "Evènement créé",
                });
            }catch(err){
                // Si une erreur est survenue lors de l'execution, on renvoie une erreur 500
                res.sendStatus(500); 
            }
        }else{
            // Si une erreur de validation du body est survenue, on renvoie une erreur 400
            res.sendStatus(400);
        }
    });

router.all("/", (req, res, next) => {
    res.status(405).json({ code: 405, message: "Method not allowed" });
});

router.all("/createEvent", (req, res, next) => {
    res.status(405).json({ code: 405, message: "Method not allowed" });
}); 

router.all("*", (req, res, next) => {
    res.status(404).json({ code: 404, message: "Not found" });
});

module.exports = router;
