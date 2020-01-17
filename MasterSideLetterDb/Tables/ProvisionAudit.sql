CREATE TABLE [dbo].[ProvisionAudit]
(
	[Id] INT,    
	[FundInvestorId] INT ,
	[ProvisionType] NVARCHAR(200)  ,
	[IsProvisionTypeInherited] BIT ,
    [Content] NVARCHAR(MAX) ,
	[Notes] NVARCHAR(MAX),
	[CreatedDate] datetime , 
    [ModifiedDate] DATETIME ,
	[AuditDate] datetime
)
