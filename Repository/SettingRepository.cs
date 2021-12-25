using System;
using System.Collections.Generic;
using System.Linq;
using ESapi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using ESapi.DBContextModels;
using ESapi.Models.Members;

namespace ESapi.Repository
{
    /// <summary>
    /// Describes the functionalities for accessing data for Member settings
    /// </summary>
    public class SettingRepository: ISettingRepository
    {
       
        readonly dbContexts _context;

        #region methods...

        public SettingRepository(dbContexts context)
        {
            _context = context;
        }

        /// <summary>
        /// Get member id's name information
        /// </summary>
        /// <param name="memberID"></param>
        /// <returns></returns>
        public List<MemberNameInfoModel> GetMemberNameInfo(int memberID)
        {
                var lst = (from m in _context.TbMembers join pp in _context.TbMemberProfile on m.MemberId equals pp.MemberId where m.MemberId == memberID

                         select new MemberNameInfoModel()
                         {
                             firstName = pp.FirstName,
                             lastName = pp.LastName,
                             middleName = pp.MiddleName,
                             email = m.Email,
                             securityQuestion = m.SecurityQuestion.ToString(),
                             securityAnswer = m.SecurityAnswer,
                             passWord = m.Password                        
                         }).ToList();

                return lst;
        }

        /// <summary>
        /// Save member ID's name information
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="fName"></param>
        /// <param name="mName"></param>
        /// <param name="lName"></param>
        public void SaveMemberNameInfo(int memberID, string fName, string mName, string lName)
        {
                var p = (from m in _context.TbMemberProfile where m.MemberId == memberID select m).First();
                p.LastName = lName;
                p.FirstName = fName;
                p.MiddleName = mName;
                _context.SaveChanges();      
        }

        /// <summary>
        /// Saves member ID email information 
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="email"></param>
        public void SaveMemberEmailInfo(int memberID, string email)
        {
                List<TbMembers> p = (from m in _context.TbMembers where m.Email == email select m).ToList();
                if (p.Count == 0)
                {
                    var q = (from m in _context.TbMembers where m.MemberId == memberID select m).First();
                    q.Email = email;
                    _context.SaveChanges();
                }                         
        }

        /// <summary>
        /// Save member iDs save password information
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="pwd"></param>
        public void SavePasswordInfo(string memberID, string pwd)
        {
                var q = (from m in _context.TbMembers where m.MemberId == Convert.ToInt32( memberID) select m).First();
                q.Password  = pwd;
                _context.SaveChanges();   
        }

        /// <summary>
        /// Saves member IDs security question information
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="questionID"></param>
        /// <param name="answer"></param>
        public void SaveSecurityQuestionInfo(int memberID, int questionID, string answer)
        {
                var q = (from m in _context.TbMembers where m.MemberId == memberID select m).First();
                q.SecurityQuestion = questionID;
                q.SecurityAnswer = answer;
                _context.SaveChanges();    
        }

        /// <summary>
        /// Deactivate account for member ID.
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="reason"></param>
        /// <param name="explanation"></param>
        /// <param name="futureEmail"></param>
        public void DeactivateAccount(int memberID, int reason, string explanation, bool? futureEmail)
        {
                var q = (from m in _context.TbMembers where m.MemberId == memberID select m).First();
                q.Status = 3;
                q.DeactivateReason = reason;
                q.DeactivateExplanation = explanation;
                q.FutureEmails = futureEmail;               
                _context.SaveChanges();    
        }

        /// <summary>
        /// Gets member IDs networks
        /// </summary>
        /// <param name="memberID"></param>
        /// <returns></returns>
        public List<MemberNetworksModel> GetMemberNetworks(int memberID)
        {
                // var l = (from c in _context.TbNetworkMembers where c.MemberId == memberID select c).ToList();
                // int memberCnt = l.Count();

                // var ll = (from c in _context.TbMemberProfile join d in _context.TbNetworkMembers on c.MemberId equals d.MemberId
                //           where d.IsOwner == true select c).ToList();

                // string networkOwner = "";
                // if (ll.Count() != 0)
                //     networkOwner = ll[0].FirstName + " " + ll[0].LastName;

                // var lst = (from nm in _context.TbNetworkMembers
                //            join n in _context.TbNetworks on nm.NetworkId equals n.NetworkId
                //            join mp in _context.TbMemberProfile on nm.MemberId equals mp.MemberId
                //            where mp.MemberId == memberID

                //            select new MemberNetworksModel()
                //            {
                //                networkID = n.NetworkId.ToString(),
                //                networkName = n.NetworkName,
                //                networkDesc = n.Description,
                //                categoryID = n.CategoryId.ToString(),
                //                networkImage = (n.Image != null) ? n.Image : "default.png",
                //                memberCount = memberCnt.ToString(),
                //                createdDate = n.CreatedDate.ToString(),
                //                networkOwner = networkOwner
                //            }).ToList();

                // return lst;
                return null;
        }

        /// <summary>
        /// Validates network ID exist
        /// </summary>
        /// <param name="networkID"></param>
        /// <returns></returns>
        public bool ValidateNetworkID(int networkID)
        {
                var q = (from n in _context.TbNetworks where n.NetworkId == networkID select n).ToList ();
                if (q.Count != 0)
                    return true;
                else 
                    return false;
        }

        /// <summary>
        /// Validates member ID exist
        /// </summary>
        /// <param name="memberID"></param>
        /// <returns></returns>
        public bool ValidateMemberId(int memberID)
        {
                var q = (from m in _context.TbMembers where m.MemberId == memberID select m).ToList ();
                if (q.Count != 0)
                    return true;
                else
                    return false; 
        }

        /// <summary>
        /// Set member id to join a network
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="networkID"></param>
        public void JoinNetwork(int memberID, int networkID)
        {
                var memID = new SqlParameter("@MemberID", memberID);
                var netID = new SqlParameter("@NetworkID", networkID);
                _context.Database.ExecuteSqlRaw("EXEC spJoinNetwork @MemberID, @NetworkID",memID, netID );
        }

        /// <summary>
        /// Join network by email
        /// </summary>
        /// <param name="email"></param>
        /// <param name="networkID"></param>
        public void JoinNetworkByEmail(string email, int networkID)
        {
                var em = new SqlParameter("@Email", email);
                var netID = new SqlParameter("@NetworkID", networkID);
                _context.Database.ExecuteSqlRaw("EXEC spJoinNetworkByEmail @Email, @NetworkID", em, netID);
        }

        /// <summary>
        /// check to see if memberID is a member of network 
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="networkID"></param>
        /// <returns></returns>
        public bool isNetworkMember(int memberID, int networkID)
        {
                // List<TbNetworkMembers> q = (from m in _context.TbNetworkMembers where m.MemberId == memberID && m.NetworkId == networkID select m).ToList();
                // if (q.Count != 0)
                //     return true;
                // else
                    return false;
        }

        /// <summary>
        /// Creates network request
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="networkName"></param>
        /// <param name="type"></param>
        /// <param name="purpose"></param>
        public void CreateNetworkRequest(int memberID, string networkName, string type, string purpose)
        {
                var memID = new SqlParameter("@MemberID", memberID);
                var netName = new SqlParameter("@NetworkName", networkName);
                var types = new SqlParameter("@Type", type);
                var purposes = new SqlParameter("@Purpose", purpose);
                _context.Database.ExecuteSqlRaw("EXEC spCreateNetworkRequest @MemberID, @NetworkName, @Type, @Purpose", memID, netName, types,purposes);  
        }


        public List<NotificationsSettingModel> GetMemberNotifications(int memberId)
        {
                var q = (from m in _context.TbNotificationSettings where m.MemberId == memberId 
                         select new NotificationsSettingModel()
                            {
                                MemberID = m.MemberId ,
                                LG_SendMsg = (bool)m.LgSendMsg,
                                LG_AddAsFriend = (bool)m.LgAddAsFriend,
                                LG_ConfirmFriendShipRequest = (bool)m.LgConfirmFriendShipRequest,
                                GP_InviteYouToJoin = (bool)m.GpInviteYouToJoin,
                                GP_MakesYouAGPAdmin = (bool)m.GpMakesYouAgpadmin,
                                GP_RepliesToYourDiscBooardPost = (bool)m.GpRepliesToYourDiscBooardPost,
                                GP_ChangesTheNameOfGroupYouBelong = (bool) m.GpChangesTheNameOfGroupYouBelong,
                                EV_DateChanged = (bool) m.EvDateChanged,
                                EV_InviteToEvent = (bool)m.EvInviteToEvent,
                                HE_RepliesToYourHelpQuest = (bool)m.HeRepliesToYourHelpQuest

                        }).ToList();
                return q;
        }

        public void SaveNotificationSettings(            
                  int MemberID,
                  bool LG_SendMsg,
                  bool LG_AddAsFriend,
                  bool LG_ConfirmFriendShipRequest,
                  bool GP_InviteYouToJoin,
                  bool GP_MakesYouAGPAdmin,
                  bool GP_RepliesToYourDiscBooardPost,
                  bool GP_ChangesTheNameOfGroupYouBelong,
                  bool EV_InviteToEvent,
                  bool EV_DateChanged,
                  bool HE_RepliesToYourHelpQuest
            )
        {
                var n = (from m in _context.TbNotificationSettings where m.MemberId == MemberID select m).ToList();

                if (n.Count != 0)
                {
                    var q = n.First();
                    q.LgSendMsg = LG_SendMsg;
                    q.LgAddAsFriend = LG_AddAsFriend;
                    q.LgConfirmFriendShipRequest = LG_ConfirmFriendShipRequest;
                    q.GpInviteYouToJoin = GP_InviteYouToJoin;
                    q.GpMakesYouAgpadmin = GP_MakesYouAGPAdmin;
                    q.GpRepliesToYourDiscBooardPost = GP_RepliesToYourDiscBooardPost;
                    q.GpChangesTheNameOfGroupYouBelong = GP_ChangesTheNameOfGroupYouBelong;
                    q.EvInviteToEvent = EV_InviteToEvent;
                    q.EvDateChanged = EV_DateChanged;
                    q.HeRepliesToYourHelpQuest = HE_RepliesToYourHelpQuest;
                    _context.SaveChanges();
                }
                else
                {
                    TbNotificationSettings ps = new TbNotificationSettings();
                    ps.MemberId = MemberID;
                    ps.LgSendMsg = LG_SendMsg;
                    ps.LgAddAsFriend = LG_AddAsFriend;
                    ps.LgConfirmFriendShipRequest = LG_ConfirmFriendShipRequest;
                    ps.GpInviteYouToJoin = GP_InviteYouToJoin;
                    ps.GpMakesYouAgpadmin = GP_MakesYouAGPAdmin;
                    ps.GpRepliesToYourDiscBooardPost = GP_RepliesToYourDiscBooardPost;
                    ps.GpChangesTheNameOfGroupYouBelong = GP_ChangesTheNameOfGroupYouBelong;
                    ps.EvInviteToEvent = EV_InviteToEvent;
                    ps.EvDateChanged = EV_DateChanged;
                    ps.HeRepliesToYourHelpQuest = HE_RepliesToYourHelpQuest;
                    _context.TbNotificationSettings.Add(ps);
                    _context.SaveChanges();
                }
        }

        /// <summary>
        /// Get profile privacy settings
        /// </summary>
        /// <param name="memberID"></param>
        /// <returns></returns>
        public List<PrivacySearchSettingsModel> GetProfileSettings(int memberID)
        {
                List<PrivacySearchSettingsModel> lst = (from p in _context.TbMembersPrivacySettings
                                                        join m in _context.TbMembers on p.MemberId equals m.MemberId
                                                        where p.MemberId == memberID
                                                        select new PrivacySearchSettingsModel()
                                                        {
                                                            ID = p.Id.ToString(),
                                                            memberID = p.MemberId.ToString(),
                                                            profile = p.Profile.ToString(),
                                                            basicInfo = p.BasicInfo.ToString(),
                                                            personalInfo = p.PersonalInfo.ToString(),
                                                            photosTagOfYou = p.PhotosTagOfYou.ToString(),
                                                            videosTagOfYou = p.VideosTagOfYou.ToString(),
                                                            contactInfo = p.ContactInfo.ToString(),
                                                            education = p.Education.ToString(),
                                                            workInfo = p.WorkInfo.ToString(),
                                                            IMdisplayName = p.ImdisplayName.ToString(),
                                                            mobilePhone = p.MobilePhone.ToString(),
                                                            otherPhone = p.OtherPhone.ToString(),
                                                            emailAddress = p.EmailAddress.ToString(),
                                                            visibility = p.Visibility.ToString(),
                                                            viewProfilePicture = (bool)p.ViewProfilePicture,
                                                            viewFriendsList = (bool)p.ViewFriendsList,
                                                            viewLinksToRequestAddingYouAsFriend = (bool)p.ViewLinkToRequestAddingYouAsFriend,
                                                            viewLinkTSendYouMsg = (bool)p.ViewLinkToSendYouMsg,
                                                            email = m.Email.ToString()
                                                        }).ToList();
                return lst;
        }

        /// <summary>
        /// Saves the profile settings.
        /// </summary>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="body">Body.</param>
        public void SaveProfileSettings(
                  int memberID, PrivacySearchSettingsModel body)
        {
                var p = (from m in _context.TbMembersPrivacySettings where m.MemberId == memberID select m).First();
                if (p != null)
                {
                    p.MemberId = memberID;
                    p.Profile = int.Parse(body.profile);
                    p.BasicInfo = int.Parse(body.basicInfo);
                    p.PersonalInfo = int.Parse(body.personalInfo);
                    p.PhotosTagOfYou = int.Parse(body.photosTagOfYou);
                    p.VideosTagOfYou = int.Parse(body.videosTagOfYou);
                    p.ContactInfo = int.Parse(body.contactInfo);
                    p.Education = int.Parse(body.education);
                    p.WorkInfo = int.Parse(body.workInfo);
                    p.ImdisplayName = int.Parse(body.IMdisplayName);
                    p.MobilePhone = int.Parse(body.mobilePhone);
                    p.OtherPhone = int.Parse(body.otherPhone);
                    p.EmailAddress = int.Parse(body.emailAddress);
                    _context.SaveChanges();
                }
                else
                {
                    TbMembersPrivacySettings ps = new TbMembersPrivacySettings();
                    ps.MemberId = memberID;
                    ps.Profile = int.Parse(body.profile);
                    ps.BasicInfo = int.Parse(body.basicInfo);
                    ps.PersonalInfo = int.Parse(body.personalInfo);
                    ps.PhotosTagOfYou = int.Parse(body.photosTagOfYou);
                    ps.VideosTagOfYou = int.Parse(body.videosTagOfYou);
                    ps.ContactInfo = int.Parse(body.contactInfo);
                    ps.Education = int.Parse(body.education);
                    ps.WorkInfo = int.Parse(body.workInfo);
                    ps.ImdisplayName = int.Parse(body.IMdisplayName);
                    ps.MobilePhone = int.Parse(body.mobilePhone);
                    ps.OtherPhone = int.Parse(body.otherPhone);
                    ps.EmailAddress = int.Parse(body.emailAddress);
                    _context.TbMembersPrivacySettings.Add(ps);
                    _context.SaveChanges();
                }
        }

        /// <summary>
        /// Get privacy search settings
        /// </summary>
        /// <param name="memberID"></param>
        /// <returns></returns>
        public List<PrivacySearchSettingsModel> GetPrivacySearchSettings(int memberID)
        {
                return (GetProfileSettings(memberID));
        }

        /// <summary>
        /// saves privacy search settings
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="visibility"></param>
        /// <param name="viewProfilePicture"></param>
        /// <param name="viewFriendsList"></param>
        /// <param name="viewLinkToRequestAddingYouAsFriend"></param>
        /// <param name="viewLinkToSendYouMsg"></param>
        public void SavePrivacySearchSettings(
              int memberID,
              int visibility,
              bool viewProfilePicture,
              bool viewFriendsList,
              bool viewLinkToRequestAddingYouAsFriend,
              bool viewLinkToSendYouMsg)
        {
                var p = (from m in _context.TbMembersPrivacySettings where m.MemberId == memberID select m).First();
                if (p != null)
                {
                    p.MemberId = memberID;
                    p.Visibility = visibility;
                    p.ViewProfilePicture = viewProfilePicture;
                    p.ViewFriendsList = viewFriendsList;
                    p.ViewLinkToRequestAddingYouAsFriend = viewLinkToRequestAddingYouAsFriend;
                    p.ViewLinkToSendYouMsg = viewLinkToSendYouMsg;
                    _context.SaveChanges();
                }
                else
                {
                    TbMembersPrivacySettings ps = new TbMembersPrivacySettings();
                    ps.MemberId = memberID;
                    ps.Visibility = visibility;
                    ps.ViewFriendsList = viewFriendsList;
                    ps.ViewLinkToRequestAddingYouAsFriend = viewLinkToRequestAddingYouAsFriend;
                    ps.ViewLinkToSendYouMsg = viewLinkToSendYouMsg;
                    _context.TbMembersPrivacySettings.Add(ps);
                    _context.SaveChanges();
                }
        }

        /// <summary>
        /// Get all members for search text
        /// </summary>
        /// <param name="searchText"></param>
        /// <returns></returns>
        public List<TbMemberProfile> GetAllMembers(string searchText)
        {
                var lst = (from m in _context.TbMemberProfile where (m.FirstName.Contains(searchText)) || (m.LastName.Contains(searchText)) select m);
                return lst.ToList();
        }

        #endregion

       
        /// <summary>
        /// return true if email exist for member id
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="email"></param>
        /// <returns></returns>
        public bool IsEmailExist(int memberID, string email)
        {
                var q = (from m in _context.TbMembers where m.Email == email && m.MemberId != memberID select m).ToList();
                if (q.Count != 0)
                    return true;
                else
                    return false;
        }


        /// <summary>
        /// returns a list of members profile pictures.
        /// </summary>
        /// <param name="memberID"></param>
        /// <returns></returns>
        public List<TbMemberProfilePictures> GetMemberProfilePictures(int memberID)
        {
                var q = (from m in _context.TbMemberProfilePictures where m.MemberId == memberID && (m.Removed == false || m.Removed == null) select m).ToList();
                return (q.ToList());
        }

        /// <summary>
        /// returns members default profile picture.
        /// </summary>
        /// <param name="memberID"></param>
        /// <returns></returns>
        public string GetMemberDefaultPicture(int memberID)
        {
                var q = (from m in _context.TbMemberProfilePictures where m.MemberId == memberID && m.IsDefault == true select m).ToList();
                if (q.Count != 0)
                {
                    return (q[0].FileName.ToString());
                }
                else
                    return "";
        }

        /// <summary>
        /// remove profile picture from list
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="noPhotoFilename"></param>
        public void RemoveProfilePicture(int memberID, string noPhotoFilename)
        {
                //update tb meber profile with new profile picture
                var mbr = (from m in _context.TbMemberProfile where m.MemberId == memberID select m).First();
                mbr.PicturePath = noPhotoFilename;
                _context.SaveChanges();

                //remove the old default picture for the member 
                var mq = (from q in _context.TbMemberProfilePictures where q.MemberId == memberID && q.IsDefault == true select q);
                if (mq.Count() != 0)
                {
                    var f = mq.First();
                    f.IsDefault = false;
                    _context.SaveChanges();
                }
        }


        /// <summary>
        /// Set picture as default
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="profileID"></param>
        /// <param name="fileName"></param>
        public void SetPictureAsDefault(int memberID, int profileID, string fileName)
        {
                //remove the old default picture for the member 
                var mq = (from q in _context.TbMemberProfilePictures where q.MemberId == memberID && q.IsDefault == true select q);
                if (mq.Count() != 0)
                {
                    var f = mq.First();
                    f.IsDefault = false;
                    _context.SaveChanges();
                }
                //set the new default picture 
                var newq = (from q in _context.TbMemberProfilePictures where q.MemberId == memberID && q.ProfileId == profileID  select q);
                if (newq.Count() != 0)
                {
                    var n = newq.First();
                    n.IsDefault = true;
                    _context.SaveChanges();
                }
               
                //update tb meber profile with new profile picture
                var mbr = (from m in _context.TbMemberProfile where m.MemberId == memberID select m).First();
                mbr.PicturePath = fileName ;
                _context.SaveChanges();
        }


        /// <summary>
        /// Remove picture as profile
        /// </summary>
        /// <param name="profileID"></param>
        /// <param name="defaultFileName"></param>
        public void RemovePicture(int profileID, string defaultFileName)
        {
                //get profile id to delete and then delete it.
                var newq = (from q in _context.TbMemberProfilePictures where  q.ProfileId == profileID select q);
                if (newq.Count() != 0)
                {
                    bool isDef = false;
                    int memberID = 0;

                    var n = newq.First();
                    memberID = n.MemberId;
                    if (n.IsDefault == true) isDef = true;

                    n.Removed = true;                                      
                    n.IsDefault = false;
                    _context.SaveChanges();

                    //update tb meber profile with new profile picture
                    if (isDef == true)
                    {                       
                        var mbr = (from m in _context.TbMemberProfile where m.MemberId == memberID select m).First();
                        mbr.PicturePath = defaultFileName;
                        _context.SaveChanges();
                    }
                }
        }
    }

    public interface ISettingRepository {
            List<MemberNameInfoModel> GetMemberNameInfo(int memberID);
            void SaveMemberNameInfo(int memberID, string fName, string mName, string lName);
            void SaveMemberEmailInfo(int memberID, string email);
            void SavePasswordInfo(string memberID, string pwd);
            void SaveSecurityQuestionInfo(int memberID, int questionID, string answer);
            void DeactivateAccount(int memberID, int reason, string explanation, bool? futureEmail);
            List<MemberNetworksModel> GetMemberNetworks(int memberID);
            bool ValidateNetworkID(int networkID);
            bool ValidateMemberId(int memberID);
            void JoinNetwork(int memberID, int networkID);
            void JoinNetworkByEmail(string email, int networkID);
            bool isNetworkMember(int memberID, int networkID);
            void CreateNetworkRequest(int memberID, string networkName, string type, string purpose);
            List<NotificationsSettingModel> GetMemberNotifications(int memberId);
            public void SaveNotificationSettings(            
                  int MemberID,
                  bool LG_SendMsg,
                  bool LG_AddAsFriend,
                  bool LG_ConfirmFriendShipRequest,
                  bool GP_InviteYouToJoin,
                  bool GP_MakesYouAGPAdmin,
                  bool GP_RepliesToYourDiscBooardPost,
                  bool GP_ChangesTheNameOfGroupYouBelong,
                  bool EV_InviteToEvent,
                  bool EV_DateChanged,
                  bool HE_RepliesToYourHelpQuest
            );
            List<PrivacySearchSettingsModel> GetProfileSettings(int memberID);
             void SaveProfileSettings(int memberID, PrivacySearchSettingsModel body);
            List<PrivacySearchSettingsModel> GetPrivacySearchSettings(int memberID);
            void SavePrivacySearchSettings(
              int memberID,
              int visibility,
              bool viewProfilePicture,
              bool viewFriendsList,
              bool viewLinkToRequestAddingYouAsFriend,
              bool viewLinkToSendYouMsg);
            List<TbMemberProfile> GetAllMembers(string searchText);
            bool IsEmailExist(int memberID, string email);
             List<TbMemberProfilePictures> GetMemberProfilePictures(int memberID);
            string GetMemberDefaultPicture(int memberID);
            void RemoveProfilePicture(int memberID, string noPhotoFilename);
            void SetPictureAsDefault(int memberID, int profileID, string fileName);
            void RemovePicture(int profileID, string defaultFileName);
    }
}
