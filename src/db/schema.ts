import { sql, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `corpo-wheel_${name}`);

export const team = createTable(
  "team",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);


export const user = createTable(
  "user",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    chance: integer("chance").default(10).notNull(),
    teamId: integer("team_id")
      .references(() => team.id)
      .notNull(),
    hasVoted: boolean("has_voted").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("user_name_idx").on(example.name),
  })
);

// Infer the type for a team
export type Team = InferSelectModel<typeof team>;

// Infer the type for a user
export type User = InferSelectModel<typeof user>;