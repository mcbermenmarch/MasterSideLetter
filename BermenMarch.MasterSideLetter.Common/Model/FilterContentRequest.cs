namespace BermenMarch.MasterSideLetter.Common.Model
{
    public class FilterContentRequest
    {
        public string TargetText { get; set; }
        public string FilterType { get; set; }
        public int FilterLimit { get; set; }
    }
}
