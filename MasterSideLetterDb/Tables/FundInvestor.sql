CREATE TABLE [dbo].[FundInvestor]
(
	[Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[FundId] INT NULL,	
	[FundSponsorName] NVARCHAR(200) NULL,
	[FundBusinessUnitName] NVARCHAR(200) NULL,
	[FundStrategyName] NVARCHAR(200) NULL,
	[FundYear] INT NULL,
	[FundSize] decimal(18,0) NULL,
	[InvestorId] INT NULL,
	[InvestorType] NVARCHAR(200) NULL,
	[Entity] NVARCHAR(200) NULL,
	[Commitment] decimal(18,0) NULL,
	[Counsel] NVARCHAR(200) NULL,
	[Notes] NVARCHAR(200) NULL,
	[SideLetterFileName] NVARCHAR(200) NULL,
	[SideLetterFileContent] VARBINARY(MAX) NULL,
	[CreatedDate] datetime NOT NULL  CONSTRAINT DF_FundInvestor_CreatedDate DEFAULT getdate(), 
    [ModifiedDate] datetime NOT NULL CONSTRAINT DF_FundInvestor_ModifiedDate DEFAULT getdate()
)


GO
CREATE TRIGGER [dbo].[TR_FundInvestorAudit]
ON [dbo].[FundInvestor]
FOR DELETE, UPDATE
AS	
insert into [dbo].[FundInvestorAudit]
select *, getdate()
from deleted d;
