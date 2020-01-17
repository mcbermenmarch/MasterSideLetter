CREATE VIEW [dbo].[v_Fund]
AS 

select  f.Id
,   f.Name
,   f.SponsorId
,   s.Name SponsorName
,   f.BusinessUnitId
,   b.Name BusinessUnitName
,   f.StrategyId
,   st.Name StrategyName
,   f.Year
,   f.Size
,   f.MslFileName
,   f.MfnFileName
,   f.ModifiedDate
,   f.CreatedDate
from Fund f
left join Sponsor s on f.SponsorId = s.Id
left join BusinessUnit b on f.BusinessUnitId = b.Id
left join Strategy st on f.StrategyId = st.Id
