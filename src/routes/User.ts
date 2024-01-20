import express from "express";
import controller from "../controllers/User";
import { generateToken,authenticateToken } from '../utils/jwtUtils';

const router = express.Router();

router.post("/addUser", controller.createUser);
router.post("/userLogin", controller.userLogin);
router.get("/getUser/:userId", controller.getUser);
router.get("/getAllUsers", controller.getAllUsers);
router.patch("/updateUser/:userId", controller.updateUser);
router.delete("/deleteUser/:userId", controller.deleteUser);

export = router;
