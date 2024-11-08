let express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

let app = express();
let PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let db;
(async () => {
  db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database,
  });
})();

//1

// Async function to get all restaurants
async function getAllRestaurants() {
  const query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

// Route to fetch all restaurants
app.get('/restaurants', async (req, res) => {
  try {
    const result = await getAllRestaurants();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//2

// Async function to get a restaurant by ID
async function getRestaurantById(id) {
  const query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [id]);
  return { restaurants: response };
}

// Route to fetch a restaurant by ID
app.get('/restaurants/details/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await getRestaurantById(id);
    if (!result) {
      return res
        .status(404)
        .json({ message: `Restaurant with ID ${id} not found.` });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//3

// Async function to get restaurants by cuisine
async function getRestaurantsByCuisine(cuisine) {
  const query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

// Route to fetch restaurants by cuisine
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  const cuisine = req.params.cuisine;

  try {
    const result = await getRestaurantsByCuisine(cuisine);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: `No restaurants found for cuisine ${cuisine}.` });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//4
// Function to fetch restaurants by filter
async function getRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg=? and hasOutdoorSeating=? and isLuxury=? '; // '1=1' allows adding conditional filters easily
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

// Route to fetch restaurants by filter
app.get('/restaurants/filter', async (req, res) => {
  const isVeg = req.query.isVeg;
  const hasOutdoorSeating = req.query.hasOutdoorSeating;
  const isLuxury = req.query.isLuxury;

  try {
    const result = await getRestaurantsByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );

    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurants found with the given filters.' });
    }

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//5

async function getAllRestaurants() {
  const query = 'SELECT * FROM restaurants order by rating desc';
  let response = await db.all(query, []);
  return { restaurants: response };
}

// Route to fetch all restaurants
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    const result = await getAllRestaurants();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//6

async function getAllDishes() {
  const query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

// Route to fetch all restaurants
app.get('/dishes', async (req, res) => {
  try {
    const result = await getAllDishes();
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//7

async function getAllDishesId(id) {
  const query = 'SELECT * FROM dishes where id=?';
  let response = await db.all(query, [id]);
  return { dishes: response };
}

// Route to fetch all restaurants
app.get('/dishes/details/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await getAllDishesId(id);
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//8

async function getAllDishes(isVeg) {
  const query = 'SELECT * FROM dishes where isVeg=?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

// Route to fetch all restaurants
app.get('/dishes/filter', async (req, res) => {
  const isVeg = req.query.isVeg;
  try {
    const result = await getAllDishes(isVeg);
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//9

async function getAllDishesByPrice() {
  const query = 'SELECT * FROM dishes order by price';
  let response = await db.all(query, []);
  return { dishes: response };
}

// Route to fetch all restaurants
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    const result = await getAllDishesByPrice();
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(PORT, () => console.log('Server running on port 3000'));
