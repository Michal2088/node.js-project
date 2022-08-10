const express = require("express");
const joi = require("joi");
const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { urlencoded } = require("express");
const router = express.Router();

const loginSchema = joi.object({
  email: joi.string().required().min(10).max(1024).email(),
  password: joi.string().required().min(8).max(1024),
});

router.post("/", async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);
    let user=await User.findOne({email:req.body.email})
    if(!user) return res.status(400).send("invalid email or password")
    const result=await bcrypt.compare(req.body.password,user.password)
    if(!result) res.status(400).send("invalid email or password")
    const genToken=jwt.sign({_id:user._id,biz:user.biz},process.env.secretKey)
    res.status(200).send({token:genToken})
  } catch (error) {
    res.status(400).send("error in login");
  }
});

module.exports = router;
