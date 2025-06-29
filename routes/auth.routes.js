const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const {
  registerValidationRules,
  loginValidationRules,
  validate
} = require("../middleware/validation.middleware");


router.post("/register", registerValidationRules, validate, register);
router.post("/login", loginValidationRules, validate, login);


module.exports = (app) => {
  app.use("/api/auth", router);
};
