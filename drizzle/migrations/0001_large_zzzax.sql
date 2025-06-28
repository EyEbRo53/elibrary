ALTER TABLE "chats" RENAME TO "jobs";--> statement-breakpoint
ALTER TABLE "jobs" DROP CONSTRAINT "chats_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;