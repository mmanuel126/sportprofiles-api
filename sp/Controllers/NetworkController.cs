
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ESapi.DBContextModels;
using ESapi.Models;
using ESapi.Repository;
using Swashbuckle.AspNetCore.Annotations;

namespace LGApi.Controllers
{
    [Route("services/[controller]")]
    [SwaggerTag("Contains API interfaces or functionalities to manange networks betwen the users.")]
    public class NetworkController : Controller
    {
        readonly ESapi.Repository.INetworkRepository _netRepo;

        public NetworkController(INetworkRepository networkRepository)
        {
            _netRepo = networkRepository;
        }

        /// <summary>
        /// Creates the network.
        /// </summary>
        /// <returns>The network.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="body">Network data</param>
        /// <param name="memberID">Member identifier.</param>
        [HttpPost]
        [Authorize]
        [Route("CreateNetwork/{memberID}")]
        public int CreateNetwork([FromHeader] string authorization, [FromBody] TbNetworks body, [FromRoute] int memberID)
        {
            int id = _netRepo.CreateNetwork(memberID, body.NetworkName, body.Description, (int)body.CategoryId, (int)body.CategoryTypeId, body.RecentNews, body.Office, body.Email, body.Website, body.Street, body.City, body.State, body.Zip);
            return (id);
        }

        /// <summary>
        /// Updates the network.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        /// <param name="body">Network data.</param>
        [HttpPut]
        [Authorize]
        [Route("UpdateNetwork/{networkID}")]
        public void UpdateNetwork([FromHeader] string authorization, [FromRoute] int networkID, [FromBody] TbNetworks body)
        {
            _netRepo.UpdateNetwork(networkID, body.NetworkName, body.Description, (int)body.CategoryId, (int)body.CategoryTypeId, body.RecentNews, body.Office, body.Email, body.Website, body.Street, body.City, body.State, body.Zip);
        }

        /// <summary>
        /// Gets the list of networks for member.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <returns>The member networks.</returns>
        /// <param name="memberID">Member identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetMemberNetworks/{memberID}")]
        public List<NetworkModel> GetMemberNetworks([FromHeader] string authorization, [FromRoute] int memberID)
        {
            List<NetworkModel> lst = _netRepo.GetMemberNetworks(memberID);
            return lst;
        }

        /// <summary>
        /// Gets the network categories.
        /// </summary>
        /// <returns>The network categories.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        [HttpGet]
        [Authorize]
        [Route("GetNetworkCategories")]
        public List<TbNetworkCategory> GetNetworkCategories([FromHeader] string authorization)
        {
            List<TbNetworkCategory> lst = _netRepo.GetNetworkCategories();
            return lst;
        }

        /// <summary>
        /// Gets the network category types.
        /// </summary>
        /// <returns>The network category types.</returns>
        /// /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="categoryID">Category identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetNetworkCategoryTypes/{categoryID}")]
        public List<TbNetworkCategoryType> GetNetworkCategoryTypes([FromHeader] string authorization, [FromRoute] int categoryID)
        {
            List<TbNetworkCategoryType> lst = _netRepo.GetNetworkCategoryTypes(categoryID);
            return lst;
        }

        /// <summary>
        /// Gets the network basic info.
        /// </summary>
        /// <returns>The network basic info.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetNetworkBasicInfo/{networkID}")]
        public List<NetworkInfoModel> GetNetworkBasicInfo([FromHeader] string authorization, [FromRoute]int networkID)
        {
            List<NetworkInfoModel> lst = _netRepo.GetNetworkBasicInfo(networkID);
            return lst;
        }

        /// <summary>
        /// update network information
        /// </summary>
        /// <param name="authorization"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost]
        [Route("UpdateNetworkInfo")]
        public string UpdateNetworkInfo([FromHeader] string authorization, [FromBody] NetworkInfoModel body)
        {
            _netRepo.UpdateNetworkInfo(body);
            return "success";
        }

        /// <summary>
        /// Gets list networks by cat type.
        /// </summary>
        /// <returns>The networks by cat type.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="category">Category.</param>
        /// <param name="subCategory">Sub category.</param>
        [HttpGet]
        [Authorize]
        [Route("GetNetworksByCatType/{memberID}/{category}/{subCategory}")]
        public List<NetworkInfoModel> GetNetworksByCatType([FromHeader] string authorization, [FromRoute]int memberID, [FromRoute] int category, [FromRoute] int subCategory)
        {
            List<NetworkInfoModel> lst = _netRepo.GetNetworksByCatType(memberID, category, subCategory);
            return lst;
        }

        /// <summary>
        /// Gets the network settings.
        /// </summary>
        /// <returns>The network settings.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetNetworkSettings/{networkID}")]
        public List<TbNetworkSettings> GetNetworkSettings([FromHeader] string authorization, [FromRoute] int networkID)
        {
            List<TbNetworkSettings> lst = _netRepo.GetNetworkSettings(networkID);
            return (lst);
        }

        /// <summary>
        /// Gets the network administrators.
        /// </summary>
        /// <returns>The network admins.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        /// 
        [HttpGet]
        [Authorize]
        [Route("GetNetworkAdmins/{networkID}")]
        public List<NetworkMemberModel> GetNetworkAdmins([FromHeader] string authorization, [FromRoute]int networkID)
        {
            List<NetworkMemberModel> lst = _netRepo.GetNetworkAdmins(networkID);
            return (lst);
        }

        /// <summary>
        /// Gets the network members.
        /// </summary>
        /// <returns>The network members.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        /// <param name="listType">List type.</param>
        [HttpGet]
        [Authorize]
        [Route("GetNetworkMembers/{networkID}")]
        public List<NetworkMemberModel> GetNetworkMembers([FromHeader] string authorization, [FromRoute] int networkID, [FromQuery] string listType)
        {
            List<NetworkMemberModel> lst = _netRepo.GetNetworkMembers(networkID, listType);
            return (lst);
        }

        /// <summary>
        /// Gets the contacts not in network.
        /// </summary>
        /// <returns>The contacts not in network.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="networkID">Network identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetContactsNotInNetwork/{memberID}/{networkID}")]
        public List<NetworkMemberModel> GetContactsNotInNetwork([FromHeader] string authorization, [FromRoute] int memberID, [FromRoute] int networkID)
        {
            List<NetworkMemberModel> lst = _netRepo.GetContactsNotInNetwork(memberID, networkID);
            return (lst);
        }

        /// <summary>
        /// Adds the network members.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="networkID">Network identifier.</param>
        [HttpPost]
        [Authorize]
        [Route("AddNetworkMembers/{memberID}/{networkID}")]
        public void AddNetworkMembers([FromHeader] string authorization, [FromRoute] int memberID, [FromRoute] int networkID)
        {
            _netRepo.AddNetworkMembers(memberID, networkID);
        }

        /// <summary>
        /// Ignores the join network.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="networkID">Network identifier.</param>
        [HttpPut]
        [Authorize]
        [Route("IgnoreJoinNetwork/{memberID}/{networkID}")]
        public void IgnoreJoinNetwork([FromHeader] string authorization, [FromRoute] int memberID, [FromRoute]int networkID)
        {
            _netRepo.IgnoreJoinNetwork(memberID, networkID);
        }

        /// <summary>
        /// Updates the network settings.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="body">Network settings data.</param>
        [HttpPut]
        [Authorize]
        [Route("UpdateNetworkSettings")]
        public void UpdateNetworkSettings([FromHeader] string authorization, [FromBody] TbNetworkSettings body)
        {
            _netRepo.UpdateNetworkSettings((int)body.NetworkId, (int)body.Access, (bool)body.NonAdminCanWrite, (bool)body.ShowGroupEvents, (bool)body.EnableDiscussionBoard,
                (bool)body.EnablePhotos, (bool)body.EnableVideos, (bool)body.EnableLinks,
                (bool)body.OnlyAllowAdminsToUploadPhotos, (bool)body.OnlyAllowAdminsToUploadVideos,
                (bool)body.OnlyAllowAdminsToPostLinks);
        }

        /// <summary>
        /// Invite member to join network
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        /// <param name="memberID">Member identifier.</param>
        [HttpPost]
        [Authorize]
        [Route("InviteMemberToJoinNetwork/{networkID}/{memberID}")]
        public void InviteMemberToJoinNetwork([FromHeader] string authorization, [FromRoute] int networkID, [FromRoute] int memberID)
        {
            _netRepo.InviteMemberToJoinNetwork(networkID, memberID);
        }

        /// <summary>
        /// Invites to join network using email.
        /// </summary>
        /// <returns>The email to join network.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        /// <param name="email">Email.</param>
        [HttpPost]
        [Authorize]
        [Route("InviteEmailToJoinNetwork/{networkID}")]
        public int InviteEmailToJoinNetwork([FromHeader] string authorization, [FromRoute] int networkID, [FromQuery] string email)
        {
            int res = _netRepo.InviteEmailToJoinNetwork(networkID, email);
            return res;
        }

        /// <summary>
        /// checks if email is a network member
        /// </summary>
        /// <returns><c>true</c>, if network member was ised, <c>false</c> otherwise.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        /// <param name="email">Email.</param>
        [HttpGet]
        [Authorize]
        [Route("IsNetworkMember/{networkID}")]
        public bool IsNetworkMember([FromHeader] string authorization, [FromRoute] int networkID, [FromQuery] string email)
        {
            bool b = _netRepo.IsNetworkMember(networkID, email);
            return b;
        }

        /// <summary>
        /// checks if member a network requestor to join
        /// </summary>
        /// <returns><c>true</c>, if member net work requestor was ised, <c>false</c> otherwise.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        /// <param name="memberID">Member identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("IsMemberNetWorkRequestor/{networkID}/{memberID}")]
        public bool IsMemberNetWorkRequestor([FromHeader] string authorization, [FromRoute] int networkID, [FromRoute] int memberID)
        {
            bool b = _netRepo.IsMemberNetWorkRequestor(networkID, memberID);
            return b;
        }

        /// <summary>
        /// Gets the recent network activities.
        /// </summary>
        /// <returns>The recent network activities.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetRecentNetworkActivities/{networkID}")]
        public List<RecentNetworkActivitiesResult> GetRecentNetworkActivities([FromHeader] string authorization, [FromRoute] int networkID)
        {
            List<RecentNetworkActivitiesResult> lst = _netRepo.GetRecentNetworkActivities(networkID).ToList();
            return lst;
        }

        /// <summary>
        /// Gets the network posts.
        /// </summary>
        /// <returns>The network posts.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetNetworkPosts/{networkID}")]
        public List<NetworkPostsModel> GetNetworkPosts([FromHeader] string authorization, [FromRoute]int networkID)
        {
            List<NetworkPostsModel> lst = _netRepo.GetNetworkPosts(networkID).ToList();
            return (lst);
        }

        /// <summary>
        /// Gets the network post responses.
        /// </summary>
        /// <returns>The network post responses.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="postID">Post identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetNetworkPostResponses/{postID}")]
        public List<NetworkChildPostsModel> GetNetworkPostResponses([FromHeader] string authorization, [FromRoute] int postID)
        {
            List<NetworkChildPostsModel> lst = _netRepo.GetNetworkPostResponses(postID).ToList();
            return (lst);
        }

        /// <summary>
        /// Updates the profile picture.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        /// <param name="fileName">File name.</param>
        [HttpPut]
        [Authorize]
        [Route("UpdateProfilePicture/{networkID}")]
        public void UpdateProfilePicture([FromHeader] string authorization, [FromRoute] int networkID, [FromQuery] string fileName)
        {
            _netRepo.UpdateProfilePicture(networkID, fileName);
        }

        /// <summary>
        /// Creates the network post.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="postMsg">Post message.</param>
        [HttpPost]
        [Authorize]
        [Route("CreateNetworkPost/{networkID}/{memberID}")]
        public void CreateNetworkPost([FromHeader] string authorization, [FromRoute] int networkID, [FromRoute] int memberID, [FromQuery] string postMsg)
        {
            _netRepo.CreateNetworkPost(networkID, memberID, postMsg);
        }

        /// <summary>
        /// Creates the post comment.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="postID">Post identifier.</param>
        /// <param name="postMsg">Post message.</param>
        [HttpPost]
        [Authorize]
        [Route("CreatePostComment/{networkID}/{memberID}/{postID}")]
        public void CreatePostComment([FromHeader] string authorization, [FromRoute] int networkID, [FromRoute] int memberID, [FromRoute] int postID, [FromQuery] string postMsg)
        {
            _netRepo.CreatePostComment(networkID, memberID, postID, postMsg);
        }

        /// <summary>
        /// Creates the post comment by topic identifier.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="topicID">Topic identifier.</param>
        /// <param name="postMsg">Post message.</param>
        [HttpPost]
        [Authorize]
        [Route("CreatePostCommentByTopicID/{memberID}/{topicID}")]
        public void CreatePostCommentByTopicID([FromHeader] string authorization, [FromRoute] int memberID, [FromRoute] int topicID, [FromQuery] string postMsg)
        {
            _netRepo.CreatePostComment(memberID, topicID, postMsg);
        }

        /// <summary>
        /// Gets the network info.
        /// </summary>
        /// <returns>The network info.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetNetworkInfo/{networkID}")]
        public List<NetworkInfoModel> GetNetworkInfo([FromHeader] string authorization, [FromRoute]int networkID)
        {
            List<NetworkInfoModel> lst = _netRepo.GetNetworkBasicInfo(networkID).ToList();
            return (lst);
        }

        /// <summary>
        /// Creates the photo.
        /// </summary>
        /// <returns>The photo.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="body">photo data.</param>
        [HttpPost]
        [Authorize]
        [Route("CreatePhoto")]
        public int CreatePhoto([FromHeader] string authorization, [FromBody] TbNetworkPhotos body)
        {
            int res = _netRepo.CreatePhoto((int)body.NetworkId, (int)body.MemberId, body.PhotoName, body.PhotoDesc, body.FileName);
            return res;
        }

        /// <summary>
        /// Gets the network photos.
        /// </summary>
        /// <returns>The network photos.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetNetworkPhotos/{networkID}")]
        public List<NetworkPhotosModel> GetNetworkPhotos([FromHeader] string authorization, [FromRoute] int networkID)
        {
            List<NetworkPhotosModel> lst = _netRepo.GetNetworkPhotos(networkID).ToList();
            return (lst);
        }

        /// <summary>
        /// Removes the photo.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="photoID">Photo identifier.</param>
        [HttpDelete]
        [Authorize]
        [Route("RemovePhoto/{photoID}")]
        public void RemovePhoto([FromHeader] string authorization, [FromRoute] int photoID)
        {
            _netRepo.RemovePhoto(photoID);
        }

        /// <summary>
        /// Updates the network photo.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="body">Photo data.</param>
        [HttpPut]
        [Authorize]
        [Route("UpdateNetworkPhoto")]
        public void UpdateNetworkPhoto([FromHeader] string authorization, NetworkPhotosModel body)
        {
            _netRepo.UpdateNetworkPhoto(int.Parse(body.photoID), body.photoName, body.photoDesc);
        }

        /// <summary>
        /// Gets the network events.
        /// </summary>
        /// <returns>The network events.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        /// <param name="memberID">Member identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetNetworkEvents/{networkID}/{memberID}")]
        public List<NetworkEventModel> GetNetworkEvents([FromHeader] string authorization, [FromRoute] int networkID, [FromRoute] int memberID)
        {
            List<NetworkEventModel> lst = _netRepo.GetNetworkEvents(networkID, memberID).ToList();
            return (lst);
        }

        /// <summary>
        /// Creates the topic.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="topicName">Topic name.</param>
        /// <param name="post">Post.</param>
        [HttpPost]
        [Authorize]
        [Route("CreateTopic/{networkID}/{memberID}")]
        public void CreateTopic([FromHeader] string authorization, [FromRoute] int networkID, [FromRoute] int memberID, [FromQuery] string topicName, [FromQuery] string post)
        {
            _netRepo.CreateTopic(networkID, memberID, topicName, post);
        }

        /// <summary>
        /// Gets the network discussion topics.
        /// </summary>
        /// <returns>The network discussion topics.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetNetworkDiscussionTopics/{networkID}")]
        public List<NetworkTopicsModel> GetNetworkDiscussionTopics([FromHeader] string authorization, [FromRoute] int networkID)
        {
            List<NetworkTopicsModel> lst = _netRepo.GetNetworkDiscussionTopics(networkID).ToList();
            return (lst);
        }

        /// <summary>
        /// Gets the list of posts for a topic.
        /// </summary>
        /// <returns>The topic posts.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="topicID">Topic identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetTopicPosts/{topicID}")]
        public List<NetworkPostsModel> GetTopicPosts([FromHeader] string authorization, [FromRoute] int topicID)
        {
            List<NetworkPostsModel> lst = _netRepo.GetTopicPosts(topicID).ToList();
            return (lst);
        }

        /// <summary>
        /// Updates the network image.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        /// <param name="filename">Filename.</param>
        [HttpPut]
        [Authorize]
        [Route("UpdateNetworkImage/{networkID}")]
        public void UpdateNetworkImage([FromHeader] string authorization, [FromRoute] int networkID, [FromQuery] string filename)
        {
            _netRepo.UpdateNetworkImage(networkID, filename);
        }

        /// <summary>
        /// Gets the total network invites.
        /// </summary>
        /// <returns>The total network invites.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetTotalNetworkInvites/{memberID}")]
        public int? GetTotalNetworkInvites([FromHeader] string authorization, [FromRoute] int memberID)
        {
            int? res = _netRepo.GetTotalNetworkInvites(memberID);
            return res;
        }

        /// <summary>
        /// Gets the member network invites.
        /// </summary>
        /// <returns>The member network invites.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetMemberNetworkInvites/{memberID}")]
        public List<NetworkInfoModel> GetMemberNetworkInvites([FromHeader] string authorization, [FromRoute] int memberID)
        {
            List<NetworkInfoModel> lst = _netRepo.GetMemberNetworkInvites(memberID).ToList();
            return (lst);
        }

        /// <summary>
        /// Deletes the network topic.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="topicID">Topic identifier.</param>
        [HttpPost]
        [Authorize]
        [Route("DeleteNetworkTopic/{topicID}")]
        public void DeleteNetworkTopic([FromHeader] string authorization, [FromRoute] int topicID)
        {
            _netRepo.DeleteNetworkTopic(topicID);
        }

        /// <summary>
        /// Adds the network admin.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        /// <param name="memberID">Member identifier.</param>
        [HttpPost]
        [Authorize]
        [Route("AddNetworkAdmin/{networkID}/{memberID}")]
        public void AddNetworkAdmin([FromHeader] string authorization, [FromRoute] int networkID, [FromRoute] int memberID)
        {
            _netRepo.AddNetworkAdmin(networkID, memberID);
        }

        /// <summary>
        /// Permanently  remove the rejected request.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="networkID">Network identifier.</param>
        [HttpDelete]
        [Authorize]
        [Route("PermanentlyRemoveRejectedRequest/{memberID}/{networkID}")]
        public void PermanentlyRemoveRejectedRequest([FromHeader] string authorization, [FromRoute] int memberID, [FromRoute] int networkID)
        {
            _netRepo.PermanentlyRemoveRejectedRequest(memberID, networkID);
        }

        /// <summary>
        /// Deactivates the member from network.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="networkID">Network identifier.</param>
        [HttpPut]
        [Authorize]
        [Route("DeactivateMemberFromNetwork/{memberID}/{networkID}")]
        public void DeactivateMemberFromNetwork([FromHeader] string authorization, [FromRoute] int memberID, [FromRoute] int networkID)
        {
            _netRepo.DeactivateMemberFromNetwork(memberID, networkID);
        }

        /// <summary>
        /// Deletes a network invite.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="networkID">Network identifier.</param>
        /// <param name="email">Email.</param>
        [HttpDelete]
        [Authorize]
        [Route("DeleteInvite/{memberID}/{networkID}")]
        public void DeleteInvite([FromHeader] string authorization, [FromRoute] int memberID, [FromRoute] int networkID, [FromQuery] string email)
        {
            _netRepo.DeleteInvite(memberID, networkID, email);
        }

        /// <summary>
        /// Gets the network topic member creator.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <returns>The network topic member creator.</returns>
        /// <param name="topicID">Topic identifier.</param>
        [HttpGet]
        [Authorize]
        [Route("GetNetworkTopicMemberCreator/{topicID}")]
        public int GetNetworkTopicMemberCreator([FromHeader] string authorization, [FromRoute] int topicID)
        {
            return (_netRepo.GetNetworkTopicMemberCreator(topicID));
        }

        /// <summary>
        /// Searchs the TOP x network results.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <returns>The TOP x network results.</returns>
        /// <param name="tryValue">Try value.</param>
        [HttpGet]
        [Authorize]
        [Route("SearchTOPxNetworkResults")]
        public List<NetworkInfoModel> SearchTOPxNetworkResults([FromHeader] string authorization, [FromQuery] string tryValue)
        {
            return (_netRepo.SearchTop8NetworkResults(tryValue));
        }

        /// <summary>
        /// Gets the list of networks by try value and member.
        /// </summary>
        /// <returns>The networks by key name.</returns>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="tryValue">Try value.</param>
        [HttpGet]
        [Authorize]
        [Route("GetNetworksByKeyName/{memberID}")]
        public List<NetworkInfoModel> GetNetworksByKeyName([FromHeader] string authorization, [FromRoute] int memberID, [FromQuery] string tryValue)
        {
            return (_netRepo.GetNetworksByKeyName(memberID, tryValue));
        }

        /// <summary>
        /// Adds the member to network request.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="status">Status.</param>
        [HttpPost]
        [Authorize]
        [Route("AddMemberToNetworkRequest/{networkID}/{memberID}")]
        public void AddMemberToNetworkRequest([FromHeader] string authorization, [FromRoute] int networkID, [FromRoute] int memberID, [FromQuery] int status)
        {
            _netRepo.AddMemberToNetworkRequest(networkID, memberID, status);
        }

        /// <summary>
        /// Demotes the admin of an admin.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="memberID">Member identifier.</param>
        /// <param name="networkID">Network identifier.</param>
        [HttpPut]
        [Authorize]
        [Route("DemoteAdmin/{memberID}/{networkID}")]
        public void DemoteAdmin([FromHeader] string authorization, [FromRoute]int memberID, [FromRoute] int networkID)
        {
            _netRepo.DemoteAdmin(memberID, networkID);
        }

        /// <summary>
        /// Deletes the network invite.
        /// </summary>
        /// <param name="authorization">JWT Bearer token.</param>
        /// <param name="networkID">Network identifier.</param>
        /// <param name="memberID">Member identifier.</param>
        [HttpDelete]
        [Authorize]
        [Route("DeleteNetworkInvite/{networkID}/{memberID}")]
        public void DeleteNetworkInvite([FromHeader] string authorization, [FromRoute] int networkID, [FromRoute] string memberID)
        {
            _netRepo.DeleteNetworkInvite(memberID, networkID);
        }
    }
}
