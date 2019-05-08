using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FutureSportsWebAPI.Models.OpenWeather
{
    public class OpenWeatherResponse
    {
        public string Name { get; set; }
        public IEnumerable<WeatherDescription> Weather { get; set; }
        public Main Main { get; set; }
    }
}
