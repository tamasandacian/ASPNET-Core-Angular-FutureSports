using Microsoft.AspNetCore.Server.Kestrel.Internal.System.Collections.Sequences;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace FutureSportsWebAPI.Models
{
    public class Events
    {
        [BsonRepresentation(BsonType.ObjectId)]

        // Event 
        public string Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public DateTime Date { get; set; }

        public int MaxNoOfPlayers { get; set; }

        public string CategoryId { get; set; }
        public Categories Categories { get; set; }

        public string ExperienceId { get; set; }
        public Experience Experiences { get; set; }
      
        public List<string> UserIds { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Address { get; set; }
        public int ZipCode { get; set; }
        public string CountryName { get; set; }
        public string CountryCode { get; set; }

        // OpenWeather
        public double Temperature { get; set; }
        public string Summary { get; set; }
        public string City { get; set; }
        public string Icon { get; set; }
        public string Description { get; set; }
    }
}
