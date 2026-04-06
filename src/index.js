import express from "express";
import { eq } from "drizzle-orm";
import { db, pool } from "./db/db.js";
import { demoUsers } from "./db/schema.js";

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());

// Root GET route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Spotsz API with Drizzle ORM!" });
});

// GET all users
app.get("/users", async (req, res) => {
  try {
    const users = await db.select().from(demoUsers);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const [user] = await db
      .select()
      .from(demoUsers)
      .where(eq(demoUsers.id, parseInt(req.params.id)));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create user
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const [newUser] = await db
      .insert(demoUsers)
      .values({ name, email })
      .returning();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update user
app.put("/users/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const [updatedUser] = await db
      .update(demoUsers)
      .set({ name, email })
      .where(eq(demoUsers.id, parseInt(req.params.id)))
      .returning();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE user
app.delete("/users/:id", async (req, res) => {
  try {
    await db.delete(demoUsers).where(eq(demoUsers.id, parseInt(req.params.id)));
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📚 API endpoints:`);
  console.log(`   GET  /users`);
  console.log(`   GET  /users/:id`);
  console.log(`   POST /users`);
  console.log(`   PUT  /users/:id`);
  console.log(`   DELETE /users/:id`);
});
