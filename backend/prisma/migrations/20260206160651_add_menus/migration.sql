/*
  Warnings:

  - You are about to drop the `Menu` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Menu] DROP CONSTRAINT [Menu_parentId_fkey];

-- DropTable
DROP TABLE [dbo].[Menu];

-- CreateTable
CREATE TABLE [dbo].[menus] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(1000) NOT NULL,
    [parentId] INT,
    [url] NVARCHAR(1000),
    [order] INT NOT NULL CONSTRAINT [menus_order_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [menus_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [menus_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[menus] ADD CONSTRAINT [menus_parentId_fkey] FOREIGN KEY ([parentId]) REFERENCES [dbo].[menus]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
