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
    public class BusinessUnitController : ControllerBase
    {
        private readonly MasterSideLetterDataAccess _dataAccess;

        public BusinessUnitController(IOptions<ConnectionStrings> connectionStrings)
        {
            _dataAccess = new MasterSideLetterDataAccess(connectionStrings.Value.MasterSideLetterDb);
        }

        [NoCache]
        [HttpGet]
        public async Task<IEnumerable<BusinessUnit>> Get()
        {
            return await _dataAccess.GetBusinessUnitsAsync();
        }

        [NoCache]
        [HttpGet ("{id}")]
        public async Task<BusinessUnit> Get(int id)
        {
            return await _dataAccess.GetBusinessUnitAsync(id);
        }

        [HttpPost]
        public async Task<int> Post([FromBody] BusinessUnit model)
        {
            return await _dataAccess.CreateBusinessUnitAsync(model);
        }

        [HttpPut]
        public async Task Put([FromBody] BusinessUnit model)
        {
            await _dataAccess.UpdateBusinessUnitAsync(model);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _dataAccess.DeleteBusinessUnitAsync(id);
        }
    }
}
