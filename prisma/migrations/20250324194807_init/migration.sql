-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "dimension" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "product_link" TEXT NOT NULL,
    "object_3d_link" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
