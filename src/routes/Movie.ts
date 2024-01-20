import express from "express";
import controller from "../controllers/Movie";
import { generateToken,authenticateToken } from '../utils/jwtUtils';


const router = express.Router();

router.post("/addMovie",authenticateToken, controller.addMovie);
router.get("/",authenticateToken, controller.getAllMovies);
router.get("/search",authenticateToken, controller.searchMovie);
router.patch("/updateMovie/:mId",authenticateToken, controller.updateMovie);
router.delete("/deleteMovie/:mId",authenticateToken, controller.deleteMovie);

export = router;
