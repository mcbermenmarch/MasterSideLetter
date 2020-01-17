using BermenMarch.MasterSideLetter.Common.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text;

namespace BermenMarch.MasterSideLetter.Common.DataAccess
{
    public static class StandardSearchDataAccess
    {
        public static async Task<IEnumerable<string>> GetFilterContentAsync(this MasterSideLetterDataAccess dataAccess, FilterContentRequest request)
        {
            var sql = new StringBuilder("select ");
            if (request.FilterLimit > 0)
            {
                sql.Append($" TOP {request.FilterLimit} ");
            }

            sql.Append(" * from (");

            switch (request.FilterType)
            {
                case "Fund":
                    sql.Append(
                        @"select distinct Name
                        from Fund
                        where Name like '%' + @TargetText + '%' ");
                    break;
                case "Investor":
                    sql.Append(
                        @"select distinct Name 
                        from Investor
                        where Name like '%' + @TargetText + '%' ");
                    break;
                case "Sponsor":
                    sql.Append(
                        @"select distinct SponsorName
                        from v_SponsorNames
                        where SponsorName like '%' + @TargetText + '%' ");
                    break;
                case "BusinessUnit":
                    sql.Append(
                        @"select distinct BusinessUnitName
                        from v_BusinessUnitNames
                        where BusinessUnitName like '%' + @TargetText + '%' ");
                    break;
                case "Strategy":
                    sql.Append(
                        @"select distinct StrategyName
                        from v_StrategyNames
                        where StrategyName like '%' + @TargetText + '%' ");
                    break;
                case "InvestorType":
                    sql.Append(
                        @"select distinct InvestorType
                        from Investor
                        where InvestorType like '%' + @TargetText + '%' ");
                    break;
                case "ProvisionType":
                    sql.Append(
                        @"select distinct ProvisionType
                        from v_Provision
                        where ProvisionType like '%' + @TargetText + '%' ");
                    break;
                case "Entity":
                    sql.Append(
                        @"select distinct Entity 
                        from FundInvestor
                        where Entity like '%' + @TargetText + '%' ");
                    break;
                case "Counsel":
                    sql.Append(
                        @"select distinct Counsel 
                        from FundInvestor
                        where Counsel like '%' + @TargetText + '%' ");
                    break;
            }

            sql.Append(") as s");

            return await dataAccess.QueryAsync<string>(sql.ToString(), request);
        }

        public static async Task<SearchResults> GetResultsAsync(this MasterSideLetterDataAccess dataAccess, SearchRequest request)
        {
            var allResults = new SearchResults
            {
                FundRows = new List<Fund>(),
                InvestorRows = new List<Investor>(),
                SideLetterRows = new List<FundInvestor>(),
                ProvisionRows = new List<Provision>()
            };

            if (request == null || request.IsEmpty())
            {
                return allResults;
            }


            if (request.SearchCategory == "All" || request.SearchCategory == "Fund")
            {
                //only return Funds if the user specified Fund criteria or search text
                if (!string.IsNullOrEmpty(request.TargetText) ||
                    (request.FundValues != null && request.FundValues.Length > 0) ||
                    (request.SponsorValues != null && request.SponsorValues.Length > 0) ||
                    (request.BusinessUnitValues != null && request.BusinessUnitValues.Length > 0) ||
                    (request.StrategyValues != null && request.StrategyValues.Length > 0) ||
                    request.SizeMin.HasValue ||
                    request.SizeMax.HasValue ||
                    request.YearMin.HasValue ||
                    request.YearMax.HasValue)
                {
                    allResults.FundRows.AddRange(await dataAccess.SearchFundsAsync(request));
                }
            }

            if (request.SearchCategory == "All" || request.SearchCategory == "Investor")
            {
                //only return Investors if the user specified Investor criteria or search text
                if (!string.IsNullOrEmpty(request.TargetText) ||
                    (request.InvestorValues != null && request.InvestorValues.Length > 0) ||
                    (request.InvestorTypeValues != null && request.InvestorTypeValues.Length > 0) ||
                    request.AggregateSizeMin.HasValue ||
                    request.AggregateSizeMax.HasValue)
                {
                    allResults.InvestorRows.AddRange(await dataAccess.SearchInvestorsAsync(request));
                }
            }

            if (request.SearchCategory == "All" || request.SearchCategory == "SideLetter")
            {
                if (!string.IsNullOrEmpty(request.TargetText) ||
                    request.FundValues != null && request.FundValues.Length > 0 ||
                    request.InvestorValues != null && request.InvestorValues.Length > 0 ||
                    request.SponsorValues != null && request.SponsorValues.Length > 0 ||
                    request.BusinessUnitValues != null && request.BusinessUnitValues.Length > 0 ||
                    request.StrategyValues != null && request.StrategyValues.Length > 0 ||
                    request.InvestorTypeValues != null && request.InvestorTypeValues.Length > 0 ||
                    request.EntityValues != null && request.EntityValues.Length > 0 ||
                    request.CounselValues != null && request.CounselValues.Length > 0 ||
                    request.SizeMin.HasValue ||
                    request.SizeMax.HasValue ||
                    request.YearMin.HasValue ||
                    request.YearMax.HasValue ||
                    request.CommitmentMin.HasValue ||
                    request.CommitmentMax.HasValue ||
                    request.AggregateSizeMin.HasValue ||
                    request.AggregateSizeMax.HasValue|| 
                    request.InvestorId.HasValue ||
                    request.FundId.HasValue)
                {
                    allResults.SideLetterRows.AddRange(await dataAccess.SearchFundInvestorsAsync(request));
                }
            }

            if (request.SearchCategory == "All" || request.SearchCategory == "Provision")
            {

                if (!string.IsNullOrEmpty(request.TargetText) ||
                    request.FundValues != null && request.FundValues.Length > 0 ||
                    request.InvestorValues != null && request.InvestorValues.Length > 0 ||
                    request.SponsorValues != null && request.SponsorValues.Length > 0 ||
                    request.BusinessUnitValues != null && request.BusinessUnitValues.Length > 0 ||
                    request.StrategyValues != null && request.StrategyValues.Length > 0 ||
                    request.InvestorTypeValues != null && request.InvestorTypeValues.Length > 0 ||
                    request.EntityValues != null && request.EntityValues.Length > 0 ||
                    request.CounselValues != null && request.CounselValues.Length > 0 ||
                    request.ProvisionTypeValues != null && request.ProvisionTypeValues.Length > 0 ||
                    request.SizeMin.HasValue ||
                    request.SizeMax.HasValue ||
                    request.YearMin.HasValue ||
                    request.YearMax.HasValue ||
                    request.CommitmentMin.HasValue ||
                    request.CommitmentMax.HasValue ||
                    request.AggregateSizeMin.HasValue ||
                    request.AggregateSizeMax.HasValue ||
                    request.InvestorId.HasValue ||
                    request.FundId.HasValue)
                {
                    allResults.ProvisionRows.AddRange(await dataAccess.SearchProvisionsAsync(request));
                }
            }

            return allResults;
        }
    }
}
