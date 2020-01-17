using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using BermenMarch.MasterSideLetter.Common.AppSettings;
using BermenMarch.MasterSideLetter.Common.DataAccess;
using BermenMarch.MasterSideLetter.Common.Model;

namespace BermenMarch.MasterSideLetter.Web.Controllers
{
    [Authorize(Roles = "ApplicationUser")]
    [Route("api/[controller]")]
    [ApiController]
    public class InvestorController : ControllerBase
    {
        private readonly string _user;

        private readonly ConnectionStrings _connectionStrings;

        public InvestorController(IHttpContextAccessor httpContextAccessor, IOptions<ConnectionStrings> connectionStrings)
        {
            _connectionStrings = connectionStrings.Value;
            _user = httpContextAccessor.HttpContext.User.Identity.Name;
        }


        [NoCache]
        [HttpGet]
        public async Task<IEnumerable<Investor>> Get()
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetInvestorsAsync(_user);
            }

        }

        [NoCache]
        [HttpGet("InvestorTypeSearch/{query}")]
        public async Task<IEnumerable<Investor>> InvestorTypeSearch(string query)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetInvestorsAsync(_user,null, query);
            }
        }

        [NoCache]
        [HttpGet("Search/{query}")]
        public async Task<IEnumerable<Investor>> Search(string query)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetInvestorsAsync(_user, query,null, 10);
            }
        }

        [NoCache]
        [HttpGet("{id}")]
        public async Task<Investor> Get(int id)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetInvestorAsync(id, _user);
            }
        }

        [HttpPost]
        public async Task<int> Post([FromBody] Investor investor)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.CreateInvestorAsync(investor);
            }
        }


        [HttpPost("CreateAndFavorite")]
        public async Task<int> CreateAndFavorite([FromBody] Investor investor)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                var id = await dataAccess.CreateInvestorAsync(investor);
                await dataAccess.UpdateInvestorIsFavorite(id, _user, true);
                return id;
            }
        }


        [HttpPut]
        public async Task Put([FromBody] Investor investor)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.UpdateInvestorAsync(investor);
            }
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.DeleteInvestorAsync(id);
            }
        }

        // Code for Recent and fav investor
        [NoCache]
        [HttpGet("GetFavoriteInvestors/{limit?}")]
        public async Task<IEnumerable<Investor>> GetFavoriteInvestors(int? limit = null)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetFavoriteInvestorsAsync(_user, limit);
            }
        }

        [NoCache]
        [HttpGet("GetRecentInvestors/{limit?}")]
        public async Task<IEnumerable<Investor>> GetRecentInvestors(int? limit = null)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetRecentInvestorsAsync(_user, limit);
            }
        }

        [NoCache]
        [HttpGet("UpdateIsFavorite/{id}/{value}")]
        public async Task UpdateIsFavorite(int id, bool value)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.UpdateInvestorIsFavorite(id, _user, value);
            }
        }


        [NoCache]
        [HttpGet("UpdateLastAccessedDate/{id}")]
        public async Task UpdateLastAccessed(int id)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.UpdateInvestorLastAccessedDate(id, _user);
            }
        }
    }
}
