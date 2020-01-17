using System.Collections.Generic;
using System.Threading.Tasks;
using BermenMarch.MasterSideLetter.Common.Model;

namespace BermenMarch.MasterSideLetter.Common.DataAccess
{
    public static class SponsorDataAccess
    {
        public static Task<Sponsor> GetSponsorAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            return dataAccess.QueryFirstOrDefaultAsync<Sponsor>("select * from Sponsor where Id = @id", new { id });
        }

        public static Task<Sponsor> GetSponsorByNameAsync(this MasterSideLetterDataAccess dataAccess, string name)
        {
            return dataAccess.QueryFirstOrDefaultAsync<Sponsor>("select * from Sponsor where Name = @name", new { name });
        }

        public static Task<IEnumerable<Sponsor>> GetSponsorsAsync(this MasterSideLetterDataAccess dataAccess)
        {
            return dataAccess.QueryAsync<Sponsor>("select * from Sponsor");
        }

        public static Task<int> CreateSponsorAsync(this MasterSideLetterDataAccess dataAccess, Sponsor sponsor)
        {
            return dataAccess.ExecuteScalarAsync<int>("insert into Sponsor(Name) output inserted.Id values(@Name)", sponsor);

        }

        public static Task UpdateSponsorAsync(this MasterSideLetterDataAccess dataAccess, Sponsor sponsor)
        {
            return dataAccess.ExecuteAsync("update Sponsor set Name=@Name, ModifiedDate = getdate() where Id = @Id", sponsor);
        }

        public static Task DeleteSponsorAsync(this MasterSideLetterDataAccess dataAccess, int id)
        {
            return dataAccess.ExecuteAsync("delete Sponsor where Id = @id", new { id });
        }

        public static async Task<Sponsor> GetOrCreateSponsorAsync(this MasterSideLetterDataAccess dataAccess, string name)
        {
            var existing = await dataAccess.GetSponsorByNameAsync(name);
            if (existing != null)
            {
                return existing;
            }
            var newSponsor = new Sponsor {Name = name};
            newSponsor.Id = await dataAccess.CreateSponsorAsync(newSponsor);
            return newSponsor;
        }
    }

}
