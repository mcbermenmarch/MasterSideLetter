CREATE TABLE [dbo].[FundInvestorAudit]
(
	[Id] INT,
	[FundId] INT ,	
	[FundSponsorName] NVARCHAR(200) ,
	[FundBusinessUnitName] NVARCHAR(200) ,
	[FundStrategyName] NVARCHAR(200) ,
	[FundYear] INT ,
	[FundSize] decimal(18,0) ,
	[InvestorId] INT ,
	[InvestorType] NVARCHAR(200) ,
	[Entity] NVARCHAR(200) ,
	[Commitment] decimal(18,0) ,
	[Counsel] NVARCHAR(200) ,
	[Notes] NVARCHAR(200) ,
	[SideLetterFileName] NVARCHAR(200) ,
	[SideLetterFileContent] VARBINARY(MAX) ,
	[CreatedDate] datetime   , 
    [ModifiedDate] datetime ,
	[AuditDate] datetime

)
