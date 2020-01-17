using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using BermenMarch.MasterSideLetter.Common.AppSettings;
using BermenMarch.MasterSideLetter.Common.DataAccess;
using BermenMarch.MasterSideLetter.Common.Model;

namespace BermenMarch.MasterSideLetter.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SponsorController : ControllerBase
    {
        private readonly MasterSideLetterDataAccess _dataAccess;

        public SponsorController(IOptions<ConnectionStrings> connectionStrings)
        {
            _dataAccess = new MasterSideLetterDataAccess(connectionStrings.Value.MasterSideLetterDb);
        }

        [NoCache]
        [HttpGet]
        public async Task<IEnumerable<Sponsor>> Get()
        {
            var result = await _dataAccess.GetSponsorsAsync();
            return result;
        }


        [NoCache]
        [HttpGet("{id}")]
        public async Task<Sponsor> Get(int id)
        {
            var result = await _dataAccess.GetSponsorAsync(id);
            return result;
        }

        [HttpPost]
        public async Task Post([FromBody]Sponsor sponsor)
        {
            await _dataAccess.CreateSponsorAsync(sponsor);
        }

        [HttpPut]
        public async Task Put([FromBody]Sponsor sponsor)
        {
            await _dataAccess.UpdateSponsorAsync(sponsor);
        }


        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _dataAccess.DeleteSponsorAsync(id);
        }



    }
}