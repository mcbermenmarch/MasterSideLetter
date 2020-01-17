using System;
using System.ComponentModel.DataAnnotations;

namespace BermenMarch.MasterSideLetter.Common.Model
{
    public class UserFund : BaseEntity
    {
        public string UserName { get; set; }
        public int FundId { get; set; }
        public bool IsFavorite { get; set; }
        public DateTime? LastAccessedDate { get; set; }
    }
}
