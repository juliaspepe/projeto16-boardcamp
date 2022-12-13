import connectionDB from "../Database/db.js";

export async function postGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        await connectionDB.query(
            `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`,
            [name, image, stockTotal, categoryId, pricePerDay]);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getGames(req, res) {
    try {
        const games = await connectionDB.query(
            "SELECT * FROM games"
        );
        res.send(games);
    } catch (err) {
        res.status(500).send(err.message);
    }
}