CREATE TABLE "public"."bops_applications"("id" serial NOT NULL, "bops_id" text NOT NULL, "destination_url" Text NOT NULL, "request" jsonb NOT NULL, "req_headers" JSONB NOT NULL, "response" JSONB NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "session_id" text NOT NULL, PRIMARY KEY ("id") );
