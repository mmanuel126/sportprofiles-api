using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ESapi.Models;
using ESapi.Models.Members;
using ESapi.Repository;
using Swashbuckle.AspNetCore.Annotations;

namespace ESapi.Controllers
{
    [Route("services/[controller]")]
    [SwaggerTag("This is a list of interfaces to manage settings user preferences.")]
    public class SettingController : Controller
    {
        private readonly ISettingRepository _setRepo;

        public SettingController(ISettingRepository setRepo)
        {
            _setRepo = setRepo;
        }

        /// <summary>
        /// Gets the member name information.
        /// </summary>
        /// <returns>The member name info.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetMemberNameInfo/{memberID}")]
        public List<MemberNameInfoModel> GetMemberNameInfo([FromHeader] string authorization, [FromRoute] int memberID)
        {
            return _setRepo.GetMemberNameInfo(memberID);
        }

        /// <summary>
        /// Saves the member name info.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="fName">First name.</param>
        /// <param name="mName">Middle name.</param>
        /// <param name="lName">Last name.</param>
        [HttpPut]
        [Authorize]
        [Route("SaveMemberNameInfo/{memberID}")]
        public void SaveMemberNameInfo([FromHeader] string authorization, [FromRoute] int memberID, [FromQuery] string fName, [FromQuery] string mName, [FromQuery] string lName)
        {
            _setRepo.SaveMemberNameInfo(memberID, fName, mName, lName);
        }

        /// <summary>
        /// Saves the member email information.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="email">Email.</param>
        [HttpPut]
        [Authorize]
        [Route("SaveMemberEmailInfo/{memberID}")]
        public void SaveMemberEmailInfo([FromHeader] string authorization, [FromRoute] int memberID, [FromQuery] string email)
        {
            _setRepo.SaveMemberEmailInfo(memberID, email);
        }

        /// <summary>
        /// Saves the password information.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="pwd">Password.</param>
        [HttpPut]
        [Authorize]
        [Route("SavePasswordInfo")]
        public void SavePasswordInfo([FromHeader] string authorization, [FromBody] PasswordData body)
        {
            string mykey = "r0b1nr0y";
            string pwd = EncryptStrings.Encrypt(body.pwd, mykey);
            _setRepo.SavePasswordInfo( body.memberID, pwd);
        }

        /// <summary>
        /// Saves the security question info.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="questionID">Question identifier.</param>
        /// <param name="answer">Answer.</param>
        [HttpPut]
        [Authorize]
        [Route("SaveSecurityQuestionInfo/{memberID}")]
        public void SaveSecurityQuestionInfo([FromHeader] string authorization, [FromRoute] int memberID, [FromQuery] int questionID, [FromQuery] string answer)
        {
            _setRepo.SaveSecurityQuestionInfo(memberID, questionID, answer);
        }

        /// <summary>
        /// Deactivates the account.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="reason">Reason.</param>
        /// <param name="explanation">Explanation.</param>
        /// <param name="futureEmail">Future email.</param>
        [HttpPut]
        [Authorize]
        [Route("DeactivateAccount/{memberID}")]
        public void DeactivateAccount([FromHeader] string authorization, [FromRoute] int memberID, [FromQuery] int reason, [FromQuery] string explanation, [FromQuery] bool? futureEmail)
        {
            _setRepo.DeactivateAccount(memberID, reason, explanation, futureEmail);
        }

        /// <summary>
        /// Gets the member notifications.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <returns>The member notifications.</returns>
        /// <param name="memberId">Member identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetMemberNotifications/{memberID}")]
        public List<NotificationsSettingModel> GetMemberNotifications([FromHeader] string authorization, [FromRoute] int memberId)
        {
            return _setRepo.GetMemberNotifications(memberId);
        }

        /// <summary>
        /// Saves the notification settings.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="body">Body.</param>
        [HttpPut]
        [Authorize]
        [Route("SaveNotificationSettings/{memberID}")]
        public void SaveNotificationSettings([FromHeader] string authorization, [FromRoute] int memberID, [FromBody] NotificationsSettingModel body)
        {

            _setRepo.SaveNotificationSettings(memberID, body.LG_SendMsg, body.LG_AddAsFriend, body.LG_ConfirmFriendShipRequest,
                                           body.GP_InviteYouToJoin, body.GP_MakesYouAGPAdmin, body.GP_RepliesToYourDiscBooardPost,
                                           body.GP_ChangesTheNameOfGroupYouBelong, body.EV_InviteToEvent, body.EV_DateChanged,
                                           body.HE_RepliesToYourHelpQuest);

        }

        /// <summary>
        /// Gets the profile settings.
        /// </summary>
        /// <returns>The profile settings.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetProfileSettings/{memberID}")]
        public List<PrivacySearchSettingsModel> GetProfileSettings([FromHeader] string authorization, [FromRoute] int memberID)
        {
            return _setRepo.GetProfileSettings(memberID);
        }

        /// <summary>
        /// Saves the profile settings.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="body">Body.</param>
        [HttpPut]
        [Authorize]
        [Route("SaveProfileSettings/{memberID}")]
        public void SaveProfileSettings([FromHeader] string authorization, [FromRoute] int memberID, [FromBody] PrivacySearchSettingsModel body)
        {
            _setRepo.SaveProfileSettings(memberID, body);
        }

        /// <summary>
        /// Gets the privacy search settings.
        /// </summary>
        /// <returns>The privacy search settings.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetPrivacySearchSettings/{memberID}")]
        public List<PrivacySearchSettingsModel> GetPrivacySearchSettings([FromHeader] string authorization, [FromRoute]int memberID)
        {
            return _setRepo.GetPrivacySearchSettings(memberID);
        }

        /// <summary>
        /// Saves the privacy search settings.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="visibility">Visibility.</param>
        /// <param name="viewProfilePicture">If set to <c>true</c> view profile picture.</param>
        /// <param name="viewFriendsList">If set to <c>true</c> view friends list.</param>
        /// <param name="viewLinkToRequestAddingYouAsFriend">If set to <c>true</c> view link to request adding you as friend.</param>
        /// <param name="viewLinkToSendYouMsg">If set to <c>true</c> view link to send you message.</param>
        [HttpPut]
        [Authorize]
        [Route("SavePrivacySearchSettings/{memberID}")]
        public void SavePrivacySearchSettings([FromHeader] string authorization,
              [FromRoute] int memberID,
              [FromQuery] int visibility,
              [FromQuery] bool viewProfilePicture,
              [FromQuery] bool viewFriendsList,
              [FromQuery] bool viewLinkToRequestAddingYouAsFriend,
              [FromQuery] bool viewLinkToSendYouMsg)
        {
            _setRepo.SavePrivacySearchSettings(memberID, visibility, viewProfilePicture, viewFriendsList, viewLinkToRequestAddingYouAsFriend,
                                             viewLinkToSendYouMsg);
        }
    }

     public class PasswordData {
            public string pwd {get;set;}
            public string memberID {get; set;}
     }

}
