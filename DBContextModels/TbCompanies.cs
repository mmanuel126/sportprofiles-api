﻿using System;
using System.Collections.Generic;

namespace ESapi.DBContextModels
{
    public partial class TbCompanies
    {
        public string Symbol { get; set; }
        public string Name { get; set; }
        public string Ipoyear { get; set; }
        public string Sector { get; set; }
        public string Industry { get; set; }
        public string SummaryQuote { get; set; }
        public string Description { get; set; }
        public string Website { get; set; }
        public int Id { get; set; }
        public string Email { get; set; }
        public string ImageFile { get; set; }
    }
}
