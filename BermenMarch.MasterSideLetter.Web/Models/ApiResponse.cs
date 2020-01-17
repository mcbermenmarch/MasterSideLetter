using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace BermenMarch.MasterSideLetter.Web.Models
{
    public class ApiResponse
    {
        [JsonProperty("data")]
        public object Data { get; set; }

        [JsonProperty("meta")]
        public Meta Meta { get; set; }
       
    }

    public class Meta
    {
        [JsonProperty("total")]
        public int Total { get; set; }

        [JsonProperty("error")]
        public string Error { get; set; }
    }
}
