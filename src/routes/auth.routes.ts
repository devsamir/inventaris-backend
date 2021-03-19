import { Router } from "express";
import { login, cekJwt, logout } from "../controllers/auth.controller";
const router = Router();

router.post("/login", login);
router.post("/jwt", cekJwt);
router.post("/logout", logout);

export default router;
