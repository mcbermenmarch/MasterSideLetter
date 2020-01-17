using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using BermenMarch.MasterSideLetter.Common.Helpers;
using BermenMarch.MasterSideLetter.Common.Model;

namespace BermenMarch.MasterSideLetter.Common.DataAccess
{
    public static class ProvisionDataAccess
    {
        public static async Task<IEnumerable<string>> SearchProvisionTypesAsync(this MasterSideLetterDataAccess dataAccess, string query, int? limit = null)
        {
            var sql = new StringBuilder("select ");
            if (limit.HasValue)
            {
                sql.Append($" TOP {limit} ");
            }

            sql.Append("  ProvisionType from v_Provision where ProvisionType like '%' + @query + '%' group by ProvisionType ");
            return await dataAccess.QueryAsync<string>(sql.ToString(), new {query, limit});
        }

        public static async Task<Provision> GetProvisionAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            return await dataAccess.QueryFirstOrDefaultAsync<Provision>(@"select * from v_Provision where Id = @id", new {id});
        }

        public static async Task<IEnumerable<Provision>> GetProvisionsAsync(this MasterSideLetterDataAccess dataAccess, List<int> provisionIds)
        {
            return await dataAccess.QueryAsync<Provision>(@"select * from v_Provision p where p.Id in @provisionIds", new {provisionIds});
        }

        public static async Task<IEnumerable<Provision>> GetProvisionsByFundInvestorAsync(this MasterSideLetterDataAccess dataAccess, int fundInvestorId)
        {
            var fundInvestorIds = new List<int> {fundInvestorId};
            return await dataAccess.QueryAsync<Provision>(@"select * from v_Provision p where p.FundInvestorId in @fundInvestorIds", new {fundInvestorIds});
        }

        public static async Task<IEnumerable<Provision>> GetProvisionsByFundInvestorsAsync(this MasterSideLetterDataAccess dataAccess, List<int> fundInvestorIds)
        {
            return await dataAccess.QueryAsync<Provision>(@"select * from v_Provision p where p.FundInvestorId in @fundInvestorIds", new {fundInvestorIds});
        }

        public static async Task<int> CreateProvisionAsync(this MasterSideLetterDataAccess dataAccess, Provision provision)
        {
            return await dataAccess.ExecuteScalarAsync<int>(@"insert Provision (FundInvestorId, ProvisionType, Content , Notes) output inserted.Id values(@FundInvestorId, @ProvisionType, @Content, @Notes)", provision);
        }

        public static async Task UpdateProvisionAsync(this MasterSideLetterDataAccess dataAccess, Provision provision)
        {
            if (string.IsNullOrWhiteSpace(provision.ProvisionType))
            {
                provision.ProvisionType = null;
            }

            await dataAccess.ExecuteAsync(@"update Provision set FundInvestorId = @FundInvestorId, ProvisionType = @ProvisionType, IsProvisionTypeInherited = @IsProvisionTypeInherited, Content = @Content, Notes = @Notes, ModifiedDate = getdate() where Id = @Id", provision);
        }

        public static async Task DeleteProvisionAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            await dataAccess.ExecuteAsync(@"delete Provision where Id = @id", new {id});
        }

        public static async Task DeleteProvisionsByFundInvestorAsync(this MasterSideLetterDataAccess dataAccess, int fundInvestorId)
        {
            await dataAccess.ExecuteAsync(@"delete Provision where FundInvestorId = @fundInvestorId", new {fundInvestorId});
        }

        public static async Task<MasterSideLetterContent> GenerateMasterSideLetterContentAsync(this MasterSideLetterDataAccess dataAccess, int fundId, IList<int> fundInvestorIds)
        {
            var msl = new MasterSideLetterContent();
            msl.Fund = await dataAccess.QueryFirstOrDefaultAsync<Fund>("select * from v_Fund where Id = @fundId", new {fundId});
            var fundInvestorIndex = new Dictionary<int, FundInvestor>();
            var provisions = await dataAccess.QueryAsync<Provision>("select * from v_Provision where FundInvestorId in @fundInvestorIds and ProvisionType is not null", new {fundInvestorIds});

            var provisionTypeGroups = provisions.OrderBy(p => p.ProvisionType).GroupBy(p => p.ProvisionType);

            foreach (var provisionTypeGroup in provisionTypeGroups)
            {
                var provisionTypeSection = new MasterSideLetterContent.ProvisionTypeSection
                {
                    ProvisionType = provisionTypeGroup.Key
                };

                var contentGroups = provisionTypeGroup.GroupBy(c => NormalizeContent(c.Content)).OrderByDescending(g => g.Count());
                foreach (var contentGroup in contentGroups)
                {
                    var provisionSection = new MasterSideLetterContent.ProvisionSection
                    {
                        Content = contentGroup.First().Content
                    };

                    foreach (var provision in contentGroup)
                    {
                        FundInvestor fundInvestor;
                        if (fundInvestorIndex.ContainsKey(provision.FundInvestorId))
                        {
                            fundInvestor = fundInvestorIndex[provision.FundInvestorId];
                        }
                        else
                        {
                            fundInvestor = new FundInvestor
                            {
                                Id = provision.FundInvestorId,
                                FundId = provision.FundId,
                                FundName = provision.FundName,
                                FundSponsorName = provision.FundSponsorName,
                                FundBusinessUnitName = provision.FundBusinessUnitName,
                                FundStrategyName = provision.FundStrategyName,
                                FundYear = provision.FundYear,
                                FundSize = provision.FundSize,
                                InvestorId = provision.InvestorId,
                                InvestorName = provision.InvestorName,
                                InvestorType = provision.InvestorType,
                                Entity = provision.Entity,
                                Commitment = provision.Commitment,
                                Counsel = provision.Counsel,
                                Notes = provision.Notes,
                                SideLetterFileName = provision.SideLetterFileName
                            };
                            fundInvestorIndex.Add(fundInvestor.Id, fundInvestor);
                        }

                        provisionSection.FundInvestors.Add(fundInvestor);
                    }

                    provisionTypeSection.ProvisionSections.Add(provisionSection);
                }

                msl.ProvisionTypeSections.Add(provisionTypeSection);
            }

            msl.FundInvestors.AddRange(fundInvestorIndex.Values.OrderBy(fi => fi.InvestorName).ThenBy(fi => fi.Entity));
            return msl;

        }

        private static string NormalizeContent(string content)
        {
            return new string(content.Where(c => char.IsNumber(c) || char.IsLetter(c)).Select(char.ToUpper).ToArray());
        }

        public static IEnumerable<Provision> GetFilteredProvisions(this MasterSideLetterDataAccess dataAccess, SearchRequest request, bool? hasType = null)
        {
            var filteredRequest = new SearchRequest(request) {TargetText = null, ProvisionSearchLimit = 0};
            var preparedQuery = GetProvisionSearchQuery(filteredRequest, hasType);
            return dataAccess.Query<Provision>(preparedQuery.Sql.ToString(), preparedQuery.Parameters, null, false);
        }


        public static async Task<IEnumerable<Provision>> SearchProvisionsAsync(this MasterSideLetterDataAccess dataAccess, SearchRequest request)
        {
            var preparedQuery = GetProvisionSearchQuery(request);
            var results = await dataAccess.QueryAsync<Provision>(preparedQuery.Sql.ToString(), preparedQuery.Parameters);
            return results;
        }

        private static PreparedQuery GetProvisionSearchQuery(SearchRequest request, bool? hasType = null)
        {
            var preparedQuery = new PreparedQuery(request);
            preparedQuery.Sql.Append("select");
            if (request != null && request.ProvisionSearchLimit > 0)
            {
                preparedQuery.Sql.Append($" TOP {request.ProvisionSearchLimit} ");
            }

            preparedQuery.Sql.Append(" p.* ");
            preparedQuery.Sql.Append("  from v_Provision p ");
            preparedQuery.Sql.Append(" where 1=1 ");

            if (hasType.HasValue)
            {
                preparedQuery.Sql.Append(hasType == true ? " and p.ProvisionType is not null " : "  and p.ProvisionType is null ");
            }

            if (request != null)
            {
                // apply target text to all text columns
                if (!string.IsNullOrEmpty(request.TargetText))
                {
                    SearchHelper.AppendSearchCondition(request.TargetText,
                        new List<string>
                        {
                            "p.ProvisionType",
                            "p.Content",
                            "p.FundName",
                            "p.FundSponsorName",
                            "p.FundBusinessUnitName",
                            "p.FundStrategyName",
                            "p.InvestorName",
                            "p.InvestorType",
                            "p.Entity",
                            "p.Counsel",
                            "p.Notes",
                            "p.SideLetterFileName"
                        },
                        preparedQuery);
                }

                if (request.FundValues != null && request.FundValues.Length > 0)
                {
                    preparedQuery.Sql.Append(" and p.FundName in @FundValues ");
                }

                if (request.InvestorValues != null && request.InvestorValues.Length > 0)
                {
                    preparedQuery.Sql.Append(" and p.InvestorName in @InvestorValues ");
                }

                if (request.SponsorValues != null && request.SponsorValues.Length > 0)
                {
                    preparedQuery.Sql.Append(" and p.FundSponsorName in @SponsorValues ");
                }

                if (request.BusinessUnitValues != null && request.BusinessUnitValues.Length > 0)
                {
                    preparedQuery.Sql.Append(" and p.FundBusinessUnitName in @BusinessUnitValues ");
                }

                if (request.StrategyValues != null && request.StrategyValues.Length > 0)
                {
                    preparedQuery.Sql.Append(" and p.FundStrategyName in @StrategyValues ");
                }

                if (request.InvestorTypeValues != null && request.InvestorTypeValues.Length > 0)
                {
                    preparedQuery.Sql.Append(" and p.InvestorType in @InvestorTypeValues ");
                }

                if (request.ProvisionTypeValues != null && request.ProvisionTypeValues.Length > 0)
                {
                    preparedQuery.Sql.Append(" and p.ProvisionType in @ProvisionTypeValues ");
                }

                if (request.EntityValues != null && request.EntityValues.Length > 0)
                {
                    preparedQuery.Sql.Append(" and p.Entity in @EntityValues ");
                }

                if (request.CounselValues != null && request.CounselValues.Length > 0)
                {
                    preparedQuery.Sql.Append(" and p.Counsel in @counselValues ");
                }

                if (request.SizeMin.HasValue)
                {
                    preparedQuery.Sql.Append(" and p.FundSize >= @SizeMin ");
                }

                if (request.SizeMax.HasValue)
                {
                    preparedQuery.Sql.Append(" and p.FundSize <= @SizeMax ");
                }

                if (request.YearMin.HasValue)
                {
                    preparedQuery.Sql.Append(" and p.FundYear >= @YearMin ");
                }

                if (request.YearMax.HasValue)
                {
                    preparedQuery.Sql.Append(" and p.FundYear <= @YearMax ");
                }

                if (request.CommitmentMin.HasValue)
                {
                    preparedQuery.Sql.Append(" and p.Commitment >= @CommitmentMin ");
                }

                if (request.CommitmentMax.HasValue)
                {
                    preparedQuery.Sql.Append(" and p.Commitment <= @CommitmentMax ");
                }

                if (request.AggregateSizeMin.HasValue)
                {
                    preparedQuery.Sql.Append(" and p.Aggregated >= @AggregateSizeMin ");
                }

                if (request.AggregateSizeMax.HasValue)
                {
                    preparedQuery.Sql.Append(" and p.Aggregated <= @AggregateSizeMax ");
                }

                if (request.FundId.HasValue)
                {
                    preparedQuery.Sql.Append(" and p.FundId = @fundId ");
                }

                if (request.InvestorId.HasValue)
                {
                    preparedQuery.Sql.Append(" and p.InvestorId = @investorId ");
                }

                if (request.FundInvestorIds != null && request.FundInvestorIds.Length > 0)
                {
                    preparedQuery.Sql.Append(" and p.FundInvestorId in @fundInvestorIds ");
                }
            }
            preparedQuery.Sql.Append("  order by p.Content ");
            return preparedQuery;
        }
    }
}