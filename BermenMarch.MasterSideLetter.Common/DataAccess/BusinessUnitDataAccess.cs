using System.Collections.Generic;
using System.Threading.Tasks;
using BermenMarch.MasterSideLetter.Common.Model;

namespace BermenMarch.MasterSideLetter.Common.DataAccess
{

    public static class BusinessUnitDataAccess
    {
        public  static  Task<BusinessUnit> GetBusinessUnitAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            return dataAccess.QueryFirstOrDefaultAsync<BusinessUnit>("select * from BusinessUnit where Id = @id", new { id });
        }


        public static Task<BusinessUnit> GetBusinessUnitByNameAsync(this MasterSideLetterDataAccess dataAccess, string name)
        {
            return dataAccess.QueryFirstOrDefaultAsync<BusinessUnit>("select * from BusinessUnit where Name = @name", new { name });
        }

        public static Task<IEnumerable<BusinessUnit>> GetBusinessUnitsAsync(this MasterSideLetterDataAccess dataAccess)
        {
            return dataAccess.QueryAsync<BusinessUnit>("select * from BusinessUnit");
        }

        public static Task<int> CreateBusinessUnitAsync(this MasterSideLetterDataAccess dataAccess, BusinessUnit businessUnit)
        {
            return dataAccess.ExecuteScalarAsync<int>("insert into BusinessUnit(Name) output inserted.Id values(@Name)", businessUnit);

        }


        public static Task<int> UpdateBusinessUnitAsync(this MasterSideLetterDataAccess dataAccess, BusinessUnit businessUnit)
        {
            return dataAccess.ExecuteAsync("update BusinessUnit set Name=@Name,ModifiedDate = getdate() where Id = @Id",  businessUnit);
        }


        public static Task<int> DeleteBusinessUnitAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            return dataAccess.ExecuteAsync("delete BusinessUnit where Id = @id", new { id });
        }


        public static async Task<BusinessUnit> GetOrCreateBusinessUnitAsync(this MasterSideLetterDataAccess dataAccess, string name)
        {
            var existing = await dataAccess.GetBusinessUnitByNameAsync(name);
            if (existing != null)
            {
                return existing;
            }
            var newBusinessUnit = new BusinessUnit {Name = name};
            newBusinessUnit.Id =  await dataAccess.CreateBusinessUnitAsync(newBusinessUnit);
            return newBusinessUnit;
        }
    }

}
