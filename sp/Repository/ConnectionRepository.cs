using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ESapi.Models.Connection;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Data.Common;
using ESapi.DBContextModels;
using System.Dynamic;

namespace ESapi.Repository
{
    /// <summary>
    /// Describes the functionalities for accessing data for contacts
    /// </summary>
    public class ConnectionRepository : IConnectionRepository
    {
        readonly dbContexts _context;
        readonly IMemberRepository _mbrRepo;
        readonly IMessageRepository _msgRepo;

        public ConnectionRepository(dbContexts context, IMemberRepository memberRepository, IMessageRepository messageRepository)
        {
            _context = context;
            _mbrRepo = memberRepository;
            _msgRepo = messageRepository;
        }

        /// <summary>
        /// Get list of member contacts.
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="show"></param>
        /// <returns></returns>
        public List<MemberConnectionModel> GetMemberConnections(int memberID, string show)
        {
            
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = "spGetMemberContacts";

                // Add the memberID parameter and set its properties.
                SqlParameter parameter = new SqlParameter();
                parameter.ParameterName = "@MemberID";
                parameter.SqlDbType = SqlDbType.Int;
                parameter.Direction = ParameterDirection.Input;
                parameter.Value = memberID;
                // Add the parameter to the Parameters collection. 
                command.Parameters.Add(parameter);

                // Add the memberID parameter and set its properties.
                parameter = new SqlParameter();
                parameter.ParameterName = "@ShowType";
                parameter.SqlDbType = SqlDbType.VarChar ;
                parameter.Direction = ParameterDirection.Input;
                parameter.Value = show;
                // Add the parameter to the Parameters collection. 
                command.Parameters.Add(parameter);

                List<MemberConnectionModel> cList = new List<MemberConnectionModel>();

                _context.Database.OpenConnection();
                using (var reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            var rec = (IDataRecord)reader;
                            MemberConnectionModel pc = new MemberConnectionModel();
                            pc.connectionID = reader.GetValue(reader.GetOrdinal("contactid")).ToString();
                            pc.email = reader.GetValue(reader.GetOrdinal("email")).ToString();
                            pc.firstName  = reader.GetValue(reader.GetOrdinal("firstname")).ToString();
                            pc.friendName  = reader.GetValue(reader.GetOrdinal("friendname")).ToString();
                            pc.labelText  = reader.GetValue(reader.GetOrdinal("labeltext")).ToString();
                            pc.location  = reader.GetValue(reader.GetOrdinal("location")).ToString();
                            pc.nameAndID  = reader.GetValue(reader.GetOrdinal("nameandid")).ToString();
                            pc.Params   = reader.GetValue(reader.GetOrdinal("params")).ToString();;
                            pc.paramsAV  = reader.GetValue(reader.GetOrdinal("paramsav")).ToString();
                            pc.picturePath  = reader.GetValue(reader.GetOrdinal("picturepath")).ToString();
                            pc.showType  = reader.GetValue(reader.GetOrdinal("showtype")).ToString();
                            pc.status  = reader.GetValue(reader.GetOrdinal("status")).ToString();
                            pc.titleDesc   = reader.GetValue(reader.GetOrdinal("titledesc")).ToString();
                            cList.Add(pc);
                        }
                    }
                    reader.Close();
                }
                return cList;
            }



            // List<MemberConnectionModel> lst = null;
            // if (show == "Requests")
            // {
            //     lst = (from mpf in _context.TbMemberProfile
            //            join ctrq in _context.TbContactRequests on mpf.MemberId equals ctrq.FromMemberId
            //            join mpfci in _context.TbMemberProfileContactInfo on ctrq.FromMemberId equals mpfci.MemberId into t
            //            from nt in t.DefaultIfEmpty()
            //            where ctrq.ToMemberId == memberID
            //            select new MemberConnectionModel()
            //            {
            //                friendName = mpf.FirstName + " " + mpf.LastName,
            //                firstName = mpf.FirstName,
            //                location = nt.City + ", " + nt.State,
            //                picturePath = string.IsNullOrEmpty(mpf.PicturePath) ? "default.png" : mpf.PicturePath,
            //                connectionID = ctrq.FromMemberId.ToString(),
            //                showType = "Request",
            //                status = "1",
            //                titleDesc = mpf.TitleDesc,
            //                Params = "",
            //                paramsAV = "",
            //                email = "",
            //                labelText = "",
            //                nameAndID = ""
            //            }
            //                ).ToList();
            // }
            // else if (show == "AddedRecently")
            // {
            //     lst = (from mpf in _context.TbMemberProfile
            //            join ctrq in _context.TbContacts on mpf.MemberId equals ctrq.ContactId
            //            join mpfci in _context.TbMemberProfileContactInfo on ctrq.MemberId equals mpfci.MemberId
            //            where ctrq.MemberId == memberID && (ctrq.DateStamp >= ctrq.DateStamp.Value.AddDays(-14) && ctrq.DateStamp <= DateTime.Now)
            //            select new MemberConnectionModel()
            //            {
            //                friendName = mpf.FirstName + " " + mpf.LastName,
            //                firstName = mpf.FirstName,
            //                location = mpfci.City + ", " + mpfci.State,
            //                picturePath = string.IsNullOrEmpty(mpf.PicturePath) ? "default.png" : mpf.PicturePath,
            //                connectionID = ctrq.ContactId.ToString(),
            //                showType = "AddedRecently",
            //                status = "1",
            //                titleDesc = mpf.TitleDesc,
            //                Params = "",
            //                paramsAV = "",
            //                email = "",
            //                labelText = "",
            //                nameAndID = ""
            //            }
            //                ).ToList();
            // }
            // else
            // {
            //     var lstReq = (from t in _context.TbContactRequests where t.FromMemberId == memberID select t).ToList();
            //     var lstCont = (from t in _context.TbContacts where t.MemberId == memberID select new { t.MemberId }).ToList();
            //     lst = (from mpf in _context.TbMemberProfile
            //            join ctrq in _context.TbContacts on mpf.MemberId equals ctrq.ContactId
            //            join mpfci in _context.TbMemberProfileContactInfo on ctrq.MemberId equals mpfci.MemberId
            //            into t
            //            from nt in t.DefaultIfEmpty()
            //            join me_m in _context.TbMembers on mpf.MemberId equals me_m.MemberId
            //            where ctrq.MemberId == memberID && (ctrq.Status == 0 || ctrq.Status == 1)
            //            select new MemberConnectionModel()
            //            {
            //                friendName = mpf.FirstName + " " + mpf.LastName,
            //                firstName = mpf.FirstName,
            //                location = nt.City + ", " + nt.State,
            //                picturePath = string.IsNullOrEmpty(mpf.PicturePath) ? "default.png" : mpf.PicturePath,
            //                connectionID = ctrq.ContactId.ToString(),
            //                showType = "",
            //                status = ctrq.Status.ToString(),
            //                titleDesc = mpf.TitleDesc,
            //                Params = me_m.MemberId.ToString() + ",'" + mpf.FirstName + "','" + mpf.LastName + "'",
            //                paramsAV = "", //me_m.MemberId.ToString() + ",'" + mpf.FirstName + "','" + mpf.LastName + "','" +  ((me_m.MemberId == memberID) || (lstReq.Any(m => m.FromMemberId == me_m.MemberId)) || ((lstCont.Any(c => c.MemberId == me_m.MemberId)) && me_m.MemberId != memberID)) ? "View Profile" : "Add as Contact" + "'",
            //                email = me_m.Email,
            //                labelText = ((me_m.MemberId == memberID) || (lstReq.Any(m => m.FromMemberId == me_m.MemberId)) || ((lstCont.Any(c => c.MemberId == me_m.MemberId)) && me_m.MemberId != memberID)) ? "View Profile" : "Add as Contact",
            //                nameAndID = me_m.MemberId.ToString() + "," + mpf.FirstName + "," + mpf.LastName,
            //            }
            //           ).ToList();
            // }
            // return lst;
        }


        public List<MemberConnectionModel> GetMemberConnectionSuggestions(int memberID)
        {
             List<MemberConnectionModel> lst = null;
            // List<TbMemberProfile> l = null;
            // //System.Predicate< List<MemberConnectionModel>> lstMyContacts = null;

            // var lstMyContacts = (from s in _context.TbContacts
            //                      where s.MemberId == memberID
            //                      select new MemberConnectionModel()
            //                      {
            //                          friendName = "",
            //                          firstName = "",
            //                          location = "",
            //                          picturePath = "",
            //                          contactID = s.ContactId.ToString(),
            //                          showType = "suggestion",
            //                          status = "1",
            //                          titleDesc = "",
            //                          Params = "",
            //                          paramsAV = "",
            //                          email = "",
            //                          labelText = "",
            //                          nameAndID = ""
            //                      }
            //        ).ToList();

            // var lstRequests = (from s in _context.TbContactRequests
            //                    where s.FromMemberId == memberID
            //                    select new MemberConnectionModel()
            //                    {
            //                        friendName = "",
            //                        firstName = "",
            //                        location = "",
            //                        picturePath = "",
            //                        contactID = s.ToMemberId.ToString(),
            //                        showType = "suggestion",
            //                        status = "1",
            //                        titleDesc = "",
            //                        Params = "",
            //                        paramsAV = "",
            //                        email = "",
            //                        labelText = "",
            //                        nameAndID = ""
            //                    }
            //       ).ToList();
            // l = (from mp in _context.TbMemberProfile where mp.MemberId == memberID select mp).ToList();
            // string sector = l[0].Sector;

            // lst = (from mpf in _context.TbMemberProfile
            //        join c in _context.TbContacts on mpf.MemberId equals c.ContactId into t
            //        from nt in t.DefaultIfEmpty()
            //        where mpf.Sector == sector && mpf.MemberId != memberID

            //        select new MemberConnectionModel()
            //        {
            //            friendName = mpf.FirstName + " " + mpf.LastName,
            //            firstName = mpf.FirstName,
            //            location = "",
            //            picturePath = string.IsNullOrEmpty(mpf.PicturePath) ? "default.png" : mpf.PicturePath,
            //            contactID = mpf.MemberId.ToString(),
            //            showType = "suggestion",
            //            status = "1",
            //            titleDesc = mpf.TitleDesc,
            //            Params = "",
            //            paramsAV = "",
            //            email = "",
            //            labelText = "",
            //            nameAndID = ""
            //        }
            //       ).ToList().GroupBy(x => x.contactID).Where(x => x.Count() == 1).Select(x => x.First()).ToList();


            // //remove 
            // foreach (var sug in lst)
            // {
            //     if (sug.contactID == memberID.ToString())
            //     {
            //         lst.RemoveAll(c => c.contactID == memberID.ToString()); break;
            //     }
            // }

            // //remove items from contacts list
            // foreach (var con in lstMyContacts)
            // {
            //     var conID = con.contactID;

            //     foreach (var sug in lst)
            //     {
            //         var sugID = sug.contactID;
            //         if (conID == sugID)
            //         {
            //             lst.RemoveAll(c => c.contactID == conID.ToString()); break;
            //         }
            //     }
            // }

            // //remove from request list
            // foreach (var con in lstRequests)
            // {
            //     var conID = con.contactID;

            //     foreach (var sug in lst)
            //     {
            //         var sugID = sug.contactID;
            //         if (conID == sugID)
            //         {
            //             lst.RemoveAll(c => c.contactID == conID.ToString()); break;
            //         }
            //     }
            // }
            return lst;
        }


        /// <summary>
        /// get search member contacts by search text wildcard
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="searchText"></param>
        /// <returns></returns>
        public List<MemberConnectionModel> SearchMemberConnections(int memberID, string searchText)
        {
            var lst = (from mpf in _context.TbMemberProfile
                       join ct in _context.TbContacts on mpf.MemberId equals ct.ContactId
                       join mcti in _context.TbMemberProfileContactInfo on ct.ContactId equals mcti.MemberId
                       into t
                       from nt in t.DefaultIfEmpty()
                       where
                       ct.MemberId == memberID && (ct.Status == 0 || ct.Status == 1) &&
                       (mpf.FirstName.Contains(searchText) || mpf.LastName.Contains(searchText))
                       select new MemberConnectionModel()
                       {
                           friendName = mpf.FirstName + " " + mpf.LastName,
                           firstName = mpf.FirstName,
                           location = nt.City + ", " + nt.State,
                           picturePath = string.IsNullOrEmpty(mpf.PicturePath) ? "default.png" : mpf.PicturePath,
                           connectionID = ct.ContactId.ToString(),
                           showType = "",
                           status = ct.Status.ToString(),
                           titleDesc = mpf.TitleDesc
                       }).ToList();
            return lst;
        }

        /// <summary>
        /// Get member network invite contacts list
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="networkID"></param>
        /// <returns></returns>
        public List<MemberConnectionModel> GetMemberNetworkInviteConnectionList(int memberID, int networkID)
        {
            var lst = (from mpf in _context.TbMemberProfile
                       join c in _context.TbContacts on mpf.MemberId equals c.ContactId
                       join mpci in _context.TbMemberProfileContactInfo on c.ContactId equals mpci.MemberId
                       where c.MemberId == memberID && (c.Status == 0 || c.Status == 1)
                       select new MemberConnectionModel()
                       {
                           friendName = mpf.FirstName + " " + mpf.LastName,
                           firstName = mpf.FirstName,
                           location = mpci.City + ", " + mpci.State,
                           picturePath = string.IsNullOrEmpty(mpf.PicturePath) ? "default.png" : mpf.PicturePath,
                           connectionID = c.ContactId.ToString(),
                           showType = "",
                           status = c.Status.ToString(),
                           titleDesc = mpf.TitleDesc

                       }).ToList();
            return lst;
        }


        /// <summary>
        /// Get the list of contact requests.
        /// </summary>
        /// <param name="memberID"></param>
        /// <returns></returns>
        public List<MemberConnectionModel> GetRequestsList(int memberID)
        {
            var lst = (from mpf in _context.TbMemberProfile
                       join c in _context.TbContactRequests on mpf.MemberId equals c.FromMemberId
                       where c.ToMemberId == memberID && (c.Status == 0)
                       select new MemberConnectionModel()
                       {
                           friendName = mpf.FirstName + " " + mpf.LastName,
                           firstName = mpf.FirstName,
                           picturePath = string.IsNullOrEmpty(mpf.PicturePath) ? "default.png" : mpf.PicturePath,
                           connectionID = c.FromMemberId.ToString(),

                       }).ToList();
            return lst;
        }

        /// <summary>
        /// /Get the list of members by search type
        /// </summary>
        /// <param name="userID"></param>
        /// <param name="searchType"></param>
        /// <param name="searchText"></param>
        /// <returns></returns>
        public List<MemberConnectionModel> GetMembersBySearchType(int userID, string searchType, string searchText)
        {
            string[] s = searchText.Split(' ');
            string name = s[0];
            string name2 = "";
            if (s.Length > 1)
                name2 = s[1];

            if (searchType.ToLower() != "name" && searchType.ToLower() != "people")
                name = searchText;

            if (searchText.IndexOf("@", StringComparison.CurrentCulture) != -1) //email search
                searchType = "email";

            List<MemberConnectionModel> lst = null;

            var lstReq = (from t in _context.TbContactRequests where t.FromMemberId == userID select t).ToList();
            var lstCont = (from t in _context.TbContacts where t.MemberId == userID select new { t.MemberId }).ToList();

            if (searchType.ToLower() == "email")
            {
                lst = (from mpf in _context.TbMemberProfile
                       join m in _context.TbMembers on mpf.MemberId equals m.MemberId
                       where m.Email == name
                       select new MemberConnectionModel()
                       {
                           friendName = mpf.FirstName + " " + mpf.LastName,
                           firstName = mpf.FirstName,
                           picturePath = string.IsNullOrEmpty(mpf.PicturePath) ? "default.png" : mpf.PicturePath,
                           connectionID = m.MemberId.ToString(),
                           showType = "",
                           titleDesc = mpf.TitleDesc,
                           email = m.Email,
                           labelText = ((m.MemberId == userID) || (lstReq.Any(mb => mb.FromMemberId == m.MemberId)) || ((lstCont.Any(c => c.MemberId == m.MemberId)) && m.MemberId != userID)) ? "View Profile" : "Add as Contact",
                           nameAndID = m.MemberId.ToString() + "," + mpf.FirstName + "," + mpf.LastName,
                           Params = m.MemberId.ToString() + ",'" + mpf.FirstName + "','" + mpf.LastName + "'",
                       }).ToList();
            }
            else if (searchType.ToLower() == "employer" || searchType.ToLower() == "company")
            {
                lst = (from mpf in _context.TbMemberProfile
                       join m in _context.TbMembers on mpf.MemberId equals m.MemberId
                       join e in _context.TbMemberProfileEmploymentInfoV2 on m.MemberId equals e.MemberId
                       where e.CompanyName.Contains(name)
                       select new MemberConnectionModel()
                       {
                           friendName = mpf.FirstName + " " + mpf.LastName,
                           firstName = mpf.FirstName,
                           picturePath = string.IsNullOrEmpty(mpf.PicturePath) ? "default.png" : mpf.PicturePath,
                           connectionID = m.MemberId.ToString(),
                           showType = "",
                           titleDesc = mpf.TitleDesc,
                           email = m.Email,
                           labelText = ((m.MemberId == userID) || (lstReq.Any(mb => mb.FromMemberId == m.MemberId)) || ((lstCont.Any(c => c.MemberId == m.MemberId)) && m.MemberId != userID)) ? "View Profile" : "Add as Contact",
                           nameAndID = m.MemberId.ToString() + "," + mpf.FirstName + "," + mpf.LastName,
                           Params = m.MemberId.ToString() + ",'" + mpf.FirstName + "','" + mpf.LastName + "'",
                       }).ToList();
            }
            else if (searchType.ToLower() == "public")
            {
                lst = (from mpf in _context.TbMemberProfile
                       join m in _context.TbMembers on mpf.MemberId equals m.MemberId
                       join e in _context.TbMemberProfileEducationV2 on m.MemberId equals e.MemberId
                       where e.SchoolName.Contains(name) && e.SchoolType == 1
                       select new MemberConnectionModel()
                       {
                           friendName = mpf.FirstName + " " + mpf.LastName,
                           firstName = mpf.FirstName,
                           picturePath = string.IsNullOrEmpty(mpf.PicturePath) ? "default.png" : mpf.PicturePath,
                           connectionID  = m.MemberId.ToString(),
                           showType = "",
                           titleDesc = mpf.TitleDesc,
                           email = m.Email,
                           labelText = ((m.MemberId == userID) || (lstReq.Any(mb => mb.FromMemberId == m.MemberId)) || ((lstCont.Any(c => c.MemberId == m.MemberId)) && m.MemberId != userID)) ? "View Profile" : "Add as Contact",
                           nameAndID = m.MemberId.ToString() + "," + mpf.FirstName + "," + mpf.LastName,
                           Params = m.MemberId.ToString() + ",'" + mpf.FirstName + "','" + mpf.LastName + "'",
                       }).ToList();
            }
            else if (searchType.ToLower() == "private")
            {
                lst = (from mpf in _context.TbMemberProfile
                       join m in _context.TbMembers on mpf.MemberId equals m.MemberId
                       join e in _context.TbMemberProfileEducationV2 on m.MemberId equals e.MemberId
                       where e.SchoolName.Contains(name) && e.SchoolType == 2
                       select new MemberConnectionModel()
                       {
                           friendName = mpf.FirstName + " " + mpf.LastName,
                           firstName = mpf.FirstName,
                           picturePath = string.IsNullOrEmpty(mpf.PicturePath) ? "default.png" : mpf.PicturePath,
                           connectionID = m.MemberId.ToString(),
                           showType = "",
                           titleDesc = mpf.TitleDesc,
                           email = m.Email,
                           labelText = ((m.MemberId == userID) || (lstReq.Any(mb => mb.FromMemberId == m.MemberId)) || ((lstCont.Any(c => c.MemberId == m.MemberId)) && m.MemberId != userID)) ? "View Profile" : "Add as Contact",
                           nameAndID = m.MemberId.ToString() + "," + mpf.FirstName + "," + mpf.LastName,
                           Params = m.MemberId.ToString() + ",'" + mpf.FirstName + "','" + mpf.LastName + "'",
                       }).ToList();
            }
            else if (searchType.ToLower() == "college")
            {
                lst = (from mpf in _context.TbMemberProfile
                       join m in _context.TbMembers on mpf.MemberId equals m.MemberId
                       join e in _context.TbMemberProfileEducationV2 on m.MemberId equals e.MemberId
                       where e.SchoolName.Contains(searchText) && e.SchoolType == 3
                       select new MemberConnectionModel()
                       {
                           friendName = mpf.FirstName + " " + mpf.LastName,
                           firstName = mpf.FirstName,
                           picturePath = string.IsNullOrEmpty(mpf.PicturePath) ? "default.png" : mpf.PicturePath,
                           connectionID = m.MemberId.ToString(),
                           showType = "",
                           titleDesc = mpf.TitleDesc,
                           email = m.Email,
                           labelText = ((m.MemberId == userID) || (lstReq.Any(mb => mb.FromMemberId == m.MemberId)) || ((lstCont.Any(c => c.MemberId == m.MemberId)) && m.MemberId != userID)) ? "View Profile" : "Add as Contact",
                           nameAndID = m.MemberId.ToString() + "," + mpf.FirstName + "," + mpf.LastName,
                           Params = m.MemberId.ToString() + ",'" + mpf.FirstName + "','" + mpf.LastName + "'",
                       }).ToList();
            }
            else if (searchType.ToLower() == "name" || searchType.ToLower() == "people")
            {
                lst = (from mpf in _context.TbMemberProfile
                       join m in _context.TbMembers on mpf.MemberId equals m.MemberId
                       //join e in context.TbMemberProfileEducationV2 on m.MemberId equals e.MemberId
                       where mpf.FirstName.Contains(name) && mpf.LastName.Contains(name2)
                       select new MemberConnectionModel()
                       {
                           friendName = mpf.FirstName + " " + mpf.LastName,
                           firstName = mpf.FirstName,
                           picturePath = string.IsNullOrEmpty(mpf.PicturePath) ? "default.png" : mpf.PicturePath,
                           connectionID = m.MemberId.ToString(),
                           showType = "",
                           titleDesc = mpf.TitleDesc,
                           email = m.Email,
                           labelText = ((m.MemberId == userID) || (lstReq.Any(mb => mb.FromMemberId == m.MemberId)) || ((lstCont.Any(c => c.MemberId == m.MemberId)) && m.MemberId != userID)) ? "View Profile" : "Add as Contact",
                           nameAndID = m.MemberId.ToString() + "," + mpf.FirstName + "," + mpf.LastName,
                           Params = m.MemberId.ToString() + ",'" + mpf.FirstName + "','" + mpf.LastName + "'",
                       }).ToList();
            }
            return lst;
        }


        /// <summary>
        /// Gets the search contacts.
        /// </summary>
        /// <returns>The search contacts.</returns>
        /// <param name="userID">User identifier.</param>
        /// <param name="searchText">Search text.</param>
        public List<MemberConnectionModel> GetSearchConnections(int userID, string searchText)
        {
            var result = _context.Set<MemberConnectionModel>().FromSqlRaw("exec spGetSearchContacts @UserID, @SearchText, @SearchText2 ", new SqlParameter("@UserID", userID), new SqlParameter("@SearchText", searchText), new SqlParameter("@SearchText2", ""));
            return new List<MemberConnectionModel>(result);
        }


        /// <summary>
        /// Get the list of members phone book.
        /// </summary>
        /// <param name="memberID"></param>
        /// <returns></returns>
        public List<MemberPhoneBookModel> GetMemberPhoneBook(int memberID)
        {
            var lst = (from mpf in _context.TbMemberProfile
                       join c in _context.TbContacts on mpf.MemberId equals c.MemberId
                       join ps in _context.TbMemberProfileContactInfo on c.MemberId equals ps.MemberId
                       where (mpf.MemberId == memberID && ps.HomePhone == null && ps.CellPhone != null)

                       select new MemberPhoneBookModel()
                       {
                           friendName = mpf.FirstName + " " + mpf.LastName,
                           homePhone = ps.HomePhone,
                           cellPhone = ps.CellPhone,
                           picturePath = (string.IsNullOrEmpty(mpf.PicturePath)) ? "default.png" : mpf.PicturePath,
                           connectionID = c.ContactId.ToString()
                       }
                      )
                    .ToList();
            return lst;
        }

        /// <summary>
        /// Get the list of members browsed contacts.
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="categoryID"></param>
        /// <param name="subCategory"></param>
        /// <returns></returns>
        public List<MemberConnectionModel> GetMemberBrowsedConnections(int memberID, int categoryID, string subCategory)
        {
            List<MemberConnectionModel> lst = null;
            if (categoryID == 1)
            {
                lst = (from mpf in _context.TbMemberProfile
                       join c in _context.TbContacts on mpf.MemberId equals c.MemberId
                       join ps in _context.TbMemberProfileContactInfo on c.MemberId equals ps.MemberId
                       where (mpf.MemberId == memberID && ps.City == subCategory)

                       select new MemberConnectionModel()
                       {
                           friendName = mpf.FirstName + " " + mpf.LastName,
                           location = ps.City + " " + ps.State,
                           titleDesc = mpf.TitleDesc,
                           picturePath = (string.IsNullOrEmpty(mpf.PicturePath)) ? "default.png" : mpf.PicturePath,
                           connectionID = c.ContactId.ToString()
                       }
                      ).ToList();
            }
            else if (categoryID == 2)
            {


                lst = (from mpf in _context.TbMemberProfile
                       join c in _context.TbContacts on mpf.MemberId equals c.MemberId
                       join ps in _context.TbMemberProfileContactInfo on c.MemberId equals ps.MemberId
                       join ed in _context.TbMemberProfileEducationV2 on c.MemberId equals ed.MemberId
                       where (mpf.MemberId == memberID && ed.SchoolName == subCategory && ed.SchoolType == 3)

                       select new MemberConnectionModel()
                       {
                           friendName = mpf.FirstName + " " + mpf.LastName,
                           location = ps.City + " " + ps.State,
                           titleDesc = mpf.TitleDesc,
                           picturePath = (string.IsNullOrEmpty(mpf.PicturePath)) ? "default.png" : mpf.PicturePath,
                           connectionID = c.ContactId.ToString()

                       }
                      ).ToList();
            }
            else
            {
                lst = (from mpf in _context.TbMemberProfile
                       join c in _context.TbContacts on mpf.MemberId equals c.MemberId
                       join ps in _context.TbMemberProfileContactInfo on c.MemberId equals ps.MemberId
                       join ed in _context.TbMemberProfileEducationV2 on c.MemberId equals ed.MemberId
                       where (mpf.MemberId == memberID && ed.SchoolName == subCategory && (ed.SchoolType == 1 || ed.SchoolType == 2))

                       select new MemberConnectionModel()
                       {
                           friendName = mpf.FirstName + " " + mpf.LastName,
                           location = ps.City + " " + ps.State,
                           titleDesc = mpf.TitleDesc,
                           picturePath = (string.IsNullOrEmpty(mpf.PicturePath)) ? "default.png" : mpf.PicturePath,
                           connectionID = c.ContactId.ToString()
                       }
                      ).ToList();
            }
            return lst;
        }

        /// <summary>
        /// Search for member by type
        /// </summary>
        /// <param name="userID"></param>
        /// <param name="searchType"></param>
        /// <param name="searchString"></param>
        /// <returns></returns>
        public List<MemberByTypeModel> SearchMemberByType(int userID, int searchType, string searchString)
        {
            var lstCont = (from t in _context.TbContacts where t.MemberId == userID select new { t.MemberId }).ToList();

            List<MemberByTypeModel> lst = null;

            if (searchType == 1)
            { //email
                lst = (from mpf in _context.TbMemberProfile
                       join m in _context.TbMembers on mpf.MemberId equals m.MemberId
                       where m.Email.Contains(searchString)

                       select new MemberByTypeModel()
                       {
                           MemberID = m.MemberId.ToString(),
                           Name = mpf.FirstName + " " + mpf.LastName,
                           TypeVal = m.Email,
                           PicturePath = (string.IsNullOrEmpty(mpf.PicturePath)) ? "default.png" : mpf.PicturePath,
                           IsFriend = ((lstCont.Any(c => c.MemberId == m.MemberId)) && m.MemberId != userID) ? "yes" : "no",
                           IsSamePerson = (m.MemberId == userID) ? "yes" : "no",
                       }
                      ).ToList();
            }
            else if (searchType == 2)
            { //high schools
                lst = (from mpf in _context.TbMemberProfile
                       join m in _context.TbMembers on mpf.MemberId equals m.MemberId
                       join p in _context.TbMemberProfileEducationV2 on m.MemberId equals p.MemberId
                       where p.SchoolName.Contains(searchString) && (p.SchoolType == 1 || p.SchoolType == 0)

                       select new MemberByTypeModel()
                       {
                           MemberID = m.MemberId.ToString(),
                           Name = mpf.FirstName + " " + mpf.LastName,
                           TypeVal = p.SchoolName,
                           PicturePath = (string.IsNullOrEmpty(mpf.PicturePath)) ? "default.png" : mpf.PicturePath,
                           IsFriend = ((lstCont.Any(c => c.MemberId == m.MemberId)) && m.MemberId != userID) ? "yes" : "no",
                           IsSamePerson = (m.MemberId == userID) ? "yes" : "no",
                       }
                      ).ToList();
            }
            else if (searchType == 4)
            { //college
                lst = (from mpf in _context.TbMemberProfile
                       join m in _context.TbMembers on mpf.MemberId equals m.MemberId
                       join p in _context.TbMemberProfileEducationV2 on m.MemberId equals p.MemberId
                       where p.SchoolName.Contains(searchString) && (p.SchoolType == 3)

                       select new MemberByTypeModel()
                       {
                           MemberID = m.MemberId.ToString(),
                           Name = mpf.FirstName + " " + mpf.LastName,
                           TypeVal = p.SchoolName,
                           PicturePath = (string.IsNullOrEmpty(mpf.PicturePath)) ? "default.png" : mpf.PicturePath,
                           IsFriend = ((lstCont.Any(c => c.MemberId == m.MemberId)) && m.MemberId != userID) ? "yes" : "no",
                           IsSamePerson = (m.MemberId == userID) ? "yes" : "no",
                       }
                      ).ToList();
            }
            return lst;
        }


        /// <summary>
        /// Accept contact's request 
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="contactID"></param>
        public void AcceptRequest(int memberID, int contactID)
        {
            var pMemberID = new SqlParameter("@MemberID", memberID);
            var pContactID = new SqlParameter("@ContactID", contactID);
            _context.Database.ExecuteSqlRaw("EXEC spAcceptRequest @MemberID, @ContactID", pMemberID, pContactID);
        }

        /// <summary>
        /// Reject contact's request
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="contactID"></param>
        public void RejectRequest(int memberID, int contactID)
        {
            var pMemberID = new SqlParameter("@MemberID", memberID);
            var pContactID = new SqlParameter("@ContactID", contactID);
            _context.Database.ExecuteSqlRaw("EXEC spRejectRequest @MemberID, @ContactID", pMemberID, pContactID);

        }

        /// <summary>
        /// Delete contact
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="contactID"></param>
        public void DeleteConnection(int memberID, int contactID)
        {
            var pMemberID = new SqlParameter("@MemberID", memberID);
            var pContactID = new SqlParameter("@ContactID", contactID);
            _context.Database.ExecuteSqlRaw("EXEC spDeleteContact @MemberID, @ContactID", pMemberID, pContactID);
        }

        /// <summary>
        /// Get entity by search type
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="searchText"></param>
        /// <param name="searchType"></param>
        /// <returns></returns>
        public List<EntityModel> GetEntityBySearchType(int memberID, string searchText, string searchType)
        {
            List<EntityModel> lst = null;
            if (searchType.ToLower() == "contact")
            {
                lst = (from mpf in _context.TbMemberProfile
                       join c in _context.TbContacts on mpf.MemberId equals c.MemberId
                       join p in _context.TbMemberProfileContactInfo on c.MemberId equals p.MemberId
                       where c.MemberId == memberID && (mpf.LastName.Contains(searchText) || mpf.FirstName.Contains(searchText))

                       select new EntityModel()
                       {
                           entityID = c.ContactId.ToString(),
                           entityName = mpf.FirstName + " " + mpf.LastName,
                           firstName = mpf.FirstName,
                           lastName = mpf.LastName,
                           picturePath = (string.IsNullOrEmpty(mpf.PicturePath)) ? "default.png" : mpf.PicturePath,
                           cityState = p.City + ", " + p.State,
                           id = c.ContactId.ToString(),
                           name = mpf.FirstName + " " + mpf.LastName
                       }
                      ).ToList();
            }
            else if (searchType == "people")
            {
                lst = (from mpf in _context.TbMemberProfile
                       join c in _context.TbMembers on mpf.MemberId equals c.MemberId
                       join p in _context.TbMemberProfileContactInfo on c.MemberId equals p.MemberId
                       where (mpf.LastName.Contains(searchText)) || (mpf.FirstName.Contains(searchText)) || ((mpf.FirstName + " " + mpf.LastName).Contains(searchText))

                       select new EntityModel()
                       {
                           entityID = c.MemberId.ToString(),
                           entityName = mpf.FirstName + " " + mpf.LastName,
                           firstName = mpf.FirstName,
                           lastName = mpf.LastName,
                           picturePath = (string.IsNullOrEmpty(mpf.PicturePath)) ? "default.png" : mpf.PicturePath,
                           cityState = p.City + ", " + p.State,
                           id = c.MemberId.ToString(),
                           name = mpf.FirstName + " " + mpf.LastName
                       }
                      ).ToList();
            }
            else if (searchType == "network")
            {
                lst = (from net in _context.TbNetworks
                       where net.NetworkName.Contains(searchText)

                       select new EntityModel()
                       {
                           entityID = net.NetworkId.ToString(),
                           entityName = net.NetworkName,
                           firstName = "",
                           lastName = "",
                           picturePath = (string.IsNullOrEmpty(net.Image)) ? "default.png" : net.Image,
                           cityState = net.City + ", " + net.State,
                           id = net.NetworkId.ToString(),
                           name = net.NetworkName
                       }
                      ).ToList();
            }
            else if (searchType == "event")
            {
                lst = (from evt in _context.TbEvents
                       where evt.PlanningWhat.Contains(searchText)

                       select new EntityModel()
                       {
                           entityID = evt.EventId.ToString(),
                           entityName = evt.PlanningWhat,
                           firstName = "",
                           lastName = "",
                           picturePath = (string.IsNullOrEmpty(evt.EventImg)) ? "default.png" : evt.EventImg,
                           cityState = evt.StartDate.Value.ToShortDateString() + " at " + evt.StartTime + " - " + evt.Location,
                           id = evt.EventId.ToString(),
                           name = evt.PlanningWhat
                       }
                      ).ToList();
            }
            return lst;
        }

        /// <summary>
        /// Get contact search results 
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="searchText"></param>
        /// <returns></returns>
        public List<ConnectionSearchModel> ContactSearchResults(int memberID, string searchText)
        {
            List<ConnectionSearchModel> lst = null;
            lst = (from mpf in _context.TbMemberProfile
                   join c in _context.TbContacts on mpf.MemberId equals c.MemberId
                   join p in _context.TbMemberProfileContactInfo on c.MemberId equals p.MemberId
                   where c.MemberId == memberID && (mpf.LastName.Contains(searchText) || mpf.FirstName.Contains(searchText))

                   select new ConnectionSearchModel()
                   {
                       entityID = c.ContactId.ToString(),
                       entityName = mpf.FirstName + " " + mpf.LastName,
                       firstName = mpf.FirstName,
                       lastName = mpf.LastName,
                       picturePath = (string.IsNullOrEmpty(mpf.PicturePath)) ? "default.png" : mpf.PicturePath,
                       cityState = p.City + ", " + p.State,
                       labelText = "",
                       email = "",
                       nameAndID = "",
                       Params = "",
                       paramsAV = "",
                       description = "",
                       memberCount = "",
                       createdDate = "01/01/1900",
                       location = "",
                       eventDate = "",
                       rsvp = "",
                       startDate = "",
                       endDate = ""
                   }
                      ).ToList();
            return lst;
        }

        /// <summary>
        /// return people search result
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="searchText"></param>
        /// <returns></returns>
        public List<ConnectionSearchModel> PeopleSearchResults(int memberID, string searchText)
        {
            var lstReq = (from t in _context.TbContactRequests where t.FromMemberId == memberID select t).ToList();
            var lstCont = (from t in _context.TbContacts where t.MemberId == memberID select new { t.MemberId }).ToList();

            List<ConnectionSearchModel> lst = null;
            lst = (from mpf in _context.TbMemberProfile
                   join m in _context.TbMembers on mpf.MemberId equals m.MemberId
                   where (mpf.LastName.Contains(searchText) || mpf.FirstName.Contains(searchText))

                   select new ConnectionSearchModel()
                   {
                       entityID = m.MemberId.ToString(),
                       entityName = mpf.FirstName + " " + mpf.LastName,
                       firstName = mpf.FirstName,
                       lastName = mpf.LastName,
                       picturePath = (string.IsNullOrEmpty(mpf.PicturePath)) ? "default.png" : mpf.PicturePath,
                       cityState = "",
                       labelText = ((m.MemberId == memberID) || (lstReq.Any(mb => mb.FromMemberId == m.MemberId)) || ((lstCont.Any(c => c.MemberId == m.MemberId)) && m.MemberId != memberID)) ? "View Profile" : "Add as Contact",
                       email = m.Email,
                       nameAndID = m.MemberId.ToString() + "," + mpf.FirstName + "," + mpf.LastName,
                       Params = m.MemberId.ToString() + ",'" + mpf.FirstName + "','" + mpf.LastName + "'",
                       paramsAV = "",
                       description = "",
                       memberCount = "",
                       createdDate = "01/01/1900",
                       location = "",
                       eventDate = "",
                       rsvp = "",
                       startDate = "",
                       endDate = ""
                   }
                      ).ToList();
            return lst;
        }

        /// <summary>
        /// return network search result
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="searchText"></param>
        /// <returns></returns>
        public List<NetworkSearchModel> NetworkSearchResults(int memberID, string searchText)
        {
            var lstNetReq = (from t in _context.TbNetworkRequests where t.MemberId == memberID select t).ToList();
            var lstNetMemb = (from t in _context.TbNetworkMembers where t.MemberId == memberID select new { t.NetworkId }).ToList();

            List<NetworkSearchModel> lst = null;
            lst = (from n in _context.TbNetworks
                   where (n.NetworkName.Contains(searchText))

                   select new NetworkSearchModel()
                   {
                       entityID = n.NetworkId.ToString(),
                       entityName = n.NetworkName,
                       picturePath = (string.IsNullOrEmpty(n.Image)) ? "default.png" : n.Image,
                       cityState = "",
                       labelText = (lstNetReq.Any(mb => mb.NetworkId == n.NetworkId)) || (lstNetMemb.Any(c => c.NetworkId == n.NetworkId)) ? "View Network" : "Join Network",
                       email = string.IsNullOrEmpty(n.Email) ? "" : n.Email,
                       nameAndID = n.NetworkId.ToString() + "," + n.NetworkName,
                       Params = n.NetworkId.ToString() + ",'" + n.NetworkName,
                       paramsAV = "",
                       description = n.Description,
                       memberCount = "0 Members",
                       createdDate = string.IsNullOrEmpty(n.CreatedDate.ToString()) ? "" : n.CreatedDate.ToString(),
                       location = "",
                       eventDate = "",
                       rsvp = "",
                       startDate = "",
                       endDate = ""
                   }
                      ).ToList();
            return lst;
        }


        /// <summary>
        /// return event search result
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="searchText"></param>
        /// <returns></returns>
        public List<EventSearchModel> EventSearchResults(int memberID, string searchText)
        {
            List<EventSearchModel> lst = null;
            lst = (from e in _context.TbEvents
                   join ei in _context.TbEventInvites on e.EventId equals ei.EventId
                   where e.PlanningWhat.Contains(searchText)

                   select new EventSearchModel()
                   {
                       entityID = e.EventId.ToString(),
                       entityName = e.PlanningWhat,
                       picturePath = (string.IsNullOrEmpty(e.EventImg)) ? "default.png" : e.EventImg,
                       cityState = "",
                       labelText = "",
                       email = "",
                       NameAndID = "",
                       eventParams = "",
                       Params = e.EventId.ToString() + ";" + e.PlanningWhat + ";" + ei.Rsvpstatus.ToString() + (string.IsNullOrEmpty(e.EventImg) ? "default.png" : e.EventImg).ToString() + ";" + e.StartDate.Value.ToShortDateString() + " at " + e.StartTime,
                       ParamsAV = "",
                       description = "",
                       memberCount = "",
                       createdDate = string.IsNullOrEmpty(e.CreatedDate.ToString()) ? "" : e.CreatedDate.ToString(),
                       location = e.Location,
                       eventDate = e.StartDate.Value.ToShortDateString() + " at " + e.StartTime,
                       rsvp = (ei.MemberId == memberID) ? ei.Rsvpstatus : "",
                       startDate = e.StartDate.Value.ToShortDateString(),
                       endDate = e.EndDate.Value.ToShortDateString(),
                       ShowCancel = (e.MemberId == memberID) ? "true" : "false"
                   }
                      ).ToList();
            return lst;
        }

        public List<SearchModel> SearchResults(int memberID, string searchText)
        {
            var result = _context.Set<SearchModel>().FromSqlRaw("exec spSearchResults @MemberID, @SearchText ", new SqlParameter("@MemberID", memberID), new SqlParameter("@SearchText", searchText));
            return new List<SearchModel>(result);
        }

        public void SendRequestConnection(string memberID, string contactID)
        {
            _mbrRepo.SendFriendRequest(Convert.ToInt32(memberID), contactID);

            // MessageDataManager msgObj = new MessageDataManager();
            string msg = "I would like to add you to my contact list so we can start networking. Please accept the request from your request connections list.";
            _msgRepo.CreateMessage(Convert.ToInt32(contactID), Convert.ToInt32(memberID), "Requesting Contact", msg, "", "");

        }

        public IEnumerable<dynamic> GetDynamicResult(string commandText, params SqlParameter[] parameters)
        {
            // Get the connection from DbContext
            var connection = _context.Database.GetDbConnection();

            // Open the connection if isn't open
            if (connection.State != System.Data.ConnectionState.Open)
                connection.Open();

            using (var command = connection.CreateCommand())
            {
                command.CommandText = commandText;
                command.Connection = connection;

                if (parameters?.Length > 0)
                {
                    foreach (var parameter in parameters)
                    {
                        command.Parameters.Add(parameter);
                    }
                }

                using (var dataReader = command.ExecuteReader())
                {
                    // List for column names
                    var names = new List<string>();

                    if (dataReader.HasRows)
                    {
                        // Add column names to list
                        for (var i = 0; i < dataReader.VisibleFieldCount; i++)
                        {
                            names.Add(dataReader.GetName(i));
                        }
                        while (dataReader.Read())
                        {
                            // Create the dynamic result for each row
                            var result = new ExpandoObject() as IDictionary<string, object>;
                            foreach (var name in names)
                            {
                                // Add key-value pair
                                // key = column name
                                // value = column value
                                result.Add(name, dataReader[name]);
                            }
                            yield return result;
                        }
                    }
                }
            }
        }
    }

    public interface IConnectionRepository {
        List<MemberConnectionModel> GetMemberConnections(int memberID, string show);
        List<MemberConnectionModel> GetMemberConnectionSuggestions(int memberID);
        List<MemberConnectionModel> SearchMemberConnections(int memberID, string searchText);
        List<MemberConnectionModel> GetMemberNetworkInviteConnectionList(int memberID, int networkID);
        List<MemberConnectionModel> GetRequestsList(int memberID);
        List<MemberConnectionModel> GetMembersBySearchType(int userID, string searchType, string searchText);
        List<MemberConnectionModel> GetSearchConnections(int userID, string searchText);
        List<MemberPhoneBookModel> GetMemberPhoneBook(int memberID);
        List<MemberConnectionModel> GetMemberBrowsedConnections(int memberID, int categoryID, string subCategory);
       List<MemberByTypeModel>  SearchMemberByType(int userID, int searchType, string searchString);
        void AcceptRequest(int memberID, int contactID);
        void RejectRequest(int memberID, int contactID);
        void DeleteConnection(int memberID, int contactID);
        List<EntityModel> GetEntityBySearchType(int memberID, string searchText, string searchType);
        List<ConnectionSearchModel> ContactSearchResults(int memberID, string searchText);
        List<ConnectionSearchModel> PeopleSearchResults(int memberID, string searchText);
        List<NetworkSearchModel> NetworkSearchResults(int memberID, string searchText);
        List<EventSearchModel> EventSearchResults(int memberID, string searchText);
        List<SearchModel> SearchResults(int memberID, string searchText);
        void SendRequestConnection(string memberID, string contactID);
    }
}
