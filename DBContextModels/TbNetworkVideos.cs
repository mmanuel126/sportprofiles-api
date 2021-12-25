﻿using System;
using System.Collections.Generic;

namespace ESapi.DBContextModels
{
    public partial class TbNetworkVideos
    {
        public int VideoId { get; set; }
        public int NetworkId { get; set; }
        public int MemberId { get; set; }
        public string VideoName { get; set; }
        public string Description { get; set; }
        public string FileName { get; set; }
        public DateTime? VidDate { get; set; }
        public int? VidCategory { get; set; }
        public int? VidType { get; set; }
        public bool? Removed { get; set; }

        public virtual TbMembers Member { get; set; }
        public virtual TbNetworks Network { get; set; }
    }
}
