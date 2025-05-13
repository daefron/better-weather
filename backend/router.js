import { Router } from "express";
import { postManual, postAuto } from "./controller.js";

const mainRouter = Router();

mainRouter.post("/manual", postManual);
mainRouter.post("/auto", postAuto);

export default mainRouter;
