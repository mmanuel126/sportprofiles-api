﻿using System;
using System.Collections.Generic;

namespace ESapi.DBContextModels
{
    public partial class TbNotifications
    {
        public int NotificationId { get; set; }
        public string Subject { get; set; }
        public string Notification { get; set; }
        public DateTime? SentDate { get; set; }
        public bool? Status { get; set; }
    }
}
