namespace BermenMarch.MasterSideLetter.Common.AppSettings
{
    public class ConnectionStrings
    {
        public string MasterSideLetterDb { get; set; }

        public ConnectionStrings()
        {

        }

        public ConnectionStrings(string masterSideLetterDb)
        {
            MasterSideLetterDb = masterSideLetterDb;

        }
    }
}
