﻿using System;
using System.Collections.Generic;

namespace ESapi.DBContextModels
{
    public partial class TbMessagesJunk
    {
        public int MessageId { get; set; }
        public int? SenderId { get; set; }
        public int? ContactId { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public DateTime? MsgDate { get; set; }
        public bool? Attachment { get; set; }
        public int MessageState { get; set; }
        public int? FlagLevel { get; set; }
        public int? ImportanceLevel { get; set; }
        public string AttachmentFile { get; set; }
        public string Source { get; set; }
        public string OriginalMsg { get; set; }

        public virtual TbMembers Contact { get; set; }
        public virtual TbMembers Sender { get; set; }
    }
}
