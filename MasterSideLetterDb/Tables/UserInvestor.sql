CREATE TABLE [dbo].[UserInvestor]
(
	[UserName] sysname NOT NULL,
	[InvestorId] INT NOT NULL,
	[IsFavorite] BIT NULL,
    [LastAccessedDate] datetime NULL, 
    CONSTRAINT [PK_UserInvestor] PRIMARY KEY ([UserName], [InvestorId])
)
