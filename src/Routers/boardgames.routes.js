import { Router } from "express";

import { 
    postCategories,
    getCategories,
} from "../Controllers/categories.controllers.js"

import {
    postGames,
    getGames
} from "../Controllers/games.controllers.js"

import {
    postRentals,
    getRentals,
    postRentalsReturned,
    removeRentalbyID
} from "../Controllers/rentals.controllers.js"

import {
    postCustomers,
    getCustomers,
    getCustomerbyID,
    updateCustomers
} from "../Controllers/customers.controllers.js"

const router = Router();

router.post("/categories", postCategories);
router.get("/categories", getCategories);
router.post("/games", postGames);
router.get("/games", getGames);
router.post("/customers", postCustomers);
router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerbyID);
router.patch("/customers/:id", updateCustomers);
router.post("/rentals", postRentals);
router.get("/rentals", getRentals);
router.post("/rentals/:id/return", postRentalsReturned);
router.delete("/rentals/:id", removeRentalbyID);

export default router;