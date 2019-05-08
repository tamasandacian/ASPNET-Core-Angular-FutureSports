using FutureSportsWebAPI.Data;
using FutureSportsWebAPI.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace FutureSportsWebAPI.Repository
{

    public interface IUserRepository
    {
        User Authenticate(string name, string password);
        IEnumerable<User> GetAll();
        User GetById(string id);

        User GetByUsername(string username);
        // List<Events> GetAllEventsForEachUser(string id);
        void Create(User user, string password);
        bool Update(string id, User user);
        bool Delete(string id);
    }

    public class UserRepository : IUserRepository
    {
        private readonly MongoDbContext _context = null;
        // private readonly IEventRepository _eventRepository;
        public UserRepository(IOptions<Settings> settings)
        {
            _context = new MongoDbContext(settings);
            //_eventRepository = eventRepository;
        }
        public User Authenticate(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                return null;
            }

            var user = _context.Users.Find(x => x.Username == username).FirstOrDefault();

           
            //check if username exists
            if (user == null)
            {
                //return null;
                throw new ApplicationException("No user registered with the given credentials!");
            }
          
            //check if password is correct
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                throw new ApplicationException("Password not match for the registered user!");
            }

            //authentication successfull;
            return user;

        }

        public void Create(User user, string password)
        {
            //validation
            //bool flag = false;
            string avatar = null;

            if (string.IsNullOrWhiteSpace(password))
            {
                throw new ApplicationException("Password is required!");
            }


            //check if username exists in database
            if (_context.Users.AsQueryable().Any(x => x.Username == user.Username))
            {
                throw new ApplicationException("Username is already taken");
            }

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            if (user.CheckType == true)
            {
                avatar = "/assets/img/user/avatar/male.png";
                user.Avatar = avatar;
            }
            else
            {
                avatar = "/assets/img/user/avatar/female.png";
                user.Avatar = avatar;
            }

            user.IsAdmin = false;

            user.UserEvents = new List<string>();

            _context.Users.InsertOne(user);

        }

        public bool Delete(string id)
        {

            try
            {
                var user = _context.Users.DeleteOne(Builders<User>.Filter.Eq("Id", id));

                DeleteResult actionResult = user;
                return actionResult.DeletedCount > 0;

            }

            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<User> GetAll()
        {
            try
            {
                return _context.Users.Find(_ => true).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public User GetById(string id)
        {
            var filter = Builders<User>.Filter.Eq("Id", id);

            try
            {
                return _context.Users.Find(filter).FirstOrDefault();
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }



        public bool Update(string id, User user)
        {

            try
            {
                ReplaceOneResult actionResult = _context.Users.ReplaceOne(x => x.Id.Equals(id), user, new UpdateOptions { IsUpsert = true });
                return actionResult.IsAcknowledged && actionResult.ModifiedCount > 0;
            }

            catch (Exception ex)
            {
                throw ex;
            }

        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }

        public User GetByUsername(string username)
        {
            var filter = Builders<User>.Filter.Eq("Username", username);

            try
            {
                return _context.Users.Find(filter).FirstOrDefault();
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
