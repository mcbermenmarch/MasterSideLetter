CREATE TABLE [dbo].[UserFund]
(
	[UserName] sysname NOT NULL,
	[FundId] INT NOT NULL,
	[IsFavorite] BIT NULL,
    [LastAccessedDate] datetime NULL, 
    CONSTRAINT [PK_UserFund] PRIMARY KEY ([UserName], [FundId])
)