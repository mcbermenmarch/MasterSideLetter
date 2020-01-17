using BermenMarch.MasterSideLetter.Common.Model;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using System.Data;
using Dapper;
using BermenMarch.MasterSideLetter.Common.Helpers;

namespace BermenMarch.MasterSideLetter.Common.DataAccess
{
    public static class FundInvestorDataAccess
    {
        public static Task<IEnumerable<FundInvestor>> GetFundInvestorsByFundAsync(this MasterSideLetterDataAccess dataAccess, int fundId)
        {
            return dataAccess.QueryAsync<FundInvestor>(
                @"select fi.*
                    from v_FundInvestor fi 
                    where fi.FundId = @fundId", new { fundId });
        }

        public static Task<IEnumerable<FundInvestor>> GetFundInvestorsByInvestorAsync(this MasterSideLetterDataAccess dataAccess, int investorId)
        {
            return dataAccess.QueryAsync<FundInvestor>(
                @"select fi.*
                    from v_FundInvestor fi 
                    where fi.InvestorId = @investorId", new { investorId });
        }


        public static async Task<int> CreateFundInvestorAsync(this MasterSideLetterDataAccess dataAccess, FundInvestor fundInvestor)
        {
            await dataAccess.ValidateFundInvestorAsync(fundInvestor);
            return await dataAccess.ExecuteScalarAsync<int>(
                @" insert FundInvestor(
                            FundId,                             
                            FundSponsorName, 
                            FundBusinessUnitName,
                            FundStrategyName, 
                            InvestorId, 
                            InvestorType, 
                            Entity, 
                            Commitment, 
                            Counsel, 
                            Notes,
                            FundYear,
                            FundSize
                    ) output inserted.Id
                    values(
                            @FundId,                         
                            @FundSponsorName, 
                            @FundBusinessUnitName, 
                            @FundStrategyName, 
                            @InvestorId, 
                            @InvestorType, 
                            @Entity, 
                            @Commitment, 
                            @Counsel, 
                            @Notes,
                            @FundYear,
                            @FundSize
                    )", fundInvestor);
        }
        public static async Task<int> UpdateFundInvestorAsync(this MasterSideLetterDataAccess dataAccess, FundInvestor fundInvestor)
        {
            await dataAccess.ValidateFundInvestorAsync(fundInvestor);
            return await dataAccess.ExecuteAsync(
                @"   update FundInvestor 
                     set FundId = @FundId,                    
                        FundSponsorName = @FundSponsorName, 
                        FundBusinessUnitName = @FundBusinessUnitName, 
                        FundStrategyName = @FundStrategyName,  
                        InvestorId = @InvestorId, 
                        InvestorType = @InvestorType, 
                        Entity = @Entity, 
                        Commitment = @Commitment, 
                        Counsel = @Counsel, 
                        Notes = @Notes, 
                        FundYear = @FundYear,
                        FundSize = @FundSize,
                        ModifiedDate = getdate() 
                        where Id = @id", fundInvestor);
        }
        public static async Task<int> DeleteFundInvestorAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            await dataAccess.RemoveFundInvestorSideLetterAsync(id);

            return await dataAccess.ExecuteAsync("delete FundInvestor where Id = @id", new { id });
        }

        public static async Task<int> BatchDeleteFundInvestorAsync(this MasterSideLetterDataAccess dataAccess, int[] ids)
        {
            return await dataAccess.ExecuteAsync("delete FundInvestor where Id in @ids", new { ids });
        }


        public static async Task<int> RemoveFundInvestorSideLetterAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            return await dataAccess.ExecuteAsync(
                @"update FundInvestor set SideLetterFileName = null, SideLetterFileContent = null where Id = @id;
                    delete Provision where FundInvestorId = @id;", new { id });
        }

        public static async Task UpdateFundInvestorSideLetterAsync(this MasterSideLetterDataAccess dataAccess, int id, string fileName, Stream readStream)
        {
            var dynamicParameters = new DynamicParameters();
            dynamicParameters.Add("id", id, DbType.Int32);
            dynamicParameters.Add("fileName", fileName, DbType.String);
            dynamicParameters.Add("fileContent", readStream, DbType.Binary);
            await dataAccess.ExecuteAsync("update FundInvestor set SideLetterFileName = @fileName, SideLetterFileContent = @fileContent where Id = @id", dynamicParameters);
        }

        public static async Task<Document> GetFundInvestorSideLetterAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            return await dataAccess.QueryFirstOrDefaultAsync<Document>("select SideLetterFileName Name, SideLetterFileContent Content from FundInvestor where Id = @id", new { id });
        }

        private static async Task ValidateFundInvestorAsync(this MasterSideLetterDataAccess dataAccess, FundInvestor fundInvestor)
        {
            if (!string.IsNullOrEmpty(fundInvestor.FundName))
            {
                var fund = await dataAccess.GetOrCreateFundAsync(
                    fundInvestor.FundName,
                    fundInvestor.FundSponsorName,
                    fundInvestor.FundBusinessUnitName,
                    fundInvestor.FundStrategyName,
                    fundInvestor.FundYear,
                    fundInvestor.FundSize
                );
                var updated = false;
                if (fund.SponsorName != fundInvestor.FundSponsorName)
                {
                    updated = true;
                    var sponsor = await dataAccess.GetOrCreateSponsorAsync(fundInvestor.FundSponsorName);
                    fund.SponsorId = sponsor.Id;
                    fund.SponsorName = sponsor.Name;
                }

                if (fund.BusinessUnitName != fundInvestor.FundBusinessUnitName)
                {
                    updated = true;
                    var businessUnit = await dataAccess.GetOrCreateBusinessUnitAsync(fundInvestor.FundBusinessUnitName);
                    fund.BusinessUnitId = businessUnit.Id;
                    fund.BusinessUnitName = businessUnit.Name;
                }

                if (fund.StrategyName != fundInvestor.FundStrategyName)
                {
                    updated = true;
                    var strategy = await dataAccess.GetOrCreateStrategyAsync(fundInvestor.FundStrategyName);
                    fund.StrategyId = strategy.Id;
                    fund.StrategyName = strategy.Name;
                }

                if (fund.Year != fundInvestor.FundYear)
                {
                    updated = true;
                    fund.Year = fundInvestor.FundYear;
                }

                if (fund.Size != fundInvestor.FundSize)
                {
                    updated = true;
                    fund.Size = fundInvestor.FundSize;
                }

                if (updated)
                {
                    await dataAccess.UpdateFundAsync(fund);
                }

                fundInvestor.FundId = fund.Id;

            }

            if (!string.IsNullOrEmpty(fundInvestor.InvestorName))
            {
                var investor = await dataAccess.GetOrCreateInvestorAsync(fundInvestor.InvestorName, fundInvestor.InvestorType);
                if (investor.InvestorType != fundInvestor.InvestorType)
                {
                    investor.InvestorType = fundInvestor.InvestorType;
                    await dataAccess.UpdateInvestorAsync(investor);
                }
                fundInvestor.InvestorId = investor.Id;
            }
        }


        public static async Task<IEnumerable<FundInvestor>> SearchFundInvestorsAsync(this MasterSideLetterDataAccess dataAccess, SearchRequest request)
        {
            var preparedQuery = new PreparedQuery(request);
            preparedQuery.Sql.Append("select");
            if (request.SideLetterSearchLimit > 0)
            {
                preparedQuery.Sql.Append($" TOP {request.SideLetterSearchLimit} ");
            }

            preparedQuery.Sql.Append(" fi.* ");
            preparedQuery.Sql.Append(" from v_FundInvestor fi ");
            preparedQuery.Sql.Append(" where 1=1 ");
            // apply target text to all text columns
            if (!string.IsNullOrEmpty(request.TargetText))
            {
                SearchHelper.AppendSearchCondition(request.TargetText,
                    new List<string>
                    {
                        "fi.FundName",
                        "fi.FundSponsorName",
                        "fi.FundBusinessUnitName",
                        "fi.FundStrategyName",
                        "fi.InvestorName",
                        "fi.InvestorType",
                        "fi.Entity",
                        "fi.Counsel",
                        "fi.Notes",
                        "fi.SideLetterFileName"
                    },
                    preparedQuery);
            }
            // apply relevant filters
            if (request.FundValues != null && request.FundValues.Length > 0)
            {
                preparedQuery.Sql.Append(" and fi.FundName in @FundValues ");
            }

            if (request.InvestorValues != null && request.InvestorValues.Length > 0)
            {
                preparedQuery.Sql.Append(" and fi.InvestorName in @InvestorValues ");
            }

            if (request.SponsorValues != null && request.SponsorValues.Length > 0)
            {
                preparedQuery.Sql.Append(" and fi.FundSponsorName in @SponsorValues ");
            }

            if (request.BusinessUnitValues != null && request.BusinessUnitValues.Length > 0)
            {
                preparedQuery.Sql.Append(" and fi.FundBusinessUnitName in @BusinessUnitValues ");
            }

            if (request.StrategyValues != null && request.StrategyValues.Length > 0)
            {

                preparedQuery.Sql.Append(" and fi.FundStrategyName in @StrategyValues ");
            }

            if (request.InvestorTypeValues != null && request.InvestorTypeValues.Length > 0)
            {
                preparedQuery.Sql.Append(" and fi.InvestorType in @InvestorTypeValues ");
            }

            if (request.EntityValues != null && request.EntityValues.Length > 0)
            {
                preparedQuery.Sql.Append(" and fi.Entity in @EntityValues ");
            }

            if (request.CounselValues != null && request.CounselValues.Length > 0)
            {
                preparedQuery.Sql.Append(" and fi.Counsel in @CounselValues ");
            }

            if (request.SizeMin.HasValue)
            {
                preparedQuery.Sql.Append(" and fi.FundSize >= @SizeMin ");
            }

            if (request.SizeMax.HasValue)
            {
                preparedQuery.Sql.Append(" and fi.FundSize <= @SizeMax ");
            }

            if (request.YearMin.HasValue)
            {
                preparedQuery.Sql.Append(" and fi.FundYear >= @YearMin ");
            }

            if (request.YearMax.HasValue)
            {
                preparedQuery.Sql.Append(" and fi.FundYear <= @YearMax ");
            }

            if (request.CommitmentMin.HasValue)
            {
                preparedQuery.Sql.Append(" and fi.Commitment >= @CommitmentMin ");
            }

            if (request.CommitmentMax.HasValue)
            {
                preparedQuery.Sql.Append(" and fi.Commitment <= @CommitmentMax ");
            }

            if (request.AggregateSizeMin.HasValue)
            {
                preparedQuery.Sql.Append(" and fi.Aggregated >= @AggregateSizeMin ");
            }

            if (request.AggregateSizeMax.HasValue)
            {
                preparedQuery.Sql.Append(" and fi.Aggregated <= @AggregateSizeMax ");
            }

            if (request.InvestorId.HasValue)
            {
                preparedQuery.Sql.Append(" and fi.InvestorId = @InvestorId ");
            }

            if (request.FundId.HasValue)
            {
                preparedQuery.Sql.Append(" and fi.FundId = @FundId");
            }
            return await dataAccess.QueryAsync<FundInvestor>(preparedQuery.Sql.ToString(), preparedQuery.Parameters);
        }

    }
}
