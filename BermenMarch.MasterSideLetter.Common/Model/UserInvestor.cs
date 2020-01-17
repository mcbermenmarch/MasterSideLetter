using System;
using System.ComponentModel.DataAnnotations;

namespace BermenMarch.MasterSideLetter.Common.Model
{
    public class UserInvestor : BaseEntity
    {
        public string UserName { get; set; }
        public int InvestorId { get; set; }
        public bool IsFavorite { get; set; }
        public DateTime? LastAccessedDate { get; set; }
    }
}
