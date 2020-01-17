using System.Threading.Tasks;
using BermenMarch.MasterSideLetter.Common.Model;

namespace BermenMarch.MasterSideLetter.Common.DataAccess
{
    public static class SearchSettingsDataAccess
    {
        public static async Task<SearchSettings> GetSearchSettingsAsync(this MasterSideLetterDataAccess dataAccess)
        {
            return await dataAccess.QueryFirstOrDefaultAsync<SearchSettings>("select * from SearchSettings");
        }

        public static  async Task<int> UpdateSearchSettingsAsync(this MasterSideLetterDataAccess dataAccess, SearchSettings settings)
        {
            return await dataAccess.ExecuteAsync(
                @"update SearchSettings 
                    set Algorithm1Weight = @Algorithm1Weight, 
                    Algorithm2Weight = @Algorithm2Weight,
                    Algorithm3Weight = @Algorithm3Weight,
                    Algorithm1Threshold = @Algorithm1Threshold, 
                    Algorithm2Threshold = @Algorithm2Threshold,
                    Algorithm3Threshold = @Algorithm3Threshold,
                    WeightedThreshold = @WeightedThreshold, 
                    InheritThreshold = @InheritThreshold,
                    MslGroupingThreshold = @MslGroupingThreshold", settings);
        }
    }
}
