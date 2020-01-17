using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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
    public class SettingsController : ControllerBase
    {
        private readonly ConnectionStrings _connectionStrings;

        public SettingsController(IOptions<ConnectionStrings> connectionStrings)
        {
            _connectionStrings = connectionStrings.Value;

        }

        [NoCache]
        [HttpGet]
        public async Task<SearchSettings> Get()
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetSearchSettingsAsync();
            }
        }

        [HttpPut]
        public async Task Put([FromBody] SearchSettings settings)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.UpdateSearchSettingsAsync(settings);
            }
        }
    }
}
