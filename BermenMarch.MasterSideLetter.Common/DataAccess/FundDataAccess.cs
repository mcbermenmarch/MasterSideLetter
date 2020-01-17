using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using BermenMarch.MasterSideLetter.Common.Model;
using System.Data;
using System.Text;
using Dapper;
using BermenMarch.MasterSideLetter.Common.Helpers;

namespace BermenMarch.MasterSideLetter.Common.DataAccess
{
    public static class FundDataAccess
    {
        public static async Task<Fund> GetFundAsync(this MasterSideLetterDataAccess dataAccess, int id, string userName)
        {
            return await dataAccess.QueryFirstOrDefaultAsync<Fund>(
                @"select 
                    f.*
                ,   uf.IsFavorite
                ,   uf.LastAccessedDate
                from v_Fund f
                left Join UserFund uf
                on f.Id = uf.FundId
                and uf.UserName = @userName
                where f.Id = @id
                ", new {id, userName});
        }

        public static Task<Fund> GetFundByNameAsync(this MasterSideLetterDataAccess dataAccess, string name)
        {
            return dataAccess.QueryFirstOrDefaultAsync<Fund>("select * from Fund where Name = @name", new { name });
        }

        public static async Task<IEnumerable<Fund>> GetFundsAsync(this MasterSideLetterDataAccess dataAccess, string userName, string query = null, int? maxRows = null)
        {
            var sql = new StringBuilder("select ");
            if (maxRows.HasValue)
            {
                sql.AppendFormat(" TOP {0} ", maxRows.Value);
            }

            sql.Append(
                @"f.* 
                ,   uf.IsFavorite
                ,   uf.LastAccessedDate
                from v_Fund f
                left join UserFund uf
                on f.Id = uf.FundId 
                and uf.UserName = @userName");

            if (!string.IsNullOrEmpty(query))
            {
                sql.Append(" where f.Name like '%' + @query + '%' or f.SponsorName like '%' + @query + '%' or f.BusinessUnitName like '%' + @query + '%' or f.StrategyName like '%' + @query + '%' ");
            }

            return await dataAccess.QueryAsync<Fund>(sql.ToString(), new {userName, query});
        }


        public static async Task<IEnumerable<Fund>> GetFavoriteFundsAsync(this MasterSideLetterDataAccess dataAccess, string userName, int? limit = null)
        {
            var sql = new StringBuilder("select ");
            if (limit.HasValue)
            {
                sql.Append($" TOP {limit.Value} ");
            }

            sql.Append(@" f.*
                ,   uf.IsFavorite
                ,   uf.LastAccessedDate
                from v_Fund f
                join UserFund uf
                on f.Id = uf.FundId
                and uf.UserName = @userName
                and uf.IsFavorite = 1");
            return await dataAccess.QueryAsync<Fund>(sql.ToString(), new {userName});
        }

        public static async Task<IEnumerable<Fund>> GetRecentFundsAsync(this MasterSideLetterDataAccess dataAccess, string userName, int? limit = null)
        {
            var sql = new StringBuilder("select ");
            if (limit.HasValue)
            {
                sql.Append($" TOP {limit.Value} ");
            }

            sql.Append(@" f.*
                ,   uf.IsFavorite
                ,   uf.LastAccessedDate
                from v_Fund f
                join UserFund uf
                on f.Id = uf.FundId
                and uf.UserName = @userName
                ORDER BY uf.LastAccessedDate DESC");
            return await dataAccess.QueryAsync<Fund>(sql.ToString(), new {userName});
        }


        public static async Task<int> CreateFundAsync(this MasterSideLetterDataAccess dataAccess, Fund fund)
        {
            await dataAccess.ValidateFundReferences(fund);
            return await dataAccess.ExecuteScalarAsync<int>(
                "insert Fund(Name, SponsorId, BusinessUnitId, StrategyId, Year, Size) output inserted.Id values(@Name, @SponsorId, @BusinessUnitId, @StrategyId, @Year, @Size)",
                fund);
        }

        private static async Task ValidateFundReferences(this MasterSideLetterDataAccess dataAccess, Fund fund)
        {
            if (!string.IsNullOrEmpty(fund.SponsorName))
            {
                var sponsor = await dataAccess.GetOrCreateSponsorAsync(fund.SponsorName);
                fund.SponsorId = sponsor.Id;
            }

            if (!string.IsNullOrEmpty(fund.StrategyName))
            {
                var strategy = await dataAccess.GetOrCreateStrategyAsync(fund.StrategyName);
                fund.StrategyId = strategy.Id;
            }

            if (!string.IsNullOrEmpty(fund.BusinessUnitName))
            {
                var businessUnit = await dataAccess.GetOrCreateBusinessUnitAsync(fund.BusinessUnitName);
                fund.BusinessUnitId = businessUnit.Id;
            }
        }

        public static async Task<int> UpdateFundAsync(this MasterSideLetterDataAccess dataAccess, Fund fund)
        {
            await dataAccess.ValidateFundReferences(fund);
            return await dataAccess.ExecuteAsync("update Fund set ModifiedDate = getdate(), Name = @Name, SponsorId = @SponsorId, BusinessUnitId = @BusinessUnitId, StrategyId = @StrategyId, Year = @Year, Size = @Size where Id = @Id",
                fund);
        }

        public static async Task<int> DeleteFundAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            return await dataAccess.ExecuteAsync("delete Fund where Id = @id", new {id});
        }

        public static async Task UpdateFundIsFavoriteAsync(this MasterSideLetterDataAccess dataAccess, int id, string userName, bool isFavorite)
        {
            await dataAccess.ExecuteAsync(@"update UserFund
                                set IsFavorite = @isFavorite
                                where FundId = @id
                                and UserName = @userName 
                                   
                                if @@RowCount = 0 
                                begin
                                    insert UserFund(FundId,UserName,IsFavorite) values(@id, @userName, @isFavorite)
                                end", new {userName, id, isFavorite});
        }

        public static async Task UpdateFundLastAccessedDateAsync(this MasterSideLetterDataAccess dataAccess, int id, string userName)
        {
            await dataAccess.ExecuteAsync(@"update UserFund
                                set LastAccessedDate = getdate()
                                where FundId = @id
                                and UserName = @userName 
                                   
                                if @@RowCount = 0 
                                begin
                                    insert UserFund(FundId,UserName,LastAccessedDate) values(@id, @userName, getdate())
                                end", new {userName, id});
        }

        public static async Task UpdateFundMslAsync(this MasterSideLetterDataAccess dataAccess, int id, string fileName, Stream readStream)
        {
            var dynamicParameters = new DynamicParameters();
            dynamicParameters.Add("id", id, DbType.Int32);
            dynamicParameters.Add("fileName", fileName, DbType.String);
            dynamicParameters.Add("fileContent", readStream, DbType.Binary);
            await dataAccess.ExecuteAsync("update Fund set MslFileName = @fileName, MslFileContent = @fileContent where Id = @id", dynamicParameters);
        }

        public static async Task RemoveMslFromFundAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            await dataAccess.ExecuteAsync("update Fund set MslFileName = null, MslFileContent = null where Id = @id", new {id});
        }

        public static async Task UpdateFundMfnAsync(this MasterSideLetterDataAccess dataAccess, int id, string fileName, Stream readStream)
        {
            var dynamicParameters = new DynamicParameters();
            dynamicParameters.Add("id", id, DbType.Int32);
            dynamicParameters.Add("fileName", fileName, DbType.String);
            dynamicParameters.Add("fileContent", readStream, DbType.Binary);
            await dataAccess.ExecuteAsync("update Fund set MfnFileName = @fileName, MfnFileContent = @fileContent where Id = @id", dynamicParameters);
        }

        public static async Task RemoveMfnFromFundAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            await dataAccess.ExecuteAsync("update Fund set MfnFileName = null, MfnFileContent = null where Id = @id", new {id});
        }

        public static async Task<Document> GetFundMslAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            return await dataAccess.QueryFirstOrDefaultAsync<Document>("select MslFileName Name, MslFileContent Content from Fund where Id = @id", new {id});
        }

        public static async Task<Document> GetFundMfnAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            return await dataAccess.QueryFirstOrDefaultAsync<Document>("select MfnFileName Name, MfnFileContent Content from Fund where Id = @id", new {id});
        }

        public static async Task<Fund> GetOrCreateFundAsync(this MasterSideLetterDataAccess dataAccess, string name, string sponsorName, string businessUnitName, string strategyName, int? year, decimal? size)
        {
            var existing = await dataAccess.GetFundByNameAsync(name);
            if (existing != null)
            {
                return existing;
            }
            var newFund = new Fund
            {
                Name = name,
                SponsorName = sponsorName,
                BusinessUnitName = businessUnitName,
                StrategyName = strategyName,
                Year = year,
                Size = size
            };
            newFund.Id = await dataAccess.CreateFundAsync(newFund);
            return newFund;
        }


        public static async Task<IEnumerable<Fund>> SearchFundsAsync(this MasterSideLetterDataAccess dataAccess,SearchRequest request)
        {
            var preparedQuery = new PreparedQuery(request);
            preparedQuery.Sql.Append("select");
            if (request.FundSearchLimit > 0)
            {
                preparedQuery.Sql.Append($" TOP {request.FundSearchLimit}  ");
            }

            preparedQuery.Sql.Append(" f.*, uf.IsFavorite, uf.LastAccessedDate ");
            preparedQuery.Sql.Append(" from v_Fund f ");
            preparedQuery.Sql.Append(" left join UserFund uf ");
            preparedQuery.Sql.Append(" on f.Id = uf.FundId ");
            preparedQuery.Sql.Append(" and uf.UserName = @UserName ");
            preparedQuery.Sql.Append(" where 1=1 ");
            // apply target text to all text columns
            if (!string.IsNullOrEmpty(request.TargetText))
            {

                SearchHelper.AppendSearchCondition(request.TargetText,
                    new List<string>
                    {
                        "f.Name",
                        "f.SponsorName",
                        "f.BusinessUnitName",
                        "f.StrategyName"
                    },
                    preparedQuery);
            }

            // apply relevant filters
            if (request.FundValues != null && request.FundValues.Length > 0)
            {
                preparedQuery.Sql.Append(" and f.Name in @FundValues ");
            }

            // apply relevant filters
            if (request.SponsorValues != null && request.SponsorValues.Length > 0)
            {
                preparedQuery.Sql.Append(" and f.SponsorName in @SponsorValues ");
            }

            if (request.BusinessUnitValues != null && request.BusinessUnitValues.Length > 0)
            {
                preparedQuery.Sql.Append(" and f.BusinessUnitName in @BusinessUnitValues ");
            }

            if (request.StrategyValues != null && request.StrategyValues.Length > 0)
            {
                preparedQuery.Sql.Append(" and f.StrategyName in @StrategyValues ");
            }

            if (request.SizeMin.HasValue)
            {
                preparedQuery.Sql.Append(" and f.Size >= @SizeMin ");
            }
            if (request.SizeMax.HasValue)
            {
                preparedQuery.Sql.Append(" and f.Size <= @SizeMax ");
            }

            if (request.YearMin.HasValue)
            {
                preparedQuery.Sql.Append(" and f.Year >= @YearMin ");
            }

            if (request.YearMax.HasValue)
            {
                preparedQuery.Sql.Append(" and f.Year <= @YearMax ");
            }

            preparedQuery.Sql.Append(" ORDER BY uf.LastAccessedDate DESC ");
            return await dataAccess.QueryAsync<Fund>(preparedQuery.Sql.ToString(), preparedQuery.Parameters);
        }

    }
}
