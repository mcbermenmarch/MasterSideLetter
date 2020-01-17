using Newtonsoft.Json;

namespace BermenMarch.MasterSideLetter.Common.Model
{
    public class SearchRequest
    {
        public string TargetText { get; set; }

        public int FundSearchLimit { get; set; }
        public int InvestorSearchLimit { get; set; }
        public int SideLetterSearchLimit { get; set; }
        public int ProvisionSearchLimit { get; set; }

        public string SearchCategory { get; set; }
        public string[] FundValues { get; set; }
        public string[] InvestorValues { get; set; }

        public string[] SponsorValues { get; set; }
        public string[] BusinessUnitValues { get; set; }
        public string[] StrategyValues { get; set; }
        public string[] InvestorTypeValues { get; set; }

        public string[] ProvisionTypeValues { get; set; }
        public string[] EntityValues { get; set; }
        public string[] CounselValues { get; set; }
        public decimal? SizeMin { get; set; }
        public decimal? SizeMax { get; set; }
        public int? YearMin { get; set; }
        public int? YearMax { get; set; }
        public int? FundId { get; set; }
        public int? InvestorId { get; set; }
        public int[] FundInvestorIds { get; set; }
        public decimal? AggregateSizeMin { get; set; }
        public decimal? AggregateSizeMax { get; set; }
        public int? CommitmentMin { get; set; }
        public int? CommitmentMax { get; set; }


        public SearchRequest()
        {

        }

        public SearchRequest(SearchRequest request)
        {
            if (request != null)
            {
                TargetText = request.TargetText;
                FundSearchLimit = request.FundSearchLimit;
                InvestorSearchLimit = request.InvestorSearchLimit;
                SideLetterSearchLimit = request.SideLetterSearchLimit;
                ProvisionSearchLimit = request.ProvisionSearchLimit;
                SearchCategory = request.SearchCategory;
                FundValues = request.FundValues;
                InvestorValues = request.InvestorValues;
                SponsorValues = request.SponsorValues;
                BusinessUnitValues = request.BusinessUnitValues;
                StrategyValues = request.StrategyValues;
                InvestorTypeValues = request.InvestorTypeValues;
                ProvisionTypeValues = request.ProvisionTypeValues;
                EntityValues = request.EntityValues;
                CounselValues = request.CounselValues;
                SizeMin = request.SizeMin;
                SizeMax = request.SizeMax;
                YearMin = request.YearMin;
                YearMax = request.YearMax;
                FundId = request.FundId;
                InvestorId = request.InvestorId;
                FundInvestorIds = request.FundInvestorIds;
                AggregateSizeMin = request.AggregateSizeMin;
                AggregateSizeMax = request.AggregateSizeMax;
                CommitmentMin = request.CommitmentMin;
                CommitmentMax = request.CommitmentMax;
                UserName = request.UserName;
            }
        }


        [JsonIgnore] public string UserName { get; set; }


        public bool IsEmpty()
        {
            if (!string.IsNullOrEmpty(TargetText)) return false;
            if (FundValues != null && FundValues.Length > 0) return false;
            if (InvestorValues != null && InvestorValues.Length > 0) return false;
            if (SponsorValues != null && SponsorValues.Length > 0) return false;
            if (BusinessUnitValues != null && BusinessUnitValues.Length > 0) return false;
            if (StrategyValues != null && StrategyValues.Length > 0) return false;
            if (InvestorTypeValues != null && InvestorTypeValues.Length > 0) return false;
            if (ProvisionTypeValues != null && ProvisionTypeValues.Length > 0) return false;
            if (EntityValues != null && EntityValues.Length > 0) return false;
            if (CounselValues != null && CounselValues.Length > 0) return false;
            if (SizeMin != null) return false;
            if (SizeMax != null) return false;
            if (YearMin != null) return false;
            if (YearMax != null) return false;
            if (AggregateSizeMin != null) return false;
            if (AggregateSizeMax != null) return false;
            if (CommitmentMin != null) return false;
            if (CommitmentMax != null) return false;
            return true;
        }
    }
}
