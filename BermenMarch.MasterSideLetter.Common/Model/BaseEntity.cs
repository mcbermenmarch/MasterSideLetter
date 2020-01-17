using System;
using Newtonsoft.Json;

namespace BermenMarch.MasterSideLetter.Common.Model
{
    public class BaseEntity
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonIgnore]
        public DateTime? CreatedDate { get; set; }

        [JsonIgnore]
        public DateTime? ModifiedDate { get; set; }
    }
}
