CREATE TABLE "practice_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"exam_id" text NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"duration_seconds" integer DEFAULT 0 NOT NULL,
	"time_limit_minutes" integer NOT NULL,
	"question_order" jsonb NOT NULL,
	"answers" jsonb NOT NULL,
	"by_domain" jsonb NOT NULL,
	"score" integer NOT NULL,
	"total" integer NOT NULL,
	"percent" real NOT NULL,
	"pass_score" integer NOT NULL,
	"passed" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "metier" text;--> statement-breakpoint
ALTER TABLE "practice_attempts" ADD CONSTRAINT "practice_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "practice_attempts_user_exam_idx" ON "practice_attempts" USING btree ("user_id","exam_id","submitted_at");