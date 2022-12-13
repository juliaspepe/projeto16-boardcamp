import connectionDB from "../Database/db.js";
import dayjs from "dayjs";
import joi from "joi";

export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const rentDate = dayjs().format('DD-MM-YYYY');
    const rentalsSchema = joi.object({
        customerId: joi.number().min(1).required(),
        gameId: joi.number().min(1).required(),
        daysRented: joi.number().min(1).required()
    });

    try {
        const validation = rentalsSchema.validate({
            customerId,
            gameId,
            daysRented
        }, { abortEarly: false });

        if (validation.error) {
            return res.sendStatus(400);
        }

        const customer = await connectionDB.query(
            `SELECT * FROM customers WHERE id=$1`, [customerId]);

        const rent = await connectionDB.query(
            `SELECT * FROM games WHERE id=$1`, [gameId]);

        if (customer.rowCount === 0 || rent.rowCount === 0) {
            return res.sendStatus(400);
        }

        if (daysRented <= 0) {
            return res.sendStatus(400);
        }

        const originalPrice = daysRented * rent.rows[0].pricePerDay;

        await connectionDB.query(
            `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [customerId, gameId, rentDate, daysRented, null, originalPrice, null]);
        res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function getRentals(req, res) {
    try {
        const rental = await connectionDB.query(
            "SELECT * FROM rentals"
        );
        res.send(rental);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function postRentalsReturned(req, res) {
    const { id } = req.params;
    const date = dayjs().format('YYYY-MM-DD');

    try {
        const customer = await connectionDB.query(
            `SELECT * FROM customers WHERE id=$1`, [id]);

        const rent = await connectionDB.query(
            `SELECT * FROM rentals WHERE id=$1`, [id]);

        if (customer.rowCount === 0 || rent.rowCount === 0) {
            return res.sendStatus(400);
        }

        await connectionDB.query(
            `UPDATE rentals SET "returnDate"=$1 WHERE id=$2`,
            [date, id]);

        res.sendStatus(201);

    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function removeRentalbyID(req, res) {
    const { id } = req.params;

    try {
        await connectionDB.query("DELETE FROM rentals WHERE id=$1", [id]);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}