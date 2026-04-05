import express from "express";

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());

// Root GET route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Spotsz API!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
