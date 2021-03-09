require("dotenv").config();
const express = require("express");
const db = require("./db");
const cors = require("cors");

const app = express();
const morgan = require("morgan");

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

app.get("/api/v1/restaurants", async (req, res) => {
  try {
    //const results = await db.query("SELECT * FROM restaurants");
    const restaurantRatingData = await db.query(
      "SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating),1) AS average_rating FROM reviews GROUP BY restaurant_id) reviews on restaurants.id = reviews.restaurant_id"
    );

    res.status(200).json({
      status: "success",
      results: restaurantRatingData.rows.length,
      data: { restaurants: restaurantRatingData.rows },
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const restaurant = await db.query(
      "SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating),1) AS average_rating FROM reviews GROUP BY restaurant_id) reviews on restaurants.id = reviews.restaurant_id WHERE id=$1",
      [id]
    );

    const reviews = await db.query(
      "SELECT * FROM reviews WHERE restaurant_id=$1",
      [id]
    );

    res.status(200).json({
      status: "success",
      data: { restaurant: restaurant.rows[0], reviews: reviews.rows },
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/v1/restaurants", async (req, res) => {
  try {
    const { name, location, price_range } = req.body;
    const results = await db.query(
      "INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) RETURNING *",
      [name, location, price_range]
    );

    res.status(201).json({
      status: "success",
      data: { restaurant: results.rows[0] },
    });
  } catch (error) {
    console.log(error);
  }
});

app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, price_range } = req.body;
    const results = await db.query(
      "UPDATE restaurants SET name=$1, location=$2, price_range=$3 WHERE id=$4 RETURNING *",
      [name, location, price_range, id]
    );
    res.status(200).json({
      status: "success",
      data: { restaurant: results.rows[0] },
    });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM restaurants WHERE id=$1", [id]);
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  const { id } = req.params;
  const { name, review, rating } = req.body;
  try {
    const newReview = await db.query(
      "INSERT INTO reviews (restaurant_id,name,review,rating) VALUES($1,$2,$3,$4) RETURNING *",
      [id, name, review, rating]
    );
    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
