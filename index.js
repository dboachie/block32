const pg = require("pg");
const express = require("express");
const { Client } = require("pg");
const { WatchOutlined } = require("@mui/icons-material");
const client = new Client(
  "postgresql://dkb:Avt5000*@localhost:5432/the_acme_notes_db"
);
client.connect();
const app = express();
app.use(express.json());

app.get("/api/get-all-flavors", async (req, res, next) => {

  try {
    const flavors = await client.query(`
      SELECT * FROM flavors;`);

    res.status(201).json(flavors);
    
  } catch (err) {
    console.error("Couldnt fetch flavors", err);
    
    res.status(401).send({ messsage: "couldnt retrieve" });
  } 
});

app.get("/api/get-all-flavors/:id", async (req, res, next) => {

  try {
    const SQL = `
      SELECT * FROM flavors WHERE id=$1 
      
    `;
    // SELECT means return
    const response = await client.query(SQL, [req.params.id]);
    res.send(response.rows); 
    
  } catch (err) {
    next(err);
  } 
});

app.post("/api/get-all-flavors", async (req, res, next) => {
 const { name, is_fav } = req.body;

  try {
    const response = await client.query(`
    INSERT INTO flavors (name, is_favorite)
    VALUES ($1, $2)
    RETURNING *
    ;`, [name, is_fav]);

    res.send(response.rows[0]);
    
  } catch (err) {
    next(err);
  } 




});

// app.post("/api/get-all-flavors", async (req, res, next) => {
//   const {name, is_fav} = req.body;

// try {
//   const SQL = `
//     INSERT INTO flavors(name, is_favorite)
//     VALUES($1, $2)
//     RETURNING *
//   `
//   const response = await client.query(SQL, [name, is_fav]);
//   res.send(response.rows[0])
// } catch (err) {
//   next(err)
// }

// });







app.delete("/api/get-all-flavors/:id", async (req, res, next) => {

  try {
    const SQL = `
      DELETE FROM flavors
      WHERE id = $1
    `;
    const response = await client.query(SQL, [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  } 

});

app.put("/api/get-all-flavors/:id", async (req, res, next) => {

  try {
    const SQL = `
      UPDATE flavors
      SET id=$1, name=$2, is_favorite=$3
      WHERE id=$1 RETURNING *
    `;
    const response = await client.query(SQL, [

      req.params.id,
      req.body.name,
      req.body.is_favorite,
      
    ]);
    res.send(response.rows[0]);
  } catch (err) {
    next(err);
  } 
});

app.listen(3000, () => console.log("listening"));
