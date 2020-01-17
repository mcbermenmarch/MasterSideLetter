using System.Collections.Generic;

namespace BermenMarch.MasterSideLetter.Common.Model
{
    public class SearchResults
    {
        public List<Fund> FundRows { get; set; }
        public List<Investor> InvestorRows { get; set; }
        public List<Provision> ProvisionRows { get; set; }
        public List<FundInvestor> SideLetterRows { get; set; }
    }
}
