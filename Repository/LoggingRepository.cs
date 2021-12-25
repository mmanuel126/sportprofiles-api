using System;
using System.Collections.Generic;
using System.Linq;
using ESapi.DBContextModels;
using ESapi.Models.Members;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace ESapi.Repository
{
    /// <summary>
    /// Describes the functionalities for accessing data for security
    /// </summary>
    public class LoggingRepository : ILoggingRepository
    {
        readonly dbContexts _context;
        public LoggingRepository(dbContexts context)
        {
            _context = context;
        }

        /// <summary>
        /// Allows you to change user password.
        /// </summary>
        /// <param name="email"></param>
        /// <param name="newPwd"></param>
        public void ChangePassword(string email, string newPwd)
        {
            var em = new SqlParameter("@Email", email);
            var nPwd = new SqlParameter("@NewPwd", newPwd);
            _context.Database.ExecuteSqlRaw("EXEC spChangePasswordViaEmail @Email, @NewPwd", em, nPwd);
        }

        /// <summary>
        /// validates a user to see if he/she has an account on this site.
        /// </summary>
        /// <param name="strEmail"></param>
        /// <param name="strPwd"></param>
        /// <returns></returns>
        public List<UserModel> ValidateUser(string strEmail, string strPwd)
        {
            var mlist = (from c in _context.TbMembers
                         join m in _context.TbMemberProfile on c.MemberId equals m.MemberId
                         where (c.Email == strEmail) && (c.Password == strPwd) && (c.Status == 2)
                         select new UserModel()
                         {
                             memberID = c.MemberId.ToString(),
                             name = m.FirstName + " " + m.LastName,
                             email = c.Email,
                             picturepath = m.PicturePath,
                             title = m.TitleDesc
                         }
                          ).ToList();
            if (mlist.Count() != 0)
            {
                ESapi.DBContextModels.TbMembers mem = new ESapi.DBContextModels.TbMembers();
          //      mem = (from m in _context.TbMembers where (m.Email == strEmail) && (m.Password == strPwd) && (m.Status == 2) select m).First();

                //mem.LastLoginDate = System.DateTime.Now;
          //      _context.SaveChanges();
            }
            return mlist;
        }

        /// <summary>
        /// validates a new registered user. returns a row of info about the validated user. 
        /// </summary>
        /// <param name="strEmail"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        public List<ValidateNewRegisteredUserModel> ValidateNewRegisteredUser(string strEmail, int code)
        {
            List<ValidateNewRegisteredUserModel> lst = (from m in _context.TbMembers
                                                        join mp in _context.TbMemberProfile on m.MemberId equals mp.MemberId
                                                        join mr in _context.TbMembersRegistered on m.MemberId equals mr.MemberId
                                                        where (mr.MemberCodeId == code) && (m.Email == strEmail) && (m.Status == 1)
                                                        select new ValidateNewRegisteredUserModel()
                                                        {
                                                            memberId = m.MemberId.ToString(),
                                                            email = m.Email,
                                                            firstName = mp.FirstName,
                                                            lastName = mp.LastName,
                                                            passWord = m.Password,
                                                            userImage = mp.PicturePath,
                                                            title = mp.TitleDesc
                                                        }

                    ).ToList();
            if (lst.Count != 0)
            {
                ESapi.DBContextModels.TbMembers mem = new ESapi.DBContextModels.TbMembers();
                mem = (from z in _context.TbMembers where z.MemberId == Convert.ToInt32(lst[0].memberId) select z).First();
                mem.Status = 2;
                _context.SaveChanges();
            }
            return (lst);
        }

        public List<UserModel> FindByUniqueEmail(string strEmail)
        {
            List<UserModel> lst = (from m in _context.TbMembers
                                   join mp in _context.TbMemberProfile on m.MemberId equals mp.MemberId
                                   where m.Email == strEmail
                                   select new UserModel()
                                   {
                                       memberID = m.MemberId.ToString(),
                                       email = m.Email,
                                       picturepath = mp.PicturePath
                                   }

                   ).ToList();
            return lst;
        }

        /// <summary>
        /// Creates the new user.
        /// </summary>
        /// <returns>The new user.</returns>
        /// <param name="firstName">First name.</param>
        /// <param name="lastName">Last name.</param>
        /// <param name="email">Email.</param>
        /// <param name="password">Password.</param>
        /// <param name="gender">Gender.</param>
        /// <param name="month">Month.</param>
        /// <param name="day">Day.</param>
        /// <param name="year">Year.</param>
        public int CreateNewUser(string firstName, string lastName, string email, string password, string gender, string month,
                                  string day, string year, string profileType)
        {
            {
                var fName = new SqlParameter("@FirstName", firstName);
                var lName = new SqlParameter("@LastName", lastName);
                var em = new SqlParameter("@Email", email);
                var pwd = new SqlParameter("@Password", password);
                var gder = new SqlParameter("@Gender", gender);
                var mth = new SqlParameter("@Month", month);
                var da = new SqlParameter("@Day", day);
                var yr = new SqlParameter("@Year", year);
                var pType = new SqlParameter("@ProfileType", profileType);

                var memberCode = new SqlParameter
                {
                    ParameterName = "MemberCode",
                    SqlDbType = System.Data.SqlDbType.Int,
                    Direction = System.Data.ParameterDirection.Output
                };
                _context.Database.ExecuteSqlRaw("EXEC spCreateNewUser @FirstName,@LastName ,@Email,@Password,@Gender,@Month,@Day,@Year, @ProfileType, @MemberCode OUTPUT",
                                    fName, lName, em, pwd, gder, mth, da, yr, pType, memberCode);

                return ((int)memberCode.Value);
            }
        }

        /// <summary>
        /// check to see if email exists -- everyone on here has a unique email address
        /// </summary>
        /// <param name="email"></param>
        /// <returns>return list if email exist</returns>
        public List<TbMembers> CheckEmailExists(string email)
        {
            var mlist = (from m in _context.TbMembers where (m.Email == email) select m).ToList();
            return mlist;
        }

        /// <summary>
        /// get code and name for forgot passwords
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public List<CodeAndNameForgotPwdModel> GetCodeAndNameForgotPwd(string email)
        {
            List<CodeAndNameForgotPwdModel> bLST = new List<CodeAndNameForgotPwdModel>();
            var l = (from m in _context.TbMembers
                     join mp in _context.TbMemberProfile on m.MemberId equals mp.MemberId
                     where m.Email == email
                     select mp).ToList();

            var memID = l[0].MemberId;
            var fName = l[0].FirstName;

            CodeAndNameForgotPwdModel lst = new CodeAndNameForgotPwdModel();
            if (memID != 0)
            {
                ESapi.DBContextModels.TbForgotPwdCodes ins = new ESapi.DBContextModels.TbForgotPwdCodes();
                ins.Email = email;
                ins.CodeDate = System.DateTime.Now;
                ins.Status = 0;

                _context.TbForgotPwdCodes.Add(ins);
                _context.SaveChanges();

                lst.codeID = ins.CodeId.ToString();
                lst.firstName = fName;
                bLST.Add(lst);
            }
            else
            {
                lst.codeID = "0";
                lst.firstName = "";
                bLST.Add(lst);
            }
            return bLST;
        }

        /// <summary>
        /// checked code expired
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        public List<TbForgotPwdCodes> CheckCodeExpired(int code)
        {
            var flist = (from f in _context.TbForgotPwdCodes where (f.CodeId == code && f.Status == 0) select f).ToList();
            return flist;
        }

        /// <summary>
        /// Set the code to expire 
        /// </summary>
        /// <param name="code"></param>
        public void SetCodeToExpire(int code)
        {
            ESapi.DBContextModels.TbForgotPwdCodes fEdit = new ESapi.DBContextModels.TbForgotPwdCodes();
            fEdit = (from f in _context.TbForgotPwdCodes where f.CodeId == code select f).First();
            fEdit.Status = 1;
            _context.SaveChanges();
        }

        /// <summary>
        /// record log in user
        /// </summary>
        /// <param name="memberID"></param>
        public void RecordLogInUser(int memberID)
        {
            var mId = new SqlParameter("@MemberID", memberID);
            _context.Database.ExecuteSqlRaw("EXEC spLoggedInUser @MemberID", mId);
        }

        //    / <summary>
        //    / delete or remove log in user -- logout
        //    / </summary>
        //    / <param name="memberID"></param>
        //    public void DeleteLogInUser(int memberID)
        //    {
        //        var mId = new SqlParameter("@MemberID", memberID);
        //        _context.Database.ExecuteSqlRaw("EXEC spDeleteLoggedInUser @MemberID", mId);
        //    }

        /// <summary>
        /// check to see if user is active
        /// </summary>
        /// <param name="memberID"></param>
        /// <returns></returns>
        public bool IsActiveUser(int memberID)
        {
            var q = (from m in _context.TbMembers where m.MemberId == memberID && m.Status == 2 select m).ToList();
            if (q.Count != 0)
                return true;
            else
                return false;
        }

        /// <summary>
        /// Set status for member id - active, newregister, or inactive
        /// </summary>
        /// <param name="memberID"></param>
        /// <param name="status"></param>
        public void SetMemberStatus(int memberID, int status)
        {
            ESapi.DBContextModels.TbMembers mEdit = new ESapi.DBContextModels.TbMembers();
            mEdit = (from m in _context.TbMembers where m.MemberId == memberID select m).First();
            mEdit.Status = status;
            _context.SaveChanges();
        }
    }

    public interface ILoggingRepository
    {
        List<ValidateNewRegisteredUserModel> ValidateNewRegisteredUser(string strEmail, int code);
        List<CodeAndNameForgotPwdModel> GetCodeAndNameForgotPwd(string email);
        List<ESapi.DBContextModels.TbForgotPwdCodes> CheckCodeExpired(int code);
        void SetCodeToExpire(int code);
        void ChangePassword(string email, string newPwd);
        List<UserModel> ValidateUser(string strEmail, string strPwd);
        List<TbMembers> CheckEmailExists(string email);
        List<UserModel> FindByUniqueEmail(string strEmail);
        int CreateNewUser(string firstName, string lastName, string email, string password, string gender, string month,
                                  string day, string year, string profileType);
        void SetMemberStatus(int memberID, int status)  ;                        
    }

}

