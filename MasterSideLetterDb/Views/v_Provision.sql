CREATE VIEW [dbo].[v_Provision]
AS 

select p.Id
,	nullif(rtrim(p.ProvisionType),'') ProvisionType
,	p.IsProvisionTypeInherited
,	rtrim(ltrim(p.Content)) Content
,	p.Notes
,	p.FundInvestorId
,   fi.FundId
,   fi.FundName
,   fi.FundSponsorName
,   fi.FundBusinessUnitName
,   fi.FundStrategyName
,   fi.FundYear
,   fi.FundSize
,   fi.InvestorId
,   fi.InvestorName
,   fi.InvestorType
,	fi.Aggregated
,	fi.FundNos
,   fi.Entity
,   fi.Commitment
,   fi.Counsel
,   fi.SideLetterFileName 
from Provision p
join v_FundInvestor fi on fi.Id = p.FundInvestorId 
