using System.Collections.Generic;
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
    public class StrategyController : ControllerBase
    {
        private readonly MasterSideLetterDataAccess _dataAccess;

        public StrategyController(IOptions<ConnectionStrings> connectionStrings)
        {
            _dataAccess = new MasterSideLetterDataAccess(connectionStrings.Value.MasterSideLetterDb);
        }


        [NoCache]
        [HttpGet]
        public async Task<IEnumerable<Strategy>> Get()
        {
            var result = await _dataAccess.GetStrategiesAsync();
            return result;
        }


        [NoCache]
        [HttpGet("{id}")]
        public async Task<Strategy> Get(int id)
        {
            var result = await _dataAccess.GetStrategyAsync(id);
            return result;
        }

        [HttpPost]
        public async Task Post([FromBody]Strategy strategy)
        {
            await _dataAccess.CreateStrategyAsync(strategy);
        }

        [HttpPut]
        public async Task Put([FromBody]Strategy strategy)
        {
            await _dataAccess.UpdateStrategyAsync(strategy);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _dataAccess.DeleteStrategyAsync(id);
        }

    }
}
