CREATE TABLE [dbo].[FundAudit]
(
	[Id] INT, 
    [Name] NVARCHAR(200) ,
	[SponsorId] int ,
	[BusinessUnitId] int ,
	[StrategyId] int ,
	[Year] int ,
	[Size] decimal(18,0) ,
	[MslFileName] NVARCHAR(200) ,
	[MslFileContent] VARBINARY(MAX) ,
	[MfnFileName] NVARCHAR(200) ,
	[MfnFileContent] VARBINARY(MAX) ,
	[CreatedDate] datetime  , 
    [ModifiedDate] datetime,
	[AuditDate] datetime
)
