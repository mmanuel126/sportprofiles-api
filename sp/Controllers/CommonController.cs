using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;
using System.Text;
using System.Net.Http;
using ESapi.Repository;
using ESapi.DBContextModels ;
using ESapi.Models;
using ESapi.Models.Members;
using Swashbuckle.AspNetCore.Annotations;
using NReco.Logging.File;
using System.IO;


namespace ESapi.Controllers
{
    /// <summary>
    /// a collection of common interfaces and shared functionalities used by the ES.
    /// </summary>
    [Route("services/[controller]")]
    [SwaggerTag("a collection of common interfaces and shared functionalities used by the ES.")]
    public class CommonController : Controller
    {
        
        readonly ICommonRepository _comRepo;
        readonly ILogger<CommonController> _log;
        readonly ILogger _loggerFactory;

        public CommonController(ILogger<CommonController> log, ICommonRepository comRepo, ILoggerFactory loggerFactory)
        {
            _comRepo = comRepo;
            _log = log;
            _loggerFactory = loggerFactory.CreateLogger("ES_ANGULAR_APP"); 
        }

        private static string IV = "IV_VALUE_16_BYTE";
        private static string PASSWORD = "PASSWORD_VALUE";
        private static string SALT = "SALT_VALUE";

        /// <summary>
        /// Encrypts the given string.
        /// </summary>
        /// <param name="encrypt">The string to encrypt.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("EncryptString")]
        public string EncryptString([FromQuery] string encrypt)
        //public static string EncryptAndEncode(string raw)
        {
            using (var csp = new AesCryptoServiceProvider())
            {
                ICryptoTransform e = GetCryptoTransform(csp, true);
                byte[] inputBuffer = Encoding.UTF8.GetBytes(encrypt);
                byte[] output = e.TransformFinalBlock(inputBuffer, 0, inputBuffer.Length);
                string encrypted = Convert.ToBase64String(output);
                return encrypted;
            }
        }

        /// <summary>
        /// Decrypt an encrypted string.
        /// </summary>
        /// <param name="encrypted">The encrypted string to be decrypted.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("DecryptString")]
        public string DecryptString([FromQuery] string encrypted)
        {
            using (var csp = new AesCryptoServiceProvider())
            {
                var d = GetCryptoTransform(csp, false);
                byte[] output = Convert.FromBase64String(encrypted);
                byte[] decryptedOutput = d.TransformFinalBlock(output, 0, output.Length);
                string decypted = Encoding.UTF8.GetString(decryptedOutput);
                return decypted;
            }
        }

        private static ICryptoTransform GetCryptoTransform(AesCryptoServiceProvider csp, bool encrypting)
        {
            csp.Mode = CipherMode.CBC;
            csp.Padding = PaddingMode.PKCS7;
            var spec = new Rfc2898DeriveBytes(Encoding.UTF8.GetBytes(PASSWORD), Encoding.UTF8.GetBytes(SALT), 65536);
            byte[] key = spec.GetBytes(16);


            csp.IV = Encoding.UTF8.GetBytes(IV);
            csp.Key = key;
            if (encrypting)
            {
                return csp.CreateEncryptor();
            }
            return csp.CreateDecryptor();
        }

        /// <summary>
        /// Gets the list of states.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <returns>The states.</returns>
        [HttpGet]
        [Authorize]
        [Route("GetStates")]
        public List<TbStates> GetStates([FromHeader] string authorization)
        {
            return _comRepo.GetStates();
        }


        /// <summary>
        /// Logs the specified obj log model to file including error msg and stack trace.
        /// </summary>
        /// <param name="message">the error message to log.</param>
        /// <param name="stack">the errorstack to log.</param>
        [HttpGet]
        [Route("Logs")]
        public void Logs([FromQuery] string message, [FromQuery] string stack)
        {
            string datetime = DateTime.Now.ToLongDateString();
            string logText = LogText(message, stack, "0", datetime, "", "");
            _loggerFactory.LogError(logText);
        }

        /// <summary>
        /// Returns git hub jobs for given criteria found in body obj.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="obj">Contains the search criteria data.</param>
        /// <returns></returns>
        [HttpPost]
        [Authorize]
     
        [Route("GetGitHubJobs")]
        public string GetGitHubJobs([FromHeader] string authorization, [FromBody] jobParamsModel obj)
        {
            try
            {
                var url = "https://jobs.github.com/positions.json?";

                if (!string.IsNullOrEmpty(obj.description))
                {
                    url = url + "description=" + obj.description;
                }
                else
                {
                    url = url + "description=";
                }

                if (!string.IsNullOrEmpty(obj.location))
                {
                    url = url + "&location=" + obj.location;
                }

                if (!string.IsNullOrEmpty(obj.full_time))
                {
                    url = url + "&full_time=" + obj.full_time;
                }

                if (!string.IsNullOrEmpty(obj.latitude))
                {
                    url = url + "&lat=" + obj.latitude;
                }

                if (!string.IsNullOrEmpty(obj.longitude))
                {
                    url = url + "&long=" + obj.longitude;
                }

                using (var httpClient = new HttpClient())
                {
                    var response = httpClient.GetStringAsync(new Uri(url)).Result;
                    return response;
                }
            }
            catch (Exception ex)
            {
                return ex.Message + "     " + ex.StackTrace.ToString();
            }
        }

        /// <summary>
        /// returns sports lists.
        /// </summary>
        /// <param name="authorization"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        [Route("GetSportsList")]
        public List<SportsListModel> GetSportsList([FromHeader] string authorization)
        {
               return _comRepo.GetSportsList();
        }

         /// <summary>
        /// Gets school by state.
        /// </summary>
        /// <returns>The school by state.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="state">State.</param>
        /// <param name="institutionType">Institution type.</param>
        [HttpGet]
        [Authorize]
         [Route("GetSchoolByState")]
        public List<SchoolByStateModel> GetSchoolByState([FromHeader] string authorization, [FromQuery] string state, [FromQuery] string institutionType)
        {
            return _comRepo.GetSchoolsByState(state, institutionType);
        }


        /// <summary>
        /// returns a list of ads depending on type.
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        [Route("GetAds")]
        public List<AdsModel> GetAds([FromQuery] string type)
        {
            return _comRepo.GetAds (type);
        }

        /// <summary>
        /// Logs the text.
        /// </summary>
        /// <returns>The text.</returns>
        /// <param name="msg">Message.</param>
        /// <param name="stack">Stack.</param>
        /// <param name="level">Level.</param>
        /// <param name="dateTime">Date time.</param>
        /// <param name="fileName">File name.</param>
        /// <param name="fileNumber">File number.</param>
        private string LogText(string msg, string stack, string level, string dateTime, string fileName, string fileNumber)
        {
            string txt = "";
            //txt = txt + "File Name: ";
            //txt = txt + fileName + "; File Number: " + fileNumber + "\n\n";
            txt = txt + "\n";
            txt = txt + "Message: " + msg + "\n";
            txt = txt + "Stack Trace: " + stack + "\n";
            txt = txt + "\n";
            return txt;
        }
    }

    public class LogModel
    {
        public string message { get; set; }
        public string stack { get; set; }
        public int level { get; set; }
        public DateTime timestamp { get; set; }
        public string fileName { get; set; }
        public Int32 fileNumber { get; set; }
    }

    public class JobModel
    {
        public string id { get; set; }
        public string type { get; set; }
        public string url { get; set; }
        public string created_at { get; set; }
        public string company { get; set; }
        public string company_url { get; set; }
        public string location { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string how_to_apply { get; set; }
        public string company_logo { get; set; }
    }

    public class jobParamsModel
    {
        public string description { get; set; }
        public string location { get; set; }
        public string latitude { get; set; }
        public string longitude { get; set; }
        public string full_time { get; set; }
    }

}
