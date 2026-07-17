/*
  Warnings:

  - You are about to drop the column `executor_id` on the `tasks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_executor_id_fkey";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "executor_id";

-- CreateTable
CREATE TABLE "_TaskExecutor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TaskExecutor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TaskExecutor_B_index" ON "_TaskExecutor"("B");

-- AddForeignKey
ALTER TABLE "_TaskExecutor" ADD CONSTRAINT "_TaskExecutor_A_fkey" FOREIGN KEY ("A") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskExecutor" ADD CONSTRAINT "_TaskExecutor_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
