﻿using System;
using System.Collections.Generic;

namespace ESapi.DBContextModels
{
    public partial class TbMemberProfilePictures
    {
        public int ProfileId { get; set; }
        public int MemberId { get; set; }
        public string FileName { get; set; }
        public bool? IsDefault { get; set; }
        public bool? Removed { get; set; }
    }
}
