// Finding All Books in a Specific Genre
db.books.find(
    { genre: "Dystopian" }
);

// Finding Books Published After a Certain Year
db.books.find(
    { published_year: { $gt: 2000 } }
);

// Finding Books by a Specific Author
db.books.find(
    { author: "J.R.R. Tolkien" }
);

// Updating the Price of a Specific Book
db.books.updateOne(
  { title: "1984" },
  { $set: { price: 9.99 } }
);

// Deleting a Book by Its Title
db.books.deleteOne(
    { title: "The Catcher in the Rye" }
);

// ADVANCED QUERIES

// Books in stock and published in the years after 2010
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
});

// Return only the Title, Author or price
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
);

// Prices in ascending order
  db.books.find().sort(
    { price: 1 }
);

// Prices in descending order
  db.books.find().sort(
    { price: -1 }
);

// Limit of books per page
  db.books.find().limit(5)

  db.books.find().skip(5).limit(5);



//   AGGREGATION PIPELINE

// Average price of books per genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" }
    }
  },
  {
    $sort: { averagePrice: 1 } // Sort by average price in ascending order
  }
]);

// Author with most books
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      book_count: { $sum: 1 }
    }
  },
  { $sort: { book_count: -1 } }, // Descending order
  { $limit: 1 }
]);

// Group Books by Publication Decade and Count Them
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $toString: { $multiply: [ { $floor: { $divide: ["$published_year", 10] } }, 10 ] } },
          "s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);


// INDEXING

// Create an Index on the title Field for Faster Searches
db.books.createIndex(
    { title: 1 }
);
// Create a Compound Index on author and published_year
db.books.createIndex(
    { author: 1, published_year: -1 }
);

// Use the explain() Method to Demonstrate Performance Improvement with Indexes
db.books.find(
    { title: "1984" }
).explain("executionStats");
