using System;
using System.Collections.Generic;

namespace ESapi.DBContextModels
{
    public partial class TbNetworkMemberRequests
    {
        public int? NetworkId { get; set; }
        public int? RequestorId { get; set; }
        public int? Status { get; set; }

        public virtual TbNetworks Network { get; set; }
    }
}
