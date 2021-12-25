﻿using System;
using System.Collections.Generic;

namespace ESapi.DBContextModels
{
    public partial class TbLinks
    {
        public int LinkId { get; set; }
        public int? OwnerId { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public string ThumbNail { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? OwnerType { get; set; }
        public int? PrivacyType { get; set; }

        public virtual TbMembers Owner { get; set; }
    }
}
