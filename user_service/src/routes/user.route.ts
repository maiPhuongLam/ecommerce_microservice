import express from "express";

const router = express.Router();

router.post("/login");
router.post("/register");
router.post("/address");
router.get("/profile");
router.get("/order-details");
router.get("/wishlist");

export default router;
