import { Router } from "express";
import { createUser, getAllUser, deleteUser, getOneUser } from "../controllers/user.controller";
// import { protect } from "../controllers/auth.controller";
const router = Router();

router.get("/", getAllUser);
router.post("/", createUser);
router.get("/:id", getOneUser);
router.delete("/:id", deleteUser);

export default router;
