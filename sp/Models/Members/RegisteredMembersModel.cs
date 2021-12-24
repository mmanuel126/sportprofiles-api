using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ESapi.Models.Members
{
    public class RegisteredMembersModel
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
        public string sport { get; set; }
        public string registeredDate { get; set; }
    }
}