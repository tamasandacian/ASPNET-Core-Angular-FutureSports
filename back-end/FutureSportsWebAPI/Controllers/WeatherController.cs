using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using FutureSportsWebAPI.Data;
using FutureSportsWebAPI.Models;
using FutureSportsWebAPI.Models.OpenWeather;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace FutureSportsWebAPI.Controllers
{
    [Produces("application/json")]
    [Route("api/Weather")]
    public class WeatherController : Controller
    {
        private readonly MongoDbContext _context = null;
        public WeatherController(IOptions<Settings> settings)
        {
            _context = new MongoDbContext(settings);
        }

        [HttpGet("[action]/{zipCode}/{country_code}")]
        public async Task<IActionResult> City(int zipCode, string country_code)
        {
            using (var client = new HttpClient())
            {
                try
                {
                    client.BaseAddress = new Uri("http://api.openweathermap.org");
                    var response = await client.GetAsync($"/data/2.5/weather?zip={zipCode},{country_code}&appid=57044b031bfac6dc9012576e44419865&units=metric");
                    response.EnsureSuccessStatusCode();

                    var stringResult = await response.Content.ReadAsStringAsync();
                    var rawWeather = JsonConvert.DeserializeObject<OpenWeatherResponse>(stringResult);
                    return Ok(new
                    {
                        Temp = rawWeather.Main.Temp,
                        Summary = string.Join(",", rawWeather.Weather.Select(x => x.Main)),
                        Description = string.Join(",", rawWeather.Weather.Select(x => x.Description)),
                        Icon = string.Join(",", rawWeather.Weather.Select(x => x.Icon)),
                        City = rawWeather.Name,

                    });
                }
                catch (HttpRequestException httpRequestException)
                {
                    return BadRequest($"Error getting weather from OpenWeather: {httpRequestException.Message}");
                }
            }
        }
    }
}