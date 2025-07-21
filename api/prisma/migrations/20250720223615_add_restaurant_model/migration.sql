/*
  Warnings:

  - The `benefits` column on the `loyalty_tiers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `allergens` column on the `menu_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "loyalty_tiers" DROP COLUMN "benefits",
ADD COLUMN     "benefits" JSONB;

-- AlterTable
ALTER TABLE "menu_items" DROP COLUMN "allergens",
ADD COLUMN     "allergens" JSONB;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "restaurantId" TEXT;

-- CreateTable
CREATE TABLE "restaurants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
