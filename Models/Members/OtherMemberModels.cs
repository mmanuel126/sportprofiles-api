using System;

namespace ESapi.Models.Members
{
    public class MemberDatesModel
    {
        public string JoinedDate { get; set; }
        public string picturePath { get; set; }
        public string memberName { get; set; }
        public string currentCity { get; set; }
        public string birthDate { get; set; }
    }

    public class MemberAlbumsModel
    {
        public string albumID { get; set; }
        public string albumName { get; set; }
        public string createdDate { get; set; }
        public string description { get; set; }
        public string photoCount { get; set; }
        public string fileName { get; set; }
    }

    public class AlbumPhotosModel
    {
        public string countID { get; set; }
        public string photoID { get; set; }
        public string fileName { get; set; }
        public string photodesc { get; set; }
        public string photoName { get; set; }
        public string memberID { get; set; }
        public string memberName { get; set; }
    }

    public class MemberInfoByEmailModel
    {
        public string friendID { get; set; }
        public string picturePath { get; set; }
        public string email { get; set; }
        public string name { get; set; }
    }

    public class RecentActivitiesModel
    {
        public string activityID { get; set; }
        public string description { get; set; }
        public string activityDate { get; set; }
        public string imageFile { get; set; }
    }

    public class RecentPostChildModel
    {
        public int? postResponseID { get; set; }
        public int? postID { get; set; }
        public string description { get; set; }
        public string dateResponded { get; set; }
        public int? memberID { get; set; }
        public string memberName { get; set; }
        public string firstName { get; set; }
        public string picturePath { get; set; }
    }

    public class RegisteredMembersModelV2
    {
        public string memberID { get; set; }
        public string email { get; set; }
        public string status { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string sex { get; set; }
        public string picturePath { get; set; }
        public string joinedDate { get; set; }
        public string titleDesc { get; set; }
        public string sector { get; set; }
        public string industry { get; set; }
        public string registeredDate { get; set; }
    }

    public class MemberProfileGenInfoModel
    {
        public string MemberID { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Sex { get; set; }
        public bool ShowSexInProfile { get; set; }
        public string DOBMonth { get; set; }
        public string DOBDay { get; set; }
        public string DOBYear { get; set; }
        public bool ShowDOBType { get; set; }
        public string Hometown { get; set; }
        public string HomeNeighborhood { get; set; }
        public string CurrentStatus { get; set; }
        public string InterestedInType { get; set; }
        public bool LookingForEmployment { get; set; }
        public bool LookingForRecruitment { get; set; }
        public bool LookingForPartnership { get; set; }
        public bool LookingForNetworking { get; set; }
        public string PicturePath { get; set; }
        public string JoinedDate { get; set; }
        public string CurrentCity { get; set; }
        public string TitleDesc { get; set; }
        public string Sport { get; set; }
        public string Bio { get; set; }
        public string Height { get; set; }
        public string Weight { get; set; }
        public string LeftRightHandFoot { get; set; }
        public string PreferredPosition { get; set; }
        public string SecondaryPosition { get; set; }
        public string InterestedDesc { get; set; }
    }

    public class InterestsModel
    {
        public string interestID { get; set; }
        public string InterestedDesc { get; set; }
    }

    public class MemberPostsModel
    {
        public string postID { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string datePosted { get; set; }
        public string attachFile { get; set; }
        public string memberID { get; set; }
        public string picturePath { get; set; }
        public string memberName { get; set; }
        public string firstName { get; set; }
        public string childPostCnt { get; set; }
    }

    public class ValidateNewRegisteredUserModel
    {
        public string memberId { get; set; }
        public string email { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string passWord { get; set; }
        public string userImage { get; set; }
        public string title {get; set;}
    }

    public class CodeAndNameForgotPwdModel
    {
        public string codeID { get; set; }
        public string firstName { get; set; }
    }

    public class MemberNameInfoModel
    {
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string middleName { get; set; }
        public string email { get; set; }
        public string securityQuestion { get; set; }
        public string securityAnswer { get; set; }
        public string passWord { get; set; }

    }

    public class MemberNetworksModel
    {
        public string networkID { get; set; }
        public string networkName { get; set; }
        public string networkDesc { get; set; }
        public string categoryID { get; set; }
        public string networkImage { get; set; }
        public string memberCount { get; set; }
        public string createdDate { get; set; }
        public string networkOwner { get; set; }
    }

    public class PrivacySearchSettingsModel
    {
        public string ID { get; set; }
        public string memberID { get; set; }
        public string profile { get; set; }
        public string basicInfo { get; set; }
        public string personalInfo { get; set; }
        public string photosTagOfYou { get; set; }
        public string videosTagOfYou { get; set; }
        public string contactInfo { get; set; }
        public string education { get; set; }
        public string workInfo { get; set; }
        public string IMdisplayName { get; set; }
        public string mobilePhone { get; set; }
        public string otherPhone { get; set; }
        public string emailAddress { get; set; }
        public string visibility { get; set; }
        public bool viewProfilePicture { get; set; }
        public bool viewFriendsList { get; set; }
        public bool viewLinksToRequestAddingYouAsFriend { get; set; }
        public bool viewLinkTSendYouMsg { get; set; }
        public string email { get; set; }
    }

    public class UserModel
    {
        public string memberID { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string picturepath { get; set; }
        public string title { get; set; }

    }

    public class SportsListModel {
        public string id  {get; set;}
        public string name {get; set;}
        public string description {get; set;}
    }

    public class AdsModel {
        public int ID {get; set;}
        public string Name {get; set;}
        public string HeaderText {get; set;}
        public DateTime PostingDate {get; set;}
        public string TextField {get; set;}
        public string NavigateUrl {get; set;}
        public string ImageUrl {get; set;}
        public string Type {get; set;}
    }
}

