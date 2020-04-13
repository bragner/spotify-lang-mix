using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace auth_core.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class AccessController : ControllerBase
    {
        private IHttpContextAccessor _accessor;
        string clientId = "";
        string clientSecret = "";
        string tokenEndpoint = "https://accounts.spotify.com/api/token";

        static Dictionary<string, string> ssoUsers = new Dictionary<string, string>();
        static Dictionary<string, string> refreshTokens = new Dictionary<string, string>();

        public AccessController(IHttpContextAccessor accessor)
        {
            _accessor = accessor;
        }

        [HttpPost("accessToken")]
        public async Task<IActionResult> AccessToken([FromBody]Auth auth)
        {
            using (var client = new HttpClient())
            {
                var body = new Dictionary<string, string>();
                body.Add("grant_type", "authorization_code");
                body.Add("redirect_uri", "https://localhost:3000/login");
                body.Add("client_id", clientId);
                body.Add("client_secret", clientSecret);
                body.Add("code", auth.Code);
                var response = await client.PostAsync(tokenEndpoint, new FormUrlEncodedContent(body));
                string result = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode) return this.StatusCode((int)response.StatusCode, result);

                dynamic authResult = JsonConvert.DeserializeObject(result);

                var id = Guid.NewGuid().ToString();
                var refreshToken = authResult["refresh_token"].Value.ToString();
                var ip = _accessor.HttpContext.Connection.RemoteIpAddress.ToString();
                ssoUsers.Add(ip, id);
                refreshTokens.Add(id, refreshToken);

                Response.Cookies.Append("sso", id, new Microsoft.AspNetCore.Http.CookieOptions
                {
                    Secure = true,
                    Expires = DateTime.Now.AddMonths(1),
                    HttpOnly = true
                });
                return Ok(result);
            }
        }
        [HttpPost("sso")]
        public async Task<IActionResult> SSO()
        {
            string ssoId = _accessor.HttpContext.Request.Cookies["sso"];

            if (ssoId == null) return NotFound();

            var ip = _accessor.HttpContext.Connection.RemoteIpAddress.ToString();
            var ssoUser = ssoUsers.FirstOrDefault(x => x.Key == ip && x.Value == ssoId);

            if (ssoUser.Key == null || ssoUser.Value == null) return NotFound();

            var refreshToken = refreshTokens.FirstOrDefault(x => x.Key == ssoId);

            if (refreshToken.Key == null || refreshToken.Value == null) return NotFound();

            using (var client = new HttpClient())
            {
                var body = new Dictionary<string, string>();
                body.Add("grant_type", "refresh_token");
                body.Add("refresh_token", refreshToken.Value);
                body.Add("client_id", clientId);
                body.Add("client_secret", clientSecret);

                var response = await client.PostAsync(tokenEndpoint, new FormUrlEncodedContent(body));
                string result = await response.Content.ReadAsStringAsync();

                return Ok(result);
            }
        }
    }
    public class Auth
    {
        public string Code { get; set; }
    }
}
