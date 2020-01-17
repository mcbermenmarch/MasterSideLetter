CREATE VIEW [dbo].[v_SponsorNames]
AS 

select Name as SponsorName
from Sponsor
union 
select FundSponsorName
from FundInvestor
where FundSponsorName is not null
