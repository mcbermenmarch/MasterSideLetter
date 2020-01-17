using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using BermenMarch.MasterSideLetter.Common.AppSettings;
using BermenMarch.MasterSideLetter.Common.DataAccess;
using BermenMarch.MasterSideLetter.Common.Model;
using BermenMarch.MasterSideLetter.Common.Helpers;

namespace BermenMarch.MasterSideLetter.Web.Controllers
{
    [Authorize(Roles = "ApplicationUser")]
    [Route("api/[controller]")]
    [ApiController]
    public class ProvisionController : ControllerBase
    {

        private readonly ConnectionStrings _connectionStrings;

        public ProvisionController(IOptions<ConnectionStrings> connectionStrings)
        {
            _connectionStrings = connectionStrings.Value;
        }

        [NoCache]
        [HttpGet("SearchProvisionTypes/{query}")]
        public async Task<IEnumerable<string>> SearchProvisionTypes(string query)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.SearchProvisionTypesAsync(query,10);
            }
        }

        [NoCache]
        [HttpGet("{id}")]
        public async Task<Provision> Get(int id)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetProvisionAsync(id);
            }
        }

        [NoCache]
        [HttpGet("GetListByFundInvestor/{fundInvestorId}")]
        public async Task<IEnumerable<Provision>> GetListByFundInvestor(int fundInvestorId)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetProvisionsByFundInvestorAsync(fundInvestorId);
            }
        }

        [HttpPost("GetListByFundInvestors")]
        public async Task<IEnumerable<Provision>> GetListByFundInvestors([FromBody] List<int> fundInvestorIds)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetProvisionsByFundInvestorsAsync(fundInvestorIds);
            }
        }

        [HttpPost]
        public async Task<int> Post([FromBody] Provision provision)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                if (string.IsNullOrWhiteSpace(provision.Content)) return 0;
                return await dataAccess.CreateProvisionAsync(provision);
            }
        }

        [HttpPut]
        public async Task Put([FromBody] Provision provision)
        {
            if (string.IsNullOrEmpty(provision.Content))
            {
                throw new ApplicationException("Provision must have content.");
            }
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.UpdateProvisionAsync(provision);
            }
        }

        [HttpDelete("{Id}")]
        public async Task Delete(int id)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.DeleteProvisionAsync(id);
            }
        }

        [HttpDelete("DeleteByFundInvestor/{fundInvestorId}")]
        public async Task DeleteByFundInvestor(int fundInvestorId)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.DeleteProvisionsByFundInvestorAsync(fundInvestorId);
            }
        }

        [HttpPost("InheritProvisionTypes")]
        public async Task InheritProvisionTypes([FromBody] List<int> provisionIds)
        {
            await ProvisionComparison.InheritProvisionTypesAsync(provisionIds, _connectionStrings.MasterSideLetterDb);
        }

    }
}
