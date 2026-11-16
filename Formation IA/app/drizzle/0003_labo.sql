CREATE TABLE "labo_uses" (
	"user_id" uuid NOT NULL,
	"tool_id" text NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "labo_uses_user_id_tool_id_pk" PRIMARY KEY("user_id","tool_id")
);
--> statement-breakpoint
ALTER TABLE "labo_uses" ADD CONSTRAINT "labo_uses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;