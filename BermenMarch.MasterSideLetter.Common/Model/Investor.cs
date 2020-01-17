using System;

namespace BermenMarch.MasterSideLetter.Common.Model
{
    public class Investor:BaseEntity
    {
        public string InvestorId { get; set; }

        public string Name { get; set; }

        public string InvestorType { get; set; }

        public string Aggregated { get; set; }

        public string FundNos { get; set; }
        
        public Investment[] RecentInvestments { get; set; }

        public bool? IsFavorite { get; set; }

        public DateTime? LastAccessedDate{ get; set; }
    }

    public class Investment 
    {
        public int FundId { get; set; }
        public string FundName { get; set; }

    }
}
