const express = require("express");
const router = express.Router();
const knex = require("../db_connection");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

router
    .route("/")
    .get(async (req, res, next) => {
        try {
            const events = await knex('Event');

            if (!events) {
                res.status(404).json({ code: 404, message: error });
            } else {
                res.json({ events });
            }

        } catch (error) {
            res.status(500).json({ code: 500, message: error });
        }
    });

router.route('/:id')
    .get(async (req, res, next) => {
        try {
            const events = await knex('Event');
            let event = events.find(element => element.eid == req.params.id);

            if (!events) {
                res.status(404).json({ code: 404, message: error });
            } else {
                res.json({ event });
            }
        } catch (error) {
            next(error);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const events = await knex('Event').delete().where({ eid: req.params.id });

            if (!events) {
                res.status(404).json({ code: 404, message: error });
            } else {
                res.json("L'évenement avec l'id " + req.params.id + " a été supprimé.");
            }
        } catch (error) {
            next(error);
        }
    });
//
router.post("/createEvent",async (req, res, next) => {
        const schema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            date: Joi.string().required(),
            posX: Joi.number().required(),
            posY: Joi.number().required(),
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
                    uid: uuidv4()
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



module.exports = router;
