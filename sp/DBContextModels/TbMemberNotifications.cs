﻿using System;
using System.Collections.Generic;

namespace ESapi.DBContextModels
{
    public partial class TbMemberNotifications
    {
        public int NotificationMemberId { get; set; }
        public int MemberId { get; set; }
        public int NotificationId { get; set; }
    }
}
