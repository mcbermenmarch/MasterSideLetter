using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Primitives;

namespace BermenMarch.MasterSideLetter.Web.Controllers
{
    public class NoCacheAttribute : ResultFilterAttribute
    {
        public override void OnResultExecuting(ResultExecutingContext context)
        {
            context.HttpContext.Response.Headers.Add("Cache-control", new StringValues(new[]
            {
                "no-cache",
                "no-store"
            }));
  
            context.HttpContext.Response.Headers.Add("Pragma", "no-cache");
            context.HttpContext.Response.Headers.Add("Expires", "0");
            base.OnResultExecuting(context);
        }
    }
}
