using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ESapi.Repository;
using Swashbuckle.AspNetCore.Annotations;

namespace ESapi.Controllers
{

    [Route("services/[controller]")]
    [SwaggerTag("This is a list of interfaces containing member account functionalities such as registering and loging in users.")]
    public class AccountController : Controller
    {
        readonly IConfiguration configuration;
        readonly IMemberRepository _memberRepo;
        readonly ILoggingRepository _loggingRepo;

        public AccountController(IConfiguration configuration, IMemberRepository memberRepository,
                            ILoggingRepository loggingRepository)
        {
            this.configuration = configuration;
            _memberRepo = memberRepository;
            _loggingRepo = loggingRepository;
        }

        /// <summary>
        /// creates JWT token.
        /// </summary>
        /// <param name="loginModel">The login credentials data.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("login")]
        public UserModel CreateToken([FromBody] LoginModel loginModel)
        {
            UserModel user = new UserModel();
            if (ModelState.IsValid)
            {
                var loginResult = _memberRepo.AuthenticateUser(loginModel.email, loginModel.password, "", "");
                if (loginResult != "")
                {
                    user.email = loginResult.Split("~")[1];
                    user.memberID = loginResult.Split("~")[0];
                    user.picturePath = loginResult.Split("~")[2];
                    var jwt = GetToken(user);
                    user.accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);
                    user.expiredDate = jwt.ValidTo;
                    user.name = loginResult.Split("~")[3];
                    user.title = loginResult.Split("~")[4];
                }
            }
            return user;
        }

        /// <summary>
        /// Login new registered user.
        /// </summary>
        /// <param name="body">The data model for the new registered user.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("loginNewRegisteredUser")]
        public UserModel LoginNewRegisteredUser([FromBody] NewRegisteredUser body)
        {
            UserModel user = new UserModel();
            if (ModelState.IsValid)
            {
                var loginResult = _memberRepo.AuthenticateNewRegisteredUser(body.email, body.code);
                if (loginResult != "")
                {
                    user.email = loginResult.Split("~")[1];
                    user.memberID = loginResult.Split("~")[0];
                    user.picturePath = loginResult.Split("~")[2];
                    var jwt = GetToken(user);
                    user.accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);
                    user.expiredDate = jwt.ValidTo;
                    user.name = loginResult.Split("~")[3];
                    user.title = loginResult.Split("~")[4];
                }
            }
            return user;
        }


        /// <summary>
        /// Refreshes a given token.
        /// </summary>
        /// <param name="accessToken">the old token that is to be refreshed.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("refreshLogin")]
        public UserModel RefreshToken([FromQuery] string accessToken)
        {
            string token = accessToken;
            // MemberDataManager mbrMgr = new MemberDataManager();
            var principal = GetPrincipalFromExpiredToken(token);
            var username = principal.Identity.Name; //this is mapped to the Name claim by default

            var user = new UserModel();
            var lst = _loggingRepo.FindByUniqueEmail(username);
            if (lst != null)
            {
                user.email = lst[0].email;
                user.memberID = lst[0].memberID;
                user.picturePath = lst[0].picturepath;
                var jwt = GetToken(user);
                user.accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);
                user.expiredDate = jwt.ValidTo;
            }
            return user;
        }

        /// <summary>
        /// Get principal from expired token.
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false, //you might want to validate the audience and issuer depending on your use case
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(this.configuration.GetValue<String>("Jwt:Key"))),
                ValidateLifetime = false //here we are saying that we don't care about the token's expiration date
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256Signature, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");
            return principal;
        }


        /// <summary>
        /// Registers a user.
        /// </summary>
        /// <param name="body">The user's information to register.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("register")]
        public String RegisterUser([FromBody] RegisterModel body)
        {
            //MemberDataManager mbrMgr = new MemberDataManager();
            return _memberRepo.RegisterUserToLG(body.firstName, body.lastName, body.email, body.password, body.day, body.month, body.year, body.gender, body.profileType);
        }

        #region helper routines...

        private JwtSecurityToken GetToken(UserModel user)
        {
            var utcNow = DateTime.Now;
            var claims = new Claim[]
            {
                        new Claim(JwtRegisteredClaimNames.Sub, user.memberID),
                        new Claim(JwtRegisteredClaimNames.UniqueName, user.email),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, utcNow.ToString())
            };
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("veryVerySecretKey"));
            var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var jwt = new JwtSecurityToken(
                signingCredentials: signingCredentials,
                claims: claims,
                notBefore: utcNow,
                expires: utcNow.AddSeconds(this.configuration.GetValue<int>("Jwt:Lifetime")),
                audience: this.configuration.GetValue<String>("Jwt:Issuer"),
                issuer: this.configuration.GetValue<String>("Tokens:Issuer")
            );
            return jwt;
        }

        #endregion

        #region class sub classes or model
        public class LoginModel
        {
            public string email { get; set; }
            public string password { get; set; }
        }

        public class UserModel
        {
            public string name { get; set; }
            public string title { get; set; }
            public string email { get; set; }
            public string memberID { get; set; }
            public string picturePath { get; set; }
            public string accessToken { get; set; }
            public DateTime expiredDate { get; set; }
        }

        public class RegisterModel
        {
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string email { get; set; }
            public string password { get; set; }
            public string day { get; set; }
            public string month { get; set; }
            public string year { get; set; }
            public string gender { get; set; }
            public string profileType { get; set; }

        }

        public class NewRegisteredUser
        {
            public string email { get; set; }
            public string code { get; set; }
        }
        #endregion
    }
}
