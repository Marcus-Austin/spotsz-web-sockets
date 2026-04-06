import {
  pgTable,
  pgEnum,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
  varchar,
  foreignKey,
} from "drizzle-orm/pg-core";

// ============================================
// ENUMS
// ============================================

/**
 * Match Status Enum
 * Represents the current state of a match
 */
export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "live",
  "finished",
]);

// ============================================
// TABLES
// ============================================

/**
 * Matches Table
 * Stores real-time sports match data
 */
export const matchesTable = pgTable("matches", {
  id: serial("id").primaryKey(),
  sports: varchar("sports", { length: 100 }).notNull(),
  homeTeam: varchar("home_team", { length: 255 }).notNull(),
  awayTeam: varchar("away_team", { length: 255 }).notNull(),
  status: matchStatusEnum("status").notNull().default("scheduled"),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }),
  homeScore: integer("home_score").notNull().default(0),
  awayScore: integer("away_score").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Commentary Table
 * Stores real-time commentary/events during a match
 */
export const commentaryTable = pgTable("commentary", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id")
    .notNull()
    .references(() => matchesTable.id, { onDelete: "cascade" }),
  minute: integer("minute").notNull(),
  sequence: integer("sequence").notNull(),
  period: varchar("period", { length: 50 }).notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  actor: varchar("actor", { length: 255 }).notNull(),
  team: varchar("team", { length: 255 }).notNull(),
  message: text("message").notNull(),
  metadata: jsonb("metadata"),
  tags: varchar("tags", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
