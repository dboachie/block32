const pg = require("pg");
const express = require("express");
const { Client } = require("pg");
const client = new Client(
  "postgresql://dkb:Avt5000*@localhost:5432/the_acme_notes_db"
);
const app = express();
app.use(express.json());

app.get("/api/get-all-flavors", async (req, res, next) => {
  await client.connect();
  try {
    const flavors = await client.query(`
      SELECT * FROM flavors;`);

    res.status(201).json(flavors);
    await client.end();
  } catch (err) {
    console.error("Couldnt fetch flavors", err);
    await client.end();
    res.status(401).send({ messsage: "couldnt retrieve" });
  }
});

app.listen(3000, () => console.log("listening"));
