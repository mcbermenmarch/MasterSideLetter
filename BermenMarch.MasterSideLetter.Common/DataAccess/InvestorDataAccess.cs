using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BermenMarch.MasterSideLetter.Common.Helpers;
using BermenMarch.MasterSideLetter.Common.Model;

namespace BermenMarch.MasterSideLetter.Common.DataAccess
{
    public static class InvestorDataAccess
    {
        public static async Task<Investor> GetInvestorAsync(this MasterSideLetterDataAccess dataAccess, int id, string userName)
        {
            return await dataAccess.QueryFirstOrDefaultAsync<Investor>(
                @"select i.*
                    ,   ui.IsFavorite
                    ,   ui.LastAccessedDate
                    from Investor i 
                    left join UserInvestor ui
                    on i.Id = ui.InvestorId 
                    and ui.UserName = @userName
                    where Id = @id", new { id, userName });
        }

        public static Task<Investor> GetInvestorByNameAsync(this MasterSideLetterDataAccess dataAccess, string name)
        {
            return dataAccess.QueryFirstOrDefaultAsync<Investor>("select * from Investor where Name = @name", new { name });
        }

        public static async Task<IEnumerable<Investor>> GetInvestorsAsync(this MasterSideLetterDataAccess dataAccess, string userName, string query = null, string typeQuery = null, int? maxRows = null)
        {
            var sql = new StringBuilder("select ");
            if (maxRows.HasValue)
            {
                sql.AppendFormat(" TOP {0} ", maxRows.Value);
            }

            sql.Append(
                @"i.* 
                ,   ui.IsFavorite
                ,   ui.LastAccessedDate
                from Investor i
                left join UserInvestor ui
                on i.Id = ui.InvestorId 
                and ui.UserName = @userName
                where 1 = 1 ");

            if (!string.IsNullOrEmpty(query))
            {
                sql.Append(" and (i.Name like '%' + @query + '%' OR i.InvestorType like '%' + @query + '%') ");
            }

            if (!string.IsNullOrEmpty(typeQuery))
            {
                sql.Append(" and i.InvestorType like '%' + @typeQuery + '%'");
            }

            var investorList = (await dataAccess.QueryAsync<Investor>(sql.ToString(), new { userName, query,typeQuery })).ToList();

            foreach (var investor in investorList)
            {
                var fundInvestor = await dataAccess.QueryFirstOrDefaultAsync<Investor>(
                  @"select  
                        InvestorId,
		                SUM(Commitment) as aggregated, 
		                Count(FundId) as fundNos 
	                    from [v_FundInvestor] where InvestorId  = @investorId
                        group by InvestorId", new { investorId = investor.Id });

                if (fundInvestor != null)
                {

                    investor.Aggregated = fundInvestor.Aggregated;
                    investor.FundNos = fundInvestor.FundNos;
                }

                await dataAccess.AddRecentInvestmentsAsync(investor);
            }

            return investorList;
        }

        public static async Task<int> CreateInvestorAsync(this MasterSideLetterDataAccess dataAccess, Investor investor)
        {
            return await dataAccess.ExecuteScalarAsync<int>("insert Investor(Name, InvestorType) output inserted.Id values(@Name, @InvestorType)", investor);
        }

        public static async Task<int> UpdateInvestorAsync(this MasterSideLetterDataAccess dataAccess, Investor investor)
        {
            return await dataAccess.ExecuteAsync("update Investor set Name = @Name, InvestorType = @InvestorType where Id = @Id",
                investor);
        }

        public static async Task<int> DeleteInvestorAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            return await dataAccess.ExecuteAsync("delete Investor where Id = @id", new { id });
        }

        public static async Task<IEnumerable<Investor>> GetFavoriteInvestorsAsync(this MasterSideLetterDataAccess dataAccess, string userName, int? limit = null)
        {
            var sql = new StringBuilder("select ");
            if (limit.HasValue)
            {
                sql.Append($" TOP {limit.Value} ");
            }

            sql.Append(@" i.* 
                ,   ui.IsFavorite
                ,   ui.LastAccessedDate
                from Investor i
                join UserInvestor ui
                on i.Id = ui.InvestorId 
                and ui.UserName = @userName
                where ui.IsFavorite = 1");

            var investorList = (await dataAccess.QueryAsync<Investor>(sql.ToString(), new { userName })).ToList();

            foreach (var investor in investorList)
            {
                var fundInvestor = await dataAccess.QueryFirstOrDefaultAsync<Investor>(
                  @"select  
                        InvestorId,
		                SUM(Commitment) as aggregated, 
		                Count(FundId) as fundNos 
	                    from [v_FundInvestor] where InvestorId  = @investorId
                        group by InvestorId", new { investorId = investor.Id });

                if (fundInvestor != null)
                {

                    investor.Aggregated = fundInvestor.Aggregated;
                    investor.FundNos = fundInvestor.FundNos;
                }
                await dataAccess.AddRecentInvestmentsAsync(investor);
            }

            return investorList;
        }

        public static async Task<IEnumerable<Investor>> GetRecentInvestorsAsync(this MasterSideLetterDataAccess dataAccess, string userName, int? limit = null)
        {
            var sql = new StringBuilder("select ");
            if (limit.HasValue)
            {
                sql.Append($" TOP {limit.Value} ");
            }

            sql.Append(@" i.* 
                ,   ui.IsFavorite
                ,   ui.LastAccessedDate
                from Investor i
                join UserInvestor ui
                on i.Id = ui.InvestorId 
                and ui.UserName = @userName
                order by ui.LastAccessedDate desc");

            var investorList = (await dataAccess.QueryAsync<Investor>(sql.ToString(), new { userName })).ToList();

            foreach (var investor in investorList)
            {
                var fundInvestor = await dataAccess.QueryFirstOrDefaultAsync<Investor>(
                  @"select  
                        InvestorId,
		                SUM(Commitment) as aggregated, 
		                Count(FundId) as fundNos 
	                    from [v_FundInvestor] where InvestorId  = @investorId
                        group by InvestorId", new { investorId = investor.Id });

                if (fundInvestor != null)
                {

                    investor.Aggregated = fundInvestor.Aggregated;
                    investor.FundNos = fundInvestor.FundNos;
                }
                await dataAccess.AddRecentInvestmentsAsync(investor);
            }

            return investorList;
        }

        public static async Task UpdateInvestorIsFavorite(this MasterSideLetterDataAccess dataAccess, int id, string userName, bool isFavorite)
        {
            await dataAccess.ExecuteAsync(
                @"update UserInvestor
                set IsFavorite = @isFavorite
                where InvestorId = @id
                and UserName = @userName 
                   
                if @@RowCount = 0 
                begin
                    insert UserInvestor(InvestorId,UserName,IsFavorite) values(@id, @userName, @isFavorite)
                end", new { userName, id, isFavorite });
        }

        public static async Task UpdateInvestorLastAccessedDate(this MasterSideLetterDataAccess dataAccess, int id, string userName)
        {
            await dataAccess.ExecuteAsync(@"update UserInvestor
                                set LastAccessedDate = getdate()
                                where InvestorId = @id
                                and UserName = @userName 
                                   
                                if @@RowCount = 0 
                                begin
                                    insert UserInvestor(InvestorId,UserName,LastAccessedDate) values(@id, @userName, getdate())
                                end", new { userName, id });
        }

        public static async Task<Investor> GetOrCreateInvestorAsync(this MasterSideLetterDataAccess dataAccess, string name, string type)
        {
            var existing = await dataAccess.GetInvestorByNameAsync(name);
            if (existing != null)
            {
                return existing;
            }
            var newInvestor = new Investor { Name = name, InvestorType = type };
            newInvestor.Id = await dataAccess.CreateInvestorAsync(newInvestor);
            return newInvestor;
        }

        public static async Task<List<Investor>> SearchInvestorsAsync(this MasterSideLetterDataAccess dataAccess, SearchRequest request)
        {
            var preparedQuery = new PreparedQuery(request);
            preparedQuery.Sql.Append("select");
            if (request.InvestorSearchLimit > 0)
            {
                preparedQuery.Sql.Append($" TOP {request.InvestorSearchLimit} ");
            }

            preparedQuery.Sql.Append(" i.* , ui.IsFavorite, ui.LastAccessedDate ");
            preparedQuery.Sql.Append(" from v_Investor i ");
            preparedQuery.Sql.Append(" left join UserInvestor ui ");
            preparedQuery.Sql.Append(" on i.Id = ui.InvestorId ");
            preparedQuery.Sql.Append(" and ui.UserName = @UserName ");
            preparedQuery.Sql.Append(" where 1=1 ");
            // apply target text to all text columns
            if (!string.IsNullOrEmpty(request.TargetText))
            {
                SearchHelper.AppendSearchCondition(request.TargetText,
                    new List<string>
                    {
                        "i.Name",
                        "i.InvestorType"
                    },
                    preparedQuery);

            }

            // apply relevant filters

            if (request.InvestorValues != null && request.InvestorValues.Length > 0)
            {
                preparedQuery.Sql.Append(" and i.Name in @InvestorValues ");
            }

            if (request.InvestorTypeValues != null && request.InvestorTypeValues.Length > 0)
            {
                preparedQuery.Sql.Append(" and i.InvestorType in @InvestorTypeValues ");
            }

            if (request.AggregateSizeMin.HasValue)
            {
                preparedQuery.Sql.Append(" and i.Aggregated >= @AggregateSizeMin ");
            }

            if (request.AggregateSizeMax.HasValue)
            {
                preparedQuery.Sql.Append(" and i.Aggregated <= @AggregateSizeMax ");
            }


            IEnumerable<Investor> results = await dataAccess.QueryAsync<Investor>(preparedQuery.Sql.ToString(), preparedQuery.Parameters);
            var investors = results.ToList();
            foreach (var investor in investors)
            {
                await dataAccess.AddRecentInvestmentsAsync(investor);
            }
            return investors;
        }


        private static async Task AddRecentInvestmentsAsync(this MasterSideLetterDataAccess dataAccess, Investor investor)
        {
            var recentInvestments = await dataAccess.QueryAsync<Investment>(
                @"select TOP 3 
                        FundId,
                        FundName,
                        FundYear
                        from [v_FundInvestor]
                        where InvestorId = @investorId
                        and FundId is not null
                        and FundName is not null
                        group by FundId,FundName,FundYear
                        order by FundYear desc, FundName asc", new { investorId = investor.Id });
            investor.RecentInvestments = recentInvestments.ToArray();
        }
    }


}
