using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using BermenMarch.MasterSideLetter.Common.AppSettings;
using BermenMarch.MasterSideLetter.Common.DataAccess;
using BermenMarch.MasterSideLetter.Common.Model;
using Microsoft.AspNetCore.Http;
using BermenMarch.MasterSideLetter.Common.Helpers;

namespace BermenMarch.MasterSideLetter.Web.Controllers
{
    [Authorize(Roles = "ApplicationUser")]
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly string _user;
        private readonly ConnectionStrings _connectionStrings;

        public SearchController(IHttpContextAccessor httpContextAccessor, IOptions<ConnectionStrings> connectionStrings)
        {
            _connectionStrings = connectionStrings.Value;
            _user = httpContextAccessor.HttpContext.User.Identity.Name;

        }

        [HttpPost("StandardSearch")]
        public async Task<SearchResults> StandardSearch([FromBody] SearchRequest searchRequestModel)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                searchRequestModel.UserName = _user;
                return await dataAccess.GetResultsAsync(searchRequestModel);
            }
        }


        [HttpPost("PrecedentSearch")]
        public async Task<IEnumerable<Provision>> PrecedentSearch([FromBody]SearchRequest request)
        {
            return await ProvisionComparison.PrecedentSearchAsync(request, _connectionStrings.MasterSideLetterDb);
        }


        [HttpPost("GetFundResults")]
        public async Task<IEnumerable<Fund>> GetFundResults([FromBody] SearchRequest searchRequestModel)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                searchRequestModel.UserName = _user;
                return await dataAccess.SearchFundsAsync(searchRequestModel);
            }
        }

        [HttpPost("GetInvestorResults")]
        public async Task<IEnumerable<Investor>> GetInvestorResults([FromBody] SearchRequest searchRequestModel)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                searchRequestModel.UserName = _user;
                return await dataAccess.SearchInvestorsAsync(searchRequestModel);
            }
        }

        [HttpPost("GetSideLetterResults")]
        public async Task<IEnumerable<FundInvestor>> GetSideLetterResults([FromBody] SearchRequest searchRequestModel)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                searchRequestModel.UserName = _user;
                return await dataAccess.SearchFundInvestorsAsync(searchRequestModel);
            }
        }

        [HttpPost("GetProvisionResults")]
        public async Task<IEnumerable<Provision>> GetProvisionResults([FromBody] SearchRequest searchRequestModel)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                searchRequestModel.UserName = _user;
                return await dataAccess.SearchProvisionsAsync(searchRequestModel);
            }
        }

        [HttpPost("GetFilterContent")]
        public async Task<IEnumerable<string>> GetFilterContent([FromBody] FilterContentRequest filterContentRequest)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetFilterContentAsync(filterContentRequest);
            }
        }


        [NoCache]
        [HttpGet("GetPhrases/{query}")]
        public IEnumerable<string> GetPhrases(string query)
        {
            var phrases =  SearchHelper.GetPhrases(query);
            for (var p = 0; p < phrases.Length; p++)
            {
                if(phrases[p] == "AND")continue;
                if(phrases[p]  == "OR")continue;
                if (phrases[p] == "NOT")
                {
                    p++;
                    if(p>=phrases.Length)break;
                    continue;
                }
                yield return phrases[p];
            }
        }
    }
}