CREATE TABLE [dbo].[BusinessUnit]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
	[Name] NVARCHAR(200) NOT NULL,
	[CreatedDate] datetime NOT NULL  CONSTRAINT DF_BusinessUnit_CreatedDate DEFAULT getdate(), 
    [ModifiedDate] datetime NOT NULL CONSTRAINT DF_BusinessUnit_ModifiedDate DEFAULT getdate()
)

GO

CREATE TRIGGER [dbo].[TR_BusinessUnitAudit]
ON [dbo].[BusinessUnit]
FOR DELETE, UPDATE
AS	
insert into [dbo].[BusinessUnitAudit]
select *, getdate()
from deleted d;

