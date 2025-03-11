import express from "express";
import bodyParser from "body-parser";
import pg from 'pg'


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user : "postgres",
  host : "localhost",
  password: "1124",
  database: "permalist",
  port : 5433
})

db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];


async function getItems() {
  const result = await db.query("SELECT * FROM items ORDER BY id ASC");
  
  return items = result.rows;
  
}

app.get("/", async (req, res) => {
  console.log(await getItems());
  
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {

  const item = req.body.newItem;
  
  console.log(item);
  try {
    const result = await db.query("INSERT INTO items(title) VALUES ($1)",[item])
    console.log(res.rows);
    res.redirect("/");
    
  } catch (error) {
    console.error("Error adding data", error.stack);
    return redirect("index.ejs")
  }

});

app.post("/edit", (req, res) => {

  const id = parseInt(req.body.updatedItemId);
  const updatedTitle = req.body.updatedItemTitle;

  try {
    const result = db.query('UPDATE items SET title = $1 WHERE id = $2',[updatedTitle,id])
    console.log(result.rows);
    res.redirect('/');
  } catch (error) {
    console.error("Error updating item",error.stack);
    return res.render("index.ejs")
  }

});

app.post("/delete", (req, res) => {
  
  const id = parseInt(req.body.deleteItemId);
  console.log(id);
  try {
    const result = db.query('DELETE FROM items WHERE id = $1', [id]);

  } catch (error) {
    console.error('Error deleting item',error.stack);
    
  }
  res.redirect('/')
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
