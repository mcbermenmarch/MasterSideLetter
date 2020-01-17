using System;

namespace BermenMarch.MasterSideLetter.Common.Model
{
    public class Provision : BaseEntity
    {
        private string _content;
        public int FundInvestorId { get; set; }
        public string ProvisionType { get; set; }
        public bool IsProvisionTypeInherited { get; set; }

        public string Content
        {
            get => _content;
            set => _content = value?.Trim();
        }

        public string Notes { get; set; }
        public string HtmlContent { get; set; }
        public double MatchScore { get; set; }


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
        public string SideLetterFileName { get; set; }


    }
}