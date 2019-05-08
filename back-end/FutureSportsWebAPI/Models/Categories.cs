using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization.Attributes;
using System;
using Newtonsoft.Json;
using System.Collections.Generic;

using System.Linq;
using System.Threading.Tasks;

namespace FutureSportsWebAPI.Models
{

    [BsonIgnoreExtraElements]
    public class Categories
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string CategoryName { get; set; }
        public string ImageCategory { get; set; }

        public string MainPicGoogleMap { get; set; }
        public int MaxNoOfPlayers { get; set; }

        public override string ToString()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this, Formatting.Indented);
        }
    }
}
