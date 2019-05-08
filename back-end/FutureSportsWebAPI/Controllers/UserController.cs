using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using FutureSportsWebAPI.Data;
using FutureSportsWebAPI.Models;
using FutureSportsWebAPI.Models.ViewModels;
using FutureSportsWebAPI.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

namespace FutureSportsWebAPI.Controllers
{
    //[Authorize]
    [Produces("application/json")]
    [Route("api/User")]
    public class UserController : Controller
    {
        private readonly MongoDbContext _context = null;
        private readonly IUserRepository _userRepository;
        private readonly IEventRepository _eventRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IExperienceRepository _experienceRepository;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;

        public UserController(IOptions<Settings> settings, IUserRepository userRepository, IEventRepository eventRepository, ICategoryRepository categoryRepository, IExperienceRepository experienceRepository, IMapper mapper, IOptions<AppSettings> appSettings)
        {
            _context = new MongoDbContext(settings);
            _userRepository = userRepository;
            _eventRepository = eventRepository;
            _categoryRepository = categoryRepository;
            _experienceRepository = experienceRepository;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }


        [AllowAnonymous]
        //[HttpPost("authenticate")]
        [HttpPost]
        public IActionResult Authenticate([FromBody] UserViewModel userDTO)
        {

            try
            {
                var user = _userRepository.Authenticate(userDTO.Username, userDTO.Password);

                if (user == null)
                {
                    return Unauthorized();
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                     new Claim(ClaimTypes.Name, user.Id.ToString())
                    }),

                    Expires = DateTime.UtcNow.AddDays(7),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                // return basic user info (without password) and token to store client side

                return Ok(new
                {
                    Id = user.Id,
                    Username = user.Username,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Token = tokenString,
                    IsAdmin = user.IsAdmin,
                    Avatar = user.Avatar

                });
            }

            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }



        }

        [AllowAnonymous]
        [HttpPost("[action]")]

        public IActionResult Register([FromBody] UserViewModel userDTO)
        {

            // return validation error if required fields aren't filled in
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // map dto to entity
            var user = _mapper.Map<User>(userDTO);

            try
            {
                // save 
                _userRepository.Create(user, userDTO.Password);
            }
            catch (ApplicationException ex)
            {
                // return error message if there was an exception
                return BadRequest(ex.Message);
            }
            return Ok();
        }

        [HttpGet]
        public IActionResult GetAllUsers()
        {
            return GetUsers();
        }

        private IActionResult GetUsers()
        {
            var users = _userRepository.GetAll();
            //   var userDTOs = _mapper.Map<IList<UserViewModel>>(users);
            return Ok(users);
        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetUserById(string id)
        {
            var user = _userRepository.GetById(id);
            //   var userDTO = _mapper.Map<UserViewModel>(user);
            return Ok(user);
        }

        [HttpGet("[action]/{username}")]
        public IActionResult GetUserByUsername(string username)
        {
            try
            {
                var user = _userRepository.GetByUsername(username);
                return Ok(user);
            }

            catch (ApplicationException ex)
            {
                throw ex;
            }
           

        }


        [HttpGet("[action]/{username}")]
        public IActionResult GetAllEventsForEachUser(string username)
        {
            try
            {

                var filter = Builders<User>.Filter.Eq("Username", username);

                var u_result = _context.Users.Find(filter).FirstOrDefaultAsync();

                List<Events> eventList = new List<Events>();

                string eventId = null;

                foreach (string loopEvents in u_result.Result.UserEvents)
                {
                    Events ev = new Events();
                    eventId = loopEvents;

                    if (eventId == null)
                    {
                        throw new ApplicationException("User not enrolled in any events");
                    }

                    var event_result = _eventRepository.GetEvent(eventId);

                    ev.Id = eventId;
                    ev.Address = event_result.Result.Address;
                    ev.Start = event_result.Result.Start;
                    ev.End = event_result.Result.End;
                    ev.Date = event_result.Result.Date;
                    ev.MaxNoOfPlayers = event_result.Result.MaxNoOfPlayers;

                    var category_result = _categoryRepository.GetCategoryById(event_result.Result.CategoryId);
                    ev.Categories = new Categories();

                    ev.Categories.CategoryName = category_result.Result.CategoryName;
                    ev.Categories.ImageCategory = category_result.Result.ImageCategory;

                    var experience_result = _experienceRepository.GetExperienceById(event_result.Result.ExperienceId);
                    ev.Experiences = new Experience();

                    ev.Experiences.ExperienceType = experience_result.Result.ExperienceType;

                    eventList.Add(ev);

                }

                return Ok(eventList);


            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}