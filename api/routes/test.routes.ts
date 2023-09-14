import express from "express";
const router = express.Router();
// const { testController } = require("../controllers/test.controller");

router.get("/", (req, res) => {
  console.log("heelo world")
  // testController.TestController(req, res);
});

export default router;