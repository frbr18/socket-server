const express = require("express");
const router = express.Router();
const dsn = "mongodb://localhost:27017";
const mongodb = require("mongodb");


router.get("/messages", async (req, res) => {
    try {
        const msgCol = await getCollection("message");
        const result = await msgCol.find({}).toArray();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete("/messages/delete", async (req, res) => {
    try {
        const msgCol = await getCollection("message");
        await msgCol.deleteMany();
        res.status(201).json({
            message: "data deleted"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post("/messages/add", async (req, res) => {
    try {
        const msgCol = await getCollection("message");
        await msgCol.insertOne({
            messages: req.body.messages
        });
        res.status(201).json({
            messages: req.body.messages
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

async function getCollection(colName) {
    const client = await mongodb.MongoClient.connect(dsn, { useNewUrlParser: true });

    return client.db('socketMsg').collection(colName);
}

module.exports = router;