CREATE TABLE [dbo].[Provision]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1),    
	[FundInvestorId] INT NOT NULL,
	[ProvisionType] NVARCHAR(200)  NULL,
	[IsProvisionTypeInherited] BIT NULL,
    [Content] NVARCHAR(MAX) NULL,
	[Notes] NVARCHAR(MAX) NULL,
	[CreatedDate] datetime NOT NULL  CONSTRAINT DF_Provision_CreatedDate DEFAULT getdate(), 
    [ModifiedDate] datetime NOT NULL CONSTRAINT DF_Provision_ModifiedDate DEFAULT getdate()
)

GO


CREATE TRIGGER [dbo].[TR_ProvisionAudit]
ON [dbo].[Provision]
FOR DELETE, UPDATE
AS	
insert into [dbo].[ProvisionAudit]
select *, getdate()
from deleted d;
