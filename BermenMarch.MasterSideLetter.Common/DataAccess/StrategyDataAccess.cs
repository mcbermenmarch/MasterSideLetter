using System.Collections.Generic;
using System.Threading.Tasks;
using BermenMarch.MasterSideLetter.Common.Model;

namespace BermenMarch.MasterSideLetter.Common.DataAccess
{
    public static class StrategyDataAccess
    {
        public static Task<Strategy> GetStrategyAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            return dataAccess.QueryFirstOrDefaultAsync<Strategy>("select * from Strategy where Id = @id", new { id });
        }

        public static Task<Strategy> GetStrategyByNameAsync(this MasterSideLetterDataAccess dataAccess, string name)
        {
            return dataAccess.QueryFirstOrDefaultAsync<Strategy>("select * from Strategy where Name = @name", new { name });
        }

        public static Task<IEnumerable<Strategy>> GetStrategiesAsync(this MasterSideLetterDataAccess dataAccess)
        {
            return dataAccess.QueryAsync<Strategy>("select * from Strategy");
        }

        public static Task<int> CreateStrategyAsync(this MasterSideLetterDataAccess dataAccess, Strategy strategy)
        {
            return dataAccess.ExecuteScalarAsync<int>("insert into Strategy(Name) output inserted.Id values(@Name)", strategy);
        }

        public static Task<int> UpdateStrategyAsync(this MasterSideLetterDataAccess dataAccess, Strategy strategy)
        {
            return dataAccess.ExecuteAsync("update Strategy set Name=@Name, ModifiedDate = getdate() where Id = @id", strategy);
        }

        public static Task<int> DeleteStrategyAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            return dataAccess.ExecuteAsync("delete Strategy where Id = @id", new { id });
        }

        public static async Task<Strategy> GetOrCreateStrategyAsync(this MasterSideLetterDataAccess dataAccess, string name)
        {
            var existing = await dataAccess.GetStrategyByNameAsync(name);
            if (existing != null)
            {
                return existing;
            }
            var newStrategy = new Strategy {Name = name};
            newStrategy.Id = await dataAccess.CreateStrategyAsync(newStrategy);
            return newStrategy;
        }
    }
}
