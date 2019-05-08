using Microsoft.AspNetCore.Server.Kestrel.Internal.System.Collections.Sequences;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FutureSportsWebAPI.Models.ViewModels
{
    public class EventViewModel
    {

        // Events API
        public string Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public DateTime Date { get; set; }

        public List<string> UserIds { get; set; }

        // Category API
        public string CategoryId { get; set; }
       
        public string CategoryName { get; set; }
        public string ImageName { get; set; }
        public int MaxNoOfPlayers { get; set; }
        public string MainPicGoogleMap { get; set; }

        // Experience API
        public string ExperienceId { get; set; }
        public string ExperienceType { get; set; }

        // OpenWeather API
        public double Temperature { get; set; }
        public string Summary { get; set; }
        public string City { get; set; }
        public string Icon { get; set; }
        public string Description { get; set; }

        public string UserId { get; set; }
        public string EventId { get; set; }

        // Google Map Address
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Address { get; set; }
        public int ZipCode { get; set; }
        public string CountryName { get; set; }
        public string CountryCode { get; set; }
    }
}
