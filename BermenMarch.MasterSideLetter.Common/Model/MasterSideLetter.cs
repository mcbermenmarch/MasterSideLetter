using System;
using System.Collections.Generic;

namespace BermenMarch.MasterSideLetter.Common.Model
{
    public class MasterSideLetterContent
    {
        public Fund Fund { get; set; }
        public readonly List<ProvisionTypeSection> ProvisionTypeSections = new List<ProvisionTypeSection>();
        
        public readonly List<FundInvestor> FundInvestors = new List<FundInvestor>();

        public class ProvisionTypeSection
        {
            public string ProvisionType { get; set; }
            public readonly List<ProvisionSection> ProvisionSections = new List<ProvisionSection>();
        }

        public class ProvisionSection
        {
			private string _content;
            public string Content
            {
                get => _content;
                set => _content = Helpers.XmlHelper.RemoveInvalidXmlChars(value);
            }
            public readonly List<FundInvestor> FundInvestors = new List<FundInvestor>();
        }
    }
}
