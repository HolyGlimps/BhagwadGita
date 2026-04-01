CREATE TABLE "reading_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"chapter_id" integer NOT NULL,
	"verse_number" integer NOT NULL,
	"is_completed" integer DEFAULT 0 NOT NULL,
	"read_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verse_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"chapter_id" integer NOT NULL,
	"verse_number" integer NOT NULL,
	"text" text NOT NULL,
	"transliteration" text,
	"translations" json,
	"commentaries" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verse_of_the_day" (
	"id" serial PRIMARY KEY NOT NULL,
	"chapter_id" integer NOT NULL,
	"verse_number" integer NOT NULL,
	"verse_text" text NOT NULL,
	"transliteration" text,
	"meaning" text,
	"author" text,
	"translations" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_current" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reading_progress" ADD CONSTRAINT "reading_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_chapter_verse_unique" ON "reading_progress" USING btree ("user_id","chapter_id","verse_number");--> statement-breakpoint
CREATE UNIQUE INDEX "chapter_verse_unique" ON "verse_content" USING btree ("chapter_id","verse_number");