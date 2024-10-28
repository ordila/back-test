/*
  Warnings:

  - You are about to drop the column `productId` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `variantName` on the `ProductVariant` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "productId",
DROP COLUMN "variantName",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "stockQuantity" INTEGER;

-- CreateTable
CREATE TABLE "ProductVariantCategory" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductVariantCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSpecificationsCategory" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductSpecificationsCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSpecification" (
    "id" SERIAL NOT NULL,
    "specificationCategoriesID" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductSpecification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductLabel" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "labelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Label" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductBundle" (
    "id" SERIAL NOT NULL,
    "mainProductId" INTEGER NOT NULL,
    "bundledProductId" INTEGER NOT NULL,
    "bundlePrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductBundle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductVariantCategory" ADD CONSTRAINT "ProductVariantCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductVariantCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSpecificationsCategory" ADD CONSTRAINT "ProductSpecificationsCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSpecification" ADD CONSTRAINT "ProductSpecification_specificationCategoriesID_fkey" FOREIGN KEY ("specificationCategoriesID") REFERENCES "ProductSpecificationsCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductLabel" ADD CONSTRAINT "ProductLabel_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductLabel" ADD CONSTRAINT "ProductLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBundle" ADD CONSTRAINT "ProductBundle_mainProductId_fkey" FOREIGN KEY ("mainProductId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBundle" ADD CONSTRAINT "ProductBundle_bundledProductId_fkey" FOREIGN KEY ("bundledProductId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
