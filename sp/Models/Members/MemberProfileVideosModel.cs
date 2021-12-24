﻿namespace ESapi.Models.Members
{
    public class YoutubePlayListModel
    { 
        public string Etag { get; set; }
        public string Id { get; set; }
        public string Title {get; set;}
        public string Description {get; set;}
        public string DefaultThumbnail { get; set; }
        public string DefaultThumbnailHeight { get; set; }
        public string DefaultThumbnailWidth { get; set; }
    }

    public class YoutubeVideosListModel 
    { 
        public string Etag { get; set; }
        public string Id { get; set; }
        public string Title {get; set;}
        public string Description {get; set;}
        public string DefaultThumbnail { get; set; }
        public string DefaultThumbnailHeight { get; set; }
        public string DefaultThumbnailWidth { get; set; }
        public string PublishedAt { get; set; }
    }

}
