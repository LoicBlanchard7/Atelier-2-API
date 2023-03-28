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
            console.log(error);
            res.status(500).json({ code: 500, message: error });
        }
    })
    .all(async (req, res, next) => {
        res.status(405).json({ code: 405, message: "Error" });
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
            console.error(error);
            next(error);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const events = await knex('Event').delete().where({ eid: req.params.id });

            if (!events) {
                res.status(404).json({ code: 404, message: error });
            } else {
                res.json("L'évenement avec l'id " + req.params.id + "a été supprimé.");
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    })
    .all(async (req, res, next) => {
        res.status(405).json({ code: 405, erreur: "Error" });
    });

router
    .post("/createEvent", async (req, res, next) => {
        try {
            console.log("Event");

            const { title, description, dateEvent, posX, posY } = req.body;

            const date = new Date(`${dateEvent.date} ${dateEvent.time}`);

            const schema = Joi.object({
                title: Joi.string().required(),
                description: Joi.string().required(),
                date: Joi.date().required(),
                posX: Joi.number().required(),
                posY: Joi.number().required(),
            });

            const { error, value } = schema.validate({
                title: title,
                description: description,
                date: date,
                posX: posX,
                posY: posY,
            });

            if (error) {
                res
                    .status(404)
                    .json({ code: 404, message: error });
                return;
            }

            const newID = uuidv4();

            const event = await knex("Event").insert({
                eid: newID,
                Title: title,
                description: description,
                date: date,
                PosX: posX,
                PosY: posY,
            });

            const toReturn = {
                eid: newID,
                Title: title,
                description: description,
                date: date,
                PosX: posX,
                PosY: posY,
            };

            res.json({ event: toReturn });
        } catch (error) {
            res.status(500).json({ code: 500, message: error });
        }
    })
    .all(async (req, res, next) => {
        res.status(405).json({ code: 405, message: "Error" });
    });



module.exports = router;
