CREATE TABLE [dbo].[BusinessUnitAudit]
(
	[Id] INT,
	[Name] NVARCHAR(200),
	[CreatedDate] datetime,
    [ModifiedDate] datetime,
	[AuditDate] datetime
)