const express = require("express");
const router = express.Router();
const dsn = "mongodb://localhost:27017";
const mongodb = require("mongodb");

// Get the current messages
router.get("/", async (req, res) => {
    try {
        // Get the message collection
        const msgCol = await getCollection("message");
        // Get the data from collection
        const result = await msgCol.find({}).toArray();
        // Sends the data
        res.status(201).json(result);
    } catch (err) {
        // Sends the error message
        res.status(500).json(err);
    }
});

// Get messeage from a socket user
router.get("/message/:email", async (req, res) => {
    const email = req.params.email;
    try {
        const msgCol = await getCollection("message");
        const result = await msgCol.findOne({ user: email });

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Removes the old messages and adds the new ones
router.post("/add", async (req, res) => {
    // Get the requested data
    const email = req.body.email;
    const messages = req.body.messages;
    try {
        // Get the collection
        const msgCol = await getCollection("message");
        // Deletes the current messages
        await msgCol.deleteOne({ user: email });
        // Inserts the new messages
        await msgCol.insertOne({
            user: email,
            messages: messages
        });
        // Return the new data
        res.status(201).json({
            user: email,
            messages: messages
        });
    } catch (err) {
        // Print the error message
        console.log(err);
        res.status(500).json(err)
    }
});

async function getCollection(colName) {
    // Connect to database
    const client = await mongodb.MongoClient.connect(dsn, { useNewUrlParser: true });
    // Return the collection
    return client.db('socketMsg').collection(colName);
}

module.exports = router;