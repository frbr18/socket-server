// Setup the mongodb database
const mongo = require("mongodb");
const dsn = "mongodb://localhost:27017";
const cors = require('cors');
const bodyParser = require('body-parser');

// Setup the express router
const port = 1337;
const express = require("express");
const app = express();

app.options('*', cors());
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



app.get("/", (req, res) => {
    res.send("Test the route");
});

app.get("/list", async (req, res) => {
    try {
        let mumins = await findInCollection(dsn);

        res.send(await mumins.find({}).toArray());
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});

app.post("/mumin/add", async (req, res) => {
    const mumins = await findInCollection(dsn);
    try {
        console.log(req.body);
        await mumins.insertOne({
            name: req.body.name,
            createdAt: new Date()
        });
        res.status(201).json({
            name: req.body.name,
            createdAt: new Date()
        });
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});

app.delete("/mumin/delete", async (req, res) => {
    const mumins = await findInCollection(dsn);
    try {
        await mumins.deleteMany();
        // await mumins.deleteOne({ _id: new mongo.ObjectID(req.params.id) });
        res.status(200).json({
            msg: "object deleted"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: err
        });
    }

});

app.listen(port, () => {
    console.log(`Server is listening in port ${port}`);
    console.log(`The DSN is: ${dsn}`);
});


async function findInCollection(DSN) {
    const client = await mongo.MongoClient.connect(DSN, { useNewUrlParser: true });

    return client.db('mumin').collection("crowds");
}