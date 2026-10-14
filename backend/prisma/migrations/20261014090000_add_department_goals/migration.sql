CREATE TYPE "GoalStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "department" "Department" NOT NULL,
    "deadline" TIMESTAMP(3),
    "status" "GoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "creator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "_GoalTasks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_GoalTasks_AB_pkey" PRIMARY KEY ("A", "B")
);

CREATE INDEX "goals_department_status_idx" ON "goals"("department", "status");
CREATE INDEX "_GoalTasks_B_index" ON "_GoalTasks"("B");

ALTER TABLE "goals" ADD CONSTRAINT "goals_creator_id_fkey"
    FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "_GoalTasks" ADD CONSTRAINT "_GoalTasks_A_fkey"
    FOREIGN KEY ("A") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_GoalTasks" ADD CONSTRAINT "_GoalTasks_B_fkey"
    FOREIGN KEY ("B") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
