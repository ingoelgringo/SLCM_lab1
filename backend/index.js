import express from "express";
import path from "path";
import dotenv from "dotenv";
import { Client } from "pg";

const app = express();

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

client.connect();
app.use(express.json());
app.use(express.static(path.join(path.resolve(), "dist")));

app.get("/api/users", async (_request, response) => {
  try {
    const { rows } = await client.query(`
    SELECT u.userName, u.userId, t.slot, t.slotId
    FROM userInfo u
    LEFT JOIN timeSlot t ON u.timeSlot_id=t.slotId
    ORDER BY u.userName ASC;
    `);

    response.json(rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/api/schedule", async (_request, response) => {
  try {
    const { rows } = await client.query(`
    SELECT * FROM timeSlot
    `);

    response.json(rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/api/book", async (request, response) => {
  const { timeSlot, user } = request.query;

  try {
    const data = await client.query(
      `
    UPDATE userInfo SET timeSlot_id=$1 WHERE userId=$2;`,
      [timeSlot, user]
    );

    response.send(data);
  } catch (err) {
    console.error(err);
  }
});

app.get("/api/unbook", async (request, response) => {
  const { user } = request.query;

  try {
    const data = await client.query(
      `
    UPDATE userInfo SET timeSlot_id=null WHERE userId=$1;`,
      [user]
    );

    response.send(data);
  } catch (err) {
    console.error(err);
  }
});

app.delete("/api/deleteUser", async (request, response) => {
  const { user } = request.query;

  try {
    const data = await client.query(
      `
    DELETE FROM userInfo WHERE userId=$1;`,
      [user]
    );

    response.send(data);
  } catch (err) {
    console.error(err);
  }
});

app.post("/api/addUser", async (request, response) => {
  const { name } = request.body;

  try {
    const data = await client.query(
      `
    INSERT INTO userInfo(userName) VALUES ($1)`,
      [name]
    );

    response.send(data);
  } catch (err) {
    console.error(err);
  }
});

app.listen(3000, () => {
  console.log("Redo på http://localhost:3000/");
});
