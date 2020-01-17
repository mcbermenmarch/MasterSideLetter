using System;

namespace BermenMarch.MasterSideLetter.Common.Model
{
    public class Fund: BaseEntity
    {
        public string Name { get; set; }
        public int? SponsorId { get; set; }
        public string SponsorName { get; set; }
        public int? StrategyId { get; set; }
        public string StrategyName { get; set; }
        public int? BusinessUnitId { get; set; }
        public string BusinessUnitName { get; set; }
        public int? Year { get; set; }
        public decimal? Size { get; set; }
        public string MslFileName { get; set; }
        public string MfnFileName { get; set; }
        public bool? IsFavorite { get; set; }
        public DateTime? LastAccessedDate { get; set; }
    }
}

