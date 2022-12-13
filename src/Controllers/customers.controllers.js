import connectionDB from "../Database/db.js";
import joi from "joi";

export async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const customersSchema = joi.object({
        name: joi.string().min(1).required(),
        phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/, 'numbers').required(),
        cpf: joi.string().length(11).pattern(/^[0-9]+$/, 'numbers').required(),
        birthday: joi.date().required()
    });

    try {
        const validation = customersSchema.validate({
            name,
            phone,
            cpf,
            birthday
        }, { abortEarly: false });

        if(validation.error){
            return res.sendStatus(400)
        }

        await connectionDB.query(
            `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
            [name, phone, cpf, birthday]);
        res.sendStatus(201);

    } catch (err) {
        res.status(400).send(err.message);
    }
}

export async function getCustomers(req, res) {
    try {
        const customers = await connectionDB.query(
            "SELECT * FROM customers"
        );
        res.send(customers);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomerbyID(req, res) {
    const { id } = req.params;

    try {
        const { rows } = await connectionDB.query(
            `SELECT * FROM customers WHERE id=$1;`,
            [id]);

        if (rows.length === 0) {
            return res.status(404).send("não existe cliente com esse id");
        }
        return res.send(rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function updateCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;
    const customersSchema = joi.object({
        name: joi.string().min(1).required(),
        phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/, 'numbers').required(),
        cpf: joi.string().length(11).pattern(/^[0-9]+$/, 'numbers').required(),
        birthday: joi.date().required()
    });

    try {
        const validation = customersSchema.validate({
            name,
            phone,
            cpf,
            birthday
        }, { abortEarly: false });

        if(validation.error){
            return res.sendStatus(400)
        }

        await connectionDB.query(
            `UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5`,
            [name, phone, cpf, birthday, id]);
        res.sendStatus(200);
        
    } catch (err) {
        res.status(500).send(err.message);
    }
}