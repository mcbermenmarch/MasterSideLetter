CREATE VIEW [dbo].[v_BusinessUnitNames]
AS 

select Name as BusinessUnitName
from BusinessUnit
union 
select FundBusinessUnitName
from FundInvestor
where FundBusinessUnitName is not null
