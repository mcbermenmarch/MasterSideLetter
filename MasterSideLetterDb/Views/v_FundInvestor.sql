CREATE VIEW [dbo].[v_FundInvestor]
AS 

select fi.Id 
,   fi.FundId
,   f.Name FundName
,   isnull(fs.Name, fi.FundSponsorName) FundSponsorName
,   isnull(fbu.Name, fi.FundBusinessUnitName) FundBusinessUnitName
,   isnull(fst.Name, fi.FundStrategyName) FundStrategyName
,   isnull(f.Year,fi.FundYear) FundYear
,   isnull(f.Size,fi.FundSize) FundSize
,   fi.InvestorId 
,   i.Name InvestorName
,   isnull(i.InvestorType, fi.InvestorType) InvestorType
,	i.Aggregated
,	i.FundNos
,   fi.Entity
,   fi.Commitment
,   fi.Counsel
,   fi.Notes
,   fi.SideLetterFileName 
,	fi.CreatedDate
,	fi.ModifiedDate
from FundInvestor fi 
left join v_Investor i on i.Id = fi.InvestorId 
left join Fund f on f.Id = fi.FundId
left join Sponsor fs on fs.Id = f.SponsorId
left join BusinessUnit fbu on fbu.Id = f.BusinessUnitId
left join Strategy fst on fst.Id = f.StrategyId
