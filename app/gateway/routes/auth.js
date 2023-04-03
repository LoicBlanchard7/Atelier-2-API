const axios = require("axios");
const express = require("express");
const router = express.Router();
const Joi = require("joi");


//Route pour créer un utilisateur
router.post("/signup", async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    firstname: Joi.string().min(1).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });
  const { error, value } = schema.validate(req.body);

  if (!error) {
    try {
      const user = await axios.post("http://node_auth:3000/auth/signup", {
        name: value.name,
        firstname: value.firstname,
        email: value.email,
        password: value.password,
      });

      res.json(user.data);
    } catch (err) {
       if(!err.response){
          res.sendStatus(500);
        }else{
            res.sendStatus(err.response.status);
        }
    }
  } else {
    res.sendStatus(400);
  }
});

//Route pour se connecter
router.post("/signin", async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  const { error, value } = schema.validate(req.body);

  // Si aucune erreur de validation du body, on continue
  if (!error) {
    try {
      const user = await axios.post("http://node_auth:3000/auth/signin", {
        email: value.email,
        password: value.password,
      });
        res.json(user.data);
     
    } catch (err) {
         if(!err.response){
            res.sendStatus(500);
          }else{
            res.sendStatus(err.response.status);
          }
    }
  } else {
    res.sendStatus(400);
  }
});

router.get("/userId/:id",async (req, res, next) =>{
  try{
    const user = await axios.get("http://node_auth:3000/auth/userId/"+req.params.id);
    res.json(user.data);
  }catch(err){
    if(!err.response){
      res.sendStatus(500);
    }else{
      res.sendStatus(err.response.status);
    }
  }
});

router.put("/updateUser", async (req, res, next) => {
  const schema = Joi.object({
    uid: Joi.string().required(),
    firstname: Joi.string().min(1).max(50).required(),
    name: Joi.string().min(1).max(50).required(),
    password: Joi.string().min(8).required(),
  });
  const { error, value } = schema.validate(req.body);

  if (!error) {
    try {
      const user = await axios.put("http://node_auth:3000/auth/updateUser", {
        uid : value.uid,
        name: value.name,
        firstname: value.firstname,
        password: value.password,
      });

      res.json(user.data);
    } catch (err) {
       if(!err.response){
          res.sendStatus(500);
        }else{
            res.sendStatus(err.response.status);
        }
    }
  } else {
    res.sendStatus(400);
  }
});

router.get("/" , async (req, res, next) => {
  try{
     if(!req.headers["authorization"]){
                return res.sendStatus(401);
            }
            const Authorization = req.headers["authorization"].split(" ")[1];
            await axios
                .get(`http://node_auth:3000/auth/validate`, {
                    headers: { Authorization: `Bearer ${Authorization}` },
                })
    const users = await axios.get("http://node_auth:3000/auth/");
    res.json(users.data);
  }catch(err){
    if(!err.response){
      res.sendStatus(500);
    }else{
      res.sendStatus(err.response.status);
    }
  }
}); 

router.all("/signup", async (req, res, next) => {
  res.status(405).json({
    type: "error",
    error: 405,
    message: "Requête non authorisée",
  });
});

router.all("/signin", async (req, res, next) => {
  res.status(405).json({
    type: "error",
    error: 405,
    message: "Requête non authorisée",
  });
});

module.exports = router;
