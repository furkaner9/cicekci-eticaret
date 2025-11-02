-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'Çiçek Dükkanım',
    "siteDescription" TEXT,
    "siteLogo" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "freeShippingLimit" DOUBLE PRECISION NOT NULL DEFAULT 200,
    "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "smtpHost" TEXT,
    "smtpPort" INTEGER,
    "smtpUser" TEXT,
    "smtpPassword" TEXT,
    "emailFrom" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "whatsapp" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
