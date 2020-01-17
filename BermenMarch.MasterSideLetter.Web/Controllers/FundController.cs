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
    public class FundController : ControllerBase
    {
        private readonly string _user;

        private readonly ConnectionStrings _connectionStrings;

        public FundController(IHttpContextAccessor httpContextAccessor, IOptions<ConnectionStrings> connectionStrings)
        {
            _connectionStrings = connectionStrings.Value;
            _user = httpContextAccessor.HttpContext.User.Identity.Name;

        }

        [NoCache]
        [HttpGet]
        public async Task<IEnumerable<Fund>> Get()
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetFundsAsync(_user);
            }

        }


        [NoCache]
        [HttpGet("Search/{query}")]
        public async Task<IEnumerable<Fund>> Search(string query)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetFundsAsync(_user, query, 10);
            }
        }

        [NoCache]
        [HttpGet("{id}")]
        public async Task<Fund> Get(int id)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetFundAsync(id, _user);
            }
        }

        [HttpPost]
        public async Task<int> Post([FromBody] Fund fund)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.CreateFundAsync(fund);
            }
        }


        [HttpPost("CreateAndFavorite")]
        public async Task<int> CreateAndFavorite([FromBody] Fund fund)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                var id = await dataAccess.CreateFundAsync(fund);
                await dataAccess.UpdateFundIsFavoriteAsync(id, _user, true);
                return id;
            }
        }


        [HttpPut]
        public async Task Put([FromBody] Fund fund)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.UpdateFundAsync(fund);
            }
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.DeleteFundAsync(id);
            }
        }

        // Code for Recent and fav fund
        [NoCache]
        [HttpGet("GetFavoriteFunds/{limit?}")]
        public async Task<IEnumerable<Fund>> GetFavoriteFunds(int? limit = null)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetFavoriteFundsAsync(_user, limit);
            }
        }

        [NoCache]
        [HttpGet("GetRecentFunds/{limit?}")]
        public async Task<IEnumerable<Fund>> GetRecentFunds(int? limit = null)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetRecentFundsAsync(_user, limit);
            }
        }

        [NoCache]
        [HttpGet("UpdateIsFavorite/{id}/{value}")]
        public async Task UpdateIsFavorite(int id, bool value)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.UpdateFundIsFavoriteAsync(id, _user, value);
            }
        }


        [NoCache]
        [HttpGet("UpdateLastAccessedDate/{id}")]
        public async Task UpdateLastAccessedDate(int id)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.UpdateFundLastAccessedDateAsync(id, _user);
            }
        }



        [HttpPost("UploadMsl/{id}"), DisableRequestSizeLimit]
        public async Task UploadMsl(int id)
        {
            if (Request.Form.Files[0].Length > 0)
            {
                using (var readStream = Request.Form.Files[0].OpenReadStream())
                {
                    using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
                    {
                        await dataAccess.UpdateFundMslAsync(id, Request.Form.Files[0].FileName, readStream);
                    }
                }
            }
        }


        [HttpPost("UploadMfn/{id}"), DisableRequestSizeLimit]
        public async Task UploadMfn(int id)
        {
            if (Request.Form.Files[0].Length > 0)
            {
                using (var readStream = Request.Form.Files[0].OpenReadStream())
                {
                    using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
                    {
                        await dataAccess.UpdateFundMfnAsync(id, Request.Form.Files[0].FileName, readStream);
                    }
                }
            }
        }

        [NoCache]
        [HttpGet("DownloadMsl/{fundId}"), DisableRequestSizeLimit]
        public async Task<ActionResult> DownloadMsl(int fundId)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                var document = await dataAccess.GetFundMslAsync(fundId);
                return File(document.Content, System.Net.Mime.MediaTypeNames.Application.Octet, document.Name);
            }

        }


        [NoCache]
        [HttpGet("DownloadMfn/{fundId}"), DisableRequestSizeLimit]
        public async Task<ActionResult> DownloadMfn(int fundId)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                var document = await dataAccess.GetFundMfnAsync(fundId);
                return File(document.Content, System.Net.Mime.MediaTypeNames.Application.Octet, document.Name);
            }
        }


        [HttpDelete("RemoveMsl/{id}")]
        public async Task RemoveMsl(int id)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.RemoveMslFromFundAsync(id);
            }
        }

        [HttpDelete("RemoveMfn/{id}")]
        public async Task RemoveMfn(int id)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.RemoveMfnFromFundAsync(id);
            }
        }
    }
}
