import express, { Router } from "express";

const router: Router = express.Router();

import testRouter from "./test.routes";
import authRouter from "./auth/admin";

router.use("/", authRouter);


// testing routes
router.use("/test", testRouter);

export default router;
