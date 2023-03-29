const express = require("express");
const router = express.Router();
const axios = require("axios");
const Joi = require("joi");

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