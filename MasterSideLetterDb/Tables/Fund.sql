CREATE TABLE [dbo].[Fund]
(
	[Id] INT NOT NULL PRIMARY KEY  IDENTITY(1,1), 
    [Name] NVARCHAR(200) NULL,
	[SponsorId] int NULL,
	[BusinessUnitId] int NULL,
	[StrategyId] int NULL,
	[Year] int NULL,
	[Size] decimal(18,0) NULL,
	[MslFileName] NVARCHAR(200) NULL,
	[MslFileContent] VARBINARY(MAX) NULL,
	[MfnFileName] NVARCHAR(200) NULL,
	[MfnFileContent] VARBINARY(MAX) NULL,
	[CreatedDate] datetime NOT NULL  CONSTRAINT DF_Fund_CreatedDate DEFAULT getdate(), 
    [ModifiedDate] datetime NOT NULL CONSTRAINT DF_Fund_ModifiedDate DEFAULT getdate()
)

GO

CREATE TRIGGER [dbo].[TR_FundAudit]
ON [dbo].[Fund]
FOR DELETE, UPDATE
AS	
insert into [dbo].[FundAudit]
select *, getdate()
from deleted d;
