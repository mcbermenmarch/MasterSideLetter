namespace BermenMarch.MasterSideLetter.Common.Model
{
    public class FundInvestor : BaseEntity
    {
        //fund details
        public int? FundId { get; set; }
        public string FundName { get; set; }
        public string FundSponsorName { get; set; }
        public string FundBusinessUnitName { get; set; }
        public string FundStrategyName { get; set; }

        public int? FundYear { get; set; }
        public decimal? FundSize { get; set; }


        //investor details
        public int? InvestorId { get; set; }
        public string InvestorName { get; set; }
        public string InvestorType { get; set; }

        //Fund investor details
        public string Entity { get; set; }
        public decimal? Commitment { get; set; }
        public string Counsel { get; set; }
        public string Notes { get; set; }
        public string SideLetterFileName { get; set; }
    }
}
