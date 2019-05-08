using FutureSportsWebAPI.Data;
using FutureSportsWebAPI.Models;
using FutureSportsWebAPI.Models.ViewModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace FutureSportsWebAPI.Repository
{
    public interface IEventRepository
    {
        IEnumerable<EventViewModel> GetAll();
        Task<Events> GetEvent(string id);
        List<User> GetAllUsersForEvent(string id);
        void AddEvent(Events ev);

    }

    public class EventRepository : IEventRepository
    {
        private readonly MongoDbContext _context = null;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IExperienceRepository _experienceRepository;
        private readonly IUserRepository _userRepository;

        public EventRepository(IOptions<Settings> settings, ICategoryRepository categoryRepository, IExperienceRepository experienceRepository, IUserRepository userRepository)
        {
            _context = new MongoDbContext(settings);
            _categoryRepository = categoryRepository;
            _experienceRepository = experienceRepository;
            _userRepository = userRepository;
        }

        public IEnumerable<EventViewModel> GetAll()
        {
            
            List<EventViewModel> eventList = new List<EventViewModel>();
            var listData = (from ev in _context.Events.Find(_ => true).ToEnumerable()
                            join cat in _context.Categories.Find(_ => true).ToEnumerable() on ev.CategoryId equals cat.Id
                            join exp in _context.Experiences.Find(_ => true).ToEnumerable() on ev.ExperienceId equals exp.Id
                            select new
                            {
                                ev.Id,
                                ev.Start,
                                ev.End,
                                ev.Date,
                                ev.Address,
                                ev.Latitude,
                                ev.Longitude,
                                ev.CategoryId,
                                ev.ExperienceId,
                                ev.UserIds,
                                cat.ImageCategory,
                                cat.MainPicGoogleMap,
                                cat.CategoryName,
                                cat.MaxNoOfPlayers,
                                exp.ExperienceType,

                            }).ToList();

            listData.ForEach(x =>
            {
                EventViewModel obj = new EventViewModel();
                obj.Id = x.Id;
                obj.Start = x.Start;
                obj.End = x.End;
                obj.Date = x.Date;
                obj.CategoryId = x.CategoryId;
                obj.ExperienceId = x.ExperienceId;
                obj.Latitude = x.Latitude;
                obj.Longitude = x.Longitude;
                obj.UserIds = x.UserIds;
                obj.Address = x.Address;
                obj.CategoryName = x.CategoryName;
                obj.ImageName = x.ImageCategory;
                obj.MainPicGoogleMap = x.MainPicGoogleMap;
                obj.ExperienceType = x.ExperienceType;
                eventList.Add(obj);
            });


            return eventList;
        }



        public Task<Events> GetEvent(string id)
        {

            try
            {
                /**
                 * Step 1: Retrieve an event by ID
                 */
                // Filter is a query
                var filter = Builders<Events>.Filter.Eq("Id", id);

                // Event is a retrieved object
                var e_result = _context.Events.Find(filter).FirstOrDefaultAsync();


                /**
                 * Step 2: Retrieve a category name by ID
                 */

                var category_result = _categoryRepository.GetCategoryById(e_result.Result.CategoryId);

                /**
                 * Step 3: Initiate a Categories object for the event object
                 */



                var maxNoOfPlayers = e_result.Result.MaxNoOfPlayers;
                var latitude = e_result.Result.Latitude;
                var longitude = e_result.Result.Longitude;
                var start = e_result.Result.Start;
                var end = e_result.Result.End;


                e_result.Result.Categories = new Categories();

                /**
                 * Step 4: Assign the category name to the newly created Categories object, which is belong to the retrieve event
                 */

                e_result.Result.CategoryId = category_result.Result.Id;

                e_result.Result.Categories.CategoryName = category_result.Result.CategoryName;

                e_result.Result.Categories.ImageCategory = category_result.Result.ImageCategory;

                e_result.Result.Categories.MaxNoOfPlayers = category_result.Result.MaxNoOfPlayers;

                e_result.Result.Categories.MainPicGoogleMap = category_result.Result.MainPicGoogleMap;

                var experience_result = _experienceRepository.GetExperienceById(e_result.Result.ExperienceId);

                e_result.Result.Experiences = new Experience();

                e_result.Result.ExperienceId = experience_result.Result.Id;

                e_result.Result.Experiences.ExperienceType = experience_result.Result.ExperienceType;

                /**
                 * Step 5: Return the  event result
                 */


                return e_result;


            }
            catch (Exception ex)
            {
                // log or manage the exception
                throw ex;
            }
        }
        public void AddEvent(Events ev)
        {
            try
            {
                _context.Events.InsertOne(ev);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<User> GetAllUsersForEvent(string id)
        {

            try
            {
                var filter = Builders<Events>.Filter.Eq("Id", id);

                var e_result = _context.Events.Find(filter).FirstOrDefaultAsync();

                List<User> userList = new List<User>();

                
                string userId = null;

                foreach (string loopUsers in e_result.Result.UserIds)
                {
                    User user = new User();
                    userId = loopUsers;

                    var user_result = _userRepository.GetById(userId);

                    user.Id = user_result.Id;
                    user.FirstName = user_result.FirstName;
                    user.LastName = user_result.LastName;
                    user.Username = user_result.Username;
                    user.Avatar = user_result.Avatar;
                    user.UserEvents = user_result.UserEvents;
                    userList.Add(user);

                    if (userList == null)
                    {
                        return userList = new List<User>();
                    }
               
                }

                return userList;


             
            }
            catch(Exception ex)
            {
               throw ex;
            }
         

           



           



        }
    }
}





