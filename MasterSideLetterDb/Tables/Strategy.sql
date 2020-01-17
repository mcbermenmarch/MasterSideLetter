CREATE TABLE [dbo].[Strategy]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    [Name] NVARCHAR(200) NOT NULL,
	[CreatedDate] datetime NOT NULL  CONSTRAINT DF_Strategy_CreatedDate DEFAULT getdate(), 
    [ModifiedDate] datetime NOT NULL CONSTRAINT DF_Strategy_ModifiedDate DEFAULT getdate()
)

GO
CREATE TRIGGER [dbo].[TR_StrategyAudit]
ON [dbo].[Strategy]
FOR DELETE, UPDATE
AS	
insert into [dbo].[StrategyAudit]
select *, getdate()
from deleted d;
