const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const bp = require("body-parser");

const dbPath = path.join(__dirname, "bookDatabase.db");
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

let db = null;
const port = process.env.PORT || 3001;

app.get("/", (request, response) => {
  response.send("Hello World!");
});

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(port, () => {
      console.log(`Server Running at http://localhost:${port}/`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/getbooks/", cors(), async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      bookdetails;`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

app.post("/addbook/", cors(), async (request, response) => {
  const bookDetails = request.body;
  console.log(bookDetails);
  const {
    book_id,
    book_title,
    book_author,
    published,
    book_description,
  } = bookDetails;
  const addBookQuery = `
    INSERT INTO
      bookdetails (book_id,book_title,book_author,published,book_description)
    VALUES
      (
        ${book_id},
        '${book_title}',
        '${book_author}',
        ${published},
        '${book_description}'
      );`;

  const dbResponse = await db.run(addBookQuery);
  console.log(dbResponse);
});
