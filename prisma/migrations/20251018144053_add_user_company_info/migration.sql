-- CreateTable
CREATE TABLE "address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "createdAt" DATETIME NOT NULL,
    "metadata" TEXT,
    "addressId" TEXT,
    "sirenNumber" TEXT,
    "vatNumber" TEXT,
    "legalStatus" TEXT,
    CONSTRAINT "organization_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_organization" ("createdAt", "id", "logo", "metadata", "name", "slug") SELECT "createdAt", "id", "logo", "metadata", "name", "slug" FROM "organization";
DROP TABLE "organization";
ALTER TABLE "new_organization" RENAME TO "organization";
CREATE UNIQUE INDEX "organization_slug_key" ON "organization"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
