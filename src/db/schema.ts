import { pgTable, serial, text, integer, timestamp, uniqueIndex, json } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const verseContent = pgTable(
  'verse_content',
  {
    id: serial('id').primaryKey(),
    chapterId: integer('chapter_id').notNull(),
    verseNumber: integer('verse_number').notNull(),
    text: text('text').notNull(),
    transliteration: text('transliteration'),
    translations: json('translations'),
    commentaries: json('commentaries'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      chapterVerseUnique: uniqueIndex('chapter_verse_unique').on(
        table.chapterId,
        table.verseNumber
      ),
    };
  }
);

export const readingProgress = pgTable(
  'reading_progress',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    chapterId: integer('chapter_id').notNull(),
    verseNumber: integer('verse_number').notNull(),
    isCompleted: integer('is_completed').default(0).notNull(),
    readAt: timestamp('read_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      userChapterVerseUnique: uniqueIndex('user_chapter_verse_unique').on(
        table.userId,
        table.chapterId,
        table.verseNumber
      ),
    };
  }
);

export const verseOfTheDay = pgTable('verse_of_the_day', {
  id: serial('id').primaryKey(),
  chapterId: integer('chapter_id').notNull(),
  verseNumber: integer('verse_number').notNull(),
  verseText: text('verse_text').notNull(),
  transliteration: text('transliteration'),
  meaning: text('meaning'),
  author: text('author'),
  translations: json('translations'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  isCurrent: integer('is_current').default(0).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type VerseContent = typeof verseContent.$inferSelect;
export type NewVerseContent = typeof verseContent.$inferInsert;

export type ReadingProgress = typeof readingProgress.$inferSelect;
export type NewReadingProgress = typeof readingProgress.$inferInsert;

export type VerseOfTheDay = typeof verseOfTheDay.$inferSelect;
export type NewVerseOfTheDay = typeof verseOfTheDay.$inferInsert;