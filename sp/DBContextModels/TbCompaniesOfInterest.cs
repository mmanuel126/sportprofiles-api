﻿using System;
using System.Collections.Generic;

namespace ESapi.DBContextModels
{
    public partial class TbCompaniesOfInterest
    {
        public int CompInterestId { get; set; }
        public int CompanyId { get; set; }
        public int? MemberId { get; set; }
    }
}
