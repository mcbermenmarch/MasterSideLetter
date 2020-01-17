CREATE TABLE [dbo].[Sponsor]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    [Name] NVARCHAR(200) NOT NULL,
	[CreatedDate] datetime NOT NULL  CONSTRAINT DF_Sponsor_CreatedDate DEFAULT getdate(), 
    [ModifiedDate] datetime NOT NULL CONSTRAINT DF_Sponsor_ModifiedDate DEFAULT getdate()

)

GO

CREATE TRIGGER [dbo].[TR_SponsorAudit]
ON [dbo].[Sponsor]
FOR DELETE, UPDATE
AS	
insert into [dbo].[SponsorAudit]
select *, getdate()
from deleted d;

