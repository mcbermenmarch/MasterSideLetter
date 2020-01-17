CREATE VIEW [dbo].[v_Investor]
AS 


select i.Id
,    i.Name
,    i.InvestorType
,    (select SUM(Commitment) from FundInvestor where InvestorId  = i.Id) as Aggregated
,    (select count(*) from FundInvestor where InvestorId  = i.Id) as FundNos
from Investor i


