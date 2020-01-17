using System;
using System.IO;
using System.IO.Compression;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using BermenMarch.MasterSideLetter.Common.AppSettings;
using BermenMarch.MasterSideLetter.Common.DataAccess;
using BermenMarch.MasterSideLetter.Common.Helpers;
using BermenMarch.MasterSideLetter.Common.Model;
using System.Linq;

namespace BermenMarch.MasterSideLetter.Web.Controllers
{
    [Authorize(Roles = "ApplicationUser")]
    [Route("api/[controller]")]
    [ApiController]
    public class FundInvestorController : ControllerBase
    {

        private readonly ConnectionStrings _connectionStrings;

        public FundInvestorController(IOptions<ConnectionStrings> connectionStrings)
        {
            _connectionStrings = connectionStrings.Value;
        }

        [NoCache]
        [HttpGet("GetListByFund/{fundId}")]
        public async Task<IEnumerable<FundInvestor>> GetListByFund(int fundId)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetFundInvestorsByFundAsync(fundId);
            }
        }


        [NoCache]
        [HttpGet("GetListByInvestor/{investorId}")]
        public async Task<IEnumerable<FundInvestor>> GetListByInvestor(int investorId)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.GetFundInvestorsByInvestorAsync(investorId);
            }
        }


        [HttpPost]
        public async Task<int> Post([FromBody] FundInvestor fundInvestor)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                return await dataAccess.CreateFundInvestorAsync(fundInvestor);
            }
        }


        [HttpPost("SaveAll")]
        public async Task SaveAll([FromBody] FundInvestor[] fundInvestors)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                foreach (var fundInvestor in fundInvestors)
                {
                    if (fundInvestor.Id == 0)
                    {
                        await dataAccess.CreateFundInvestorAsync(fundInvestor);
                    }
                    else
                    {
                        await dataAccess.UpdateFundInvestorAsync(fundInvestor);
                    }
                }
            }
        }


        [HttpPut]
        public async Task Put([FromBody] FundInvestor fundInvestor)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.UpdateFundInvestorAsync(fundInvestor);
            }
        }

        [HttpDelete("{Id}")]
        public async Task Delete(int id)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.DeleteFundInvestorAsync(id);
            }
        }

        [HttpPost("BatchDelete")]
        public async Task BatchDelete([FromBody] int[] ids)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.BatchDeleteFundInvestorAsync(ids);
            }
        }


        [HttpDelete("RemoveSideLetter/{id}")]
        public async Task RemoveSideLetter(int id)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                await dataAccess.RemoveFundInvestorSideLetterAsync(id);
            }
        }

        [HttpPost("UploadSideLetter/{id}"), DisableRequestSizeLimit]
        public async Task UploadSideLetter(int id)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                //save the document
                if (Request.Form.Files[0].Length > 0)
                {
                    var fileExtension = Path.GetExtension(Request.Form.Files[0].FileName).ToLower();
                    if (fileExtension != ".doc" && fileExtension != ".docx")
                    {
                        throw new ArgumentException($"Invalid file type {fileExtension}.");
                    }
                    using (var readStream = Request.Form.Files[0].OpenReadStream())
                    {
                        await dataAccess.UpdateFundInvestorSideLetterAsync(id, Request.Form.Files[0].FileName, readStream);
                        await dataAccess.DeleteProvisionsByFundInvestorAsync(id);
                        var paragraphs = fileExtension == ".docx" ? DocumentHelper.ExtractDocxParagraphs(readStream) : DocumentHelper.ExtractDocParagraphs(readStream);
                        foreach (var paragraph in paragraphs.Where(paragraph => !string.IsNullOrWhiteSpace(paragraph)))
                        {
                            await dataAccess.CreateProvisionAsync(new Provision {FundInvestorId = id, Content = paragraph});
                        }
                    }
                }
            }
        }

        [NoCache]
        [HttpGet("DownloadSideLetter/{id}"), DisableRequestSizeLimit]
        public async Task<ActionResult> DownloadSideLetter(int id)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                var document = await dataAccess.GetFundInvestorSideLetterAsync(id);
                return File(document.Content, System.Net.Mime.MediaTypeNames.Application.Octet, document.Name);
            }
        }


        [NoCache]
        [HttpGet("BatchDownload"), DisableRequestSizeLimit]
        public async Task<ActionResult> BatchDownload([FromQuery] string ids)
        {
            using (var ms = new MemoryStream())
            {
                if (!string.IsNullOrWhiteSpace(ids))
                {
                    using (var archive = new ZipArchive(ms, ZipArchiveMode.Create, true))
                    {
                        using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
                        {
                            foreach (var id in ids.Split(','))
                            {
                                var sideLetter = await dataAccess.GetFundInvestorSideLetterAsync(Convert.ToInt32(id));
                                if (sideLetter?.Name != null && sideLetter.Content != null)
                                {
                                    var zipEntry = archive.CreateEntry(sideLetter.Name);
                                    using (var zipEntryStream = zipEntry.Open())
                                    {
                                        zipEntryStream.Write(sideLetter.Content);
                                    }
                                }
                            }
                        }
                    }
                }
                return File(ms.ToArray(), "application/zip", "SideLetterArchive.zip");
            }
        }

        [HttpPost("FundBatchUpload/{fundId}"), DisableRequestSizeLimit]
        public async Task FundBatchUpload(int fundId)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                foreach (var file in Request.Form.Files)
                {
                    var fileExtension = Path.GetExtension(file.FileName).ToLower();
                    if (fileExtension != ".doc" && fileExtension != ".docx")
                    {
                        throw new ArgumentException($"Invalid file type {fileExtension}.");
                    }
                    var fundInvestor = new FundInvestor { FundId = fundId };
                    fundInvestor.Id = await dataAccess.CreateFundInvestorAsync(fundInvestor);
                    using (var readStream = file.OpenReadStream())
                    {
                        await dataAccess.UpdateFundInvestorSideLetterAsync(fundInvestor.Id, file.FileName, readStream);
                        await dataAccess.DeleteProvisionsByFundInvestorAsync(fundInvestor.Id);
                        var paragraphs = fileExtension == ".docx" ? DocumentHelper.ExtractDocxParagraphs(readStream) : DocumentHelper.ExtractDocParagraphs(readStream);

                        foreach (var paragraph in paragraphs.Where(paragraph => !string.IsNullOrWhiteSpace(paragraph)))
                        {
                            await dataAccess.CreateProvisionAsync(new Provision {FundInvestorId = fundInvestor.Id, Content = paragraph});
                        }
                    }
                }
            }
        }

        [HttpPost("InvestorBatchUpload/{investorId}"), DisableRequestSizeLimit]
        public async Task InvestorBatchUpload(int investorId)
        {
            using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
            {
                foreach (var file in Request.Form.Files)
                {
                    var fileExtension = Path.GetExtension(file.FileName).ToLower();
                    if (fileExtension != ".doc" && fileExtension != ".docx")
                    {
                        throw new ArgumentException($"Invalid file type {fileExtension}.");
                    }
                    var fundInvestor = new FundInvestor { InvestorId = investorId };
                    fundInvestor.Id = await dataAccess.CreateFundInvestorAsync(fundInvestor);
                    using (var readStream = file.OpenReadStream())
                    {
                        await dataAccess.UpdateFundInvestorSideLetterAsync(fundInvestor.Id, file.FileName, readStream);
                        await dataAccess.DeleteProvisionsByFundInvestorAsync(fundInvestor.Id);
                        var paragraphs = fileExtension ==".docx" ? DocumentHelper.ExtractDocxParagraphs(readStream) : DocumentHelper.ExtractDocParagraphs(readStream);
                        foreach (var paragraph in paragraphs.Where(paragraph => !string.IsNullOrWhiteSpace(paragraph)))
                        {
                            await dataAccess.CreateProvisionAsync(new Provision {FundInvestorId = fundInvestor.Id, Content = paragraph});
                        }
                    }
                }
            }
        }

        [NoCache]
        [HttpGet("GenerateMasterSideLetter")]
        public async Task<ActionResult> GenerateMasterSideLetter([FromQuery]int fundId, string fundInvestorIds)
        {
            if (!string.IsNullOrEmpty(fundInvestorIds))
            {
                var fundInvestorIdList = fundInvestorIds.Split(',').Select(x => Convert.ToInt32(x)).ToList();
                using (var dataAccess = new MasterSideLetterDataAccess(_connectionStrings.MasterSideLetterDb))
                {
                    var searchSettings = await dataAccess.GetSearchSettingsAsync();
                    var masterSideLetter = await dataAccess.GenerateMasterSideLetterContentAsync(fundId, fundInvestorIdList);
                    var mem = DocumentHelper.GenerateMasterSideLetterDocument(searchSettings, masterSideLetter);
                    return File(mem.ToArray(), "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "MasterSideLetter.docm");
                }
            }
            return null;
        }
    }
}
