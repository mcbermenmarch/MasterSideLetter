CREATE TABLE [dbo].[Investor]
(
	[Id] int NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [Name] varchar(100) NOT NULL,
	[InvestorType] varchar (100) NULL,
	[CreatedDate] datetime NOT NULL  CONSTRAINT DF_Investor_CreatedDate DEFAULT getdate(), 
    [ModifiedDate] datetime NOT NULL CONSTRAINT DF_Investor_ModifiedDate DEFAULT getdate()
)

GO


CREATE TRIGGER [dbo].[TR_InvestorAudit]
ON [dbo].[Investor]
FOR DELETE, UPDATE
AS	
insert into [dbo].[InvestorAudit]
select *, getdate()
from deleted d;



