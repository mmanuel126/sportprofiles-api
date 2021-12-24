﻿using System;
using System.Collections.Generic;

namespace ESapi.DBContextModels
{
    public partial class TbResumeSettings
    {
        public int MemberId { get; set; }
        public bool? ShowResume { get; set; }
        public bool? ShowSpecialSkills { get; set; }
        public bool? ShowAbout { get; set; }
        public bool? ShowInterests { get; set; }
        public bool? ShowActivities { get; set; }
    }
}
