﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ESapi.Models.Members
{
    public class MemberProfilePhotosModel
    {        
        public string FileName { get; set; }
        public string IsDefault { get; set; }
        public string MemberID { get; set; }
        public string ProfileID { get; set; }
        public string Removed { get; set; }
    }

}
