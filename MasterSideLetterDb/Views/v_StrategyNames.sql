CREATE VIEW [dbo].[v_StrategyNames]
AS 

select Name as StrategyName
from Strategy
union 
select FundStrategyName
from FundInvestor
where FundStrategyName is not null
