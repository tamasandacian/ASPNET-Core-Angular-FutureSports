using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using FutureSportsWebAPI.Data;
using FutureSportsWebAPI.Models;
using FutureSportsWebAPI.Models.ViewModels;
using FutureSportsWebAPI.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace FutureSportsWebAPI.Controllers
{
    [Produces("application/json")]
    [Route("api/Events")]
    public class EventsController : Controller
    {
        private readonly MongoDbContext _context = null;
        private readonly IEventRepository _eventRepository;
        private IMapper _mapper;

        public EventsController(IEventRepository eventRepository, IMapper mapper, IOptions<Settings> settings)
        {
            _context = new MongoDbContext(settings);
            _eventRepository = eventRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetAllEvents()
        {
            return GetEvents();
        }

        private IActionResult GetEvents()
        {
            var events = _eventRepository.GetAll();
            return Json(events);
        }


        //[HttpGet("{id}")]
        [HttpGet("[action]/{eventId}")]
        public IEnumerable<User>  GetAllParticipants(string eventId)
        {
            return _eventRepository.GetAllUsersForEvent(eventId);
        }



        //[HttpGet("{id}")]
        [HttpGet("[action]/{id}")]
        public Task<Events> GetEventById(string id)
        {
            return GetEventsInternal(id);
        }

        private Task<Events> GetEventsInternal(string id)
        {
            return _eventRepository.GetEvent(id);
        }


        [HttpPost]
        public IActionResult CreateEvent([FromBody] JObject data, Events ev)
        {

            try
            {
                string experienceId = data["experienceId"].ToObject<string>();
                string categoryId = data["categoryId"].ToObject<string>();
                string usId = data["userId"].ToObject<string>();
                string address = data["address"].ToObject<string>();
                string countryName = data["countryName"].ToObject<string>();
                DateTime date = data["date"].ToObject<DateTime>();
                DateTime start = data["start"].ToObject<DateTime>();
                DateTime end = data["end"].ToObject<DateTime>();
                int maxNoOfPlayers = data["maxNoOfPlayers"].ToObject<int>();
                string countryCode = data["countryCode"].ToObject<string>();
                int zipCode = data["zipCode"].ToObject<int>();
                double longitude = data["longitude"].ToObject<double>();
                double latitude = data["latitude"].ToObject<double>();




                //check if an event exists for the specified time period
                var query = _context.Events.AsQueryable().Any(x => x.Date == date && x.Start == start && x.End == end);

                if (query)
                {
                    throw new ApplicationException("Sorry, you have to select different hours! \n Another event has been created for the following period");
                }


                List<string> eventList = new List<string>();

                ev.UserIds = eventList;
                ev.Latitude = latitude;
                ev.Longitude = longitude;
                ev.Date = date;
                ev.Start = start;
                ev.End = end;
                ev.MaxNoOfPlayers = maxNoOfPlayers;

                ev.ExperienceId = experienceId;
                ev.CategoryId = categoryId;

                ev.Address = address;
                ev.CountryName = countryName;
                ev.CountryCode = countryCode;
                ev.ZipCode = zipCode;

                _context.Events.InsertOne(ev);
                string evId = ev.Id.ToString();
                Debug.WriteLine("Event ID is: " + evId);

            }

            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok();
        }

        [HttpPut("[action]")]
        public IActionResult Participate([FromBody] JObject data, bool check)
        {
            try
            {
                string evId = data["eventId"].ToObject<string>();
                string usId = data["userId"].ToObject<string>();
                string catId = data["categoryId"].ToObject<string>();

                var event_filter = Builders<Events>.Filter.Eq(s => s.Id, evId);
                var e_result = _context.Events.Find(event_filter).FirstOrDefaultAsync();

                var user_filter = Builders<User>.Filter.Eq(x => x.Id, usId);
                var user_result = _context.Users.Find(user_filter).FirstOrDefaultAsync();


                var maxNoOfPlayers = e_result.Result.MaxNoOfPlayers;

                if (e_result.Result.UserIds == null || e_result.Result.UserIds.Count == 0)
                {

                    var update = Builders<Events>.Update.Push("UserIds", usId);
                    _context.Events.UpdateOneAsync(event_filter, update);

                    var userEventParticipate = Builders<User>.Update.Push(u => u.UserEvents, evId);
                    _context.Users.UpdateOneAsync(user_filter, userEventParticipate);
                    // e_result.Result.UserIds.Add(usId);
                }
                else
                {
                    // Check if the current logged in user exists already for this event
                    var match = e_result.Result.UserIds.FirstOrDefault(stringToCheck => stringToCheck.Contains(usId));

                    if (match != null)
                    {
                        throw new ApplicationException("You have already enrolled in this event!");
                    }
                    else
                    {
                        int count = e_result.Result.UserIds.Count();
                        if (count >= maxNoOfPlayers)
                        {
                            throw new ApplicationException("Unfortunately all seats have been ocupied!");
                        }
                        else
                        {
                            var insertUser = Builders<Events>.Update.Push(e => e.UserIds, usId);
                            _context.Events.UpdateOneAsync(event_filter, insertUser);

                            var userEventParticipate = Builders<User>.Update.Push(u => u.UserEvents, evId);
                            _context.Users.UpdateOneAsync(user_filter, userEventParticipate);

                        }
                    }
                }

            }

            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }


            return Ok();

        }



        [HttpPut("[action]")]
        public IActionResult Unparticipate([FromBody] JObject data, bool check)
        {
            try
            {
                string evId = data["eventId"].ToObject<string>();
                string usId = data["userId"].ToObject<string>();
             
                var filter_event = Builders<Events>.Filter.Eq(s => s.Id, evId);
                var e_result = _context.Events.Find(filter_event).FirstOrDefaultAsync();

                var filter_user = Builders<User>.Filter.Eq(u => u.Id, usId);
                var u_result = _context.Users.Find(filter_user).FirstOrDefaultAsync();

                var maxNoOfPlayers = e_result.Result.MaxNoOfPlayers;
                int count = e_result.Result.UserIds.Count();

                // Check if the current logged in user exists already for this event
                var match = e_result.Result.UserIds.FirstOrDefault(stringToCheck => stringToCheck.Contains(usId));

                if (match != null)
                {

                    if (e_result.Result.UserIds.Count == 0)
                    {
                        throw new ApplicationException("Sorry there is no one enrolled for this activity!");
                    }
                    else
                    {
                       var update = Builders<Events>.Update.Pull("UserIds", usId);
                       maxNoOfPlayers++;
                       _context.Events.UpdateOneAsync(filter_event, update);

                      var updateUserEvents = Builders<User>.Update.Pull("UserEvents", evId);
                         _context.Users.UpdateOneAsync(filter_user, updateUserEvents);
                    }

                    //if(maxNoOfPlayers > 1)
                    //{
                    //    var update = Builders<Events>.Update.Pull("UserIds", usId);
                    //    maxNoOfPlayers--;
                    //    _context.Events.UpdateOneAsync(filter_event, update);

                    //    var updateUserEvents = Builders<User>.Update.Pull("UserEvents", evId);
                    //    _context.Users.UpdateOneAsync(filter_user, updateUserEvents);
                    //}
                    //else
                    //{
                    //    throw new ApplicationException("Sorry there is still someone enrolled in this activity!");

                    //}




                }

                else
                {
                    throw new ApplicationException("Sorry you are not participating in this activity!");
                }

            }

            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }


            return Ok();

        }

    }
}