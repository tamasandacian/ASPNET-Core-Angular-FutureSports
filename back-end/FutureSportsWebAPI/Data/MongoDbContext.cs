using FutureSportsWebAPI.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FutureSportsWebAPI.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database = null;

        public MongoDbContext(IOptions<Settings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);

            if (client != null)
            {
                _database = client.GetDatabase(settings.Value.Database);
            }
        }


        public IMongoCollection<Categories> Categories
        {
            get { return _database.GetCollection<Categories>("Categories"); }
        }

        public IMongoCollection<Experience> Experiences
        {
            get { return _database.GetCollection<Experience>("Experiences"); }
        }

        public IMongoCollection<Events> Events
        {
            get { return _database.GetCollection<Events>("Events"); }
        }

        public IMongoCollection<User> Users
        {
            get { return _database.GetCollection<User>("User"); }
        }


        // Admin Content
        public IMongoCollection<Page> Pages
        {
            get { return _database.GetCollection<Page>("Pages"); }
        }

        public IMongoCollection<Sidebar> Sidebar
        {
            get { return _database.GetCollection<Sidebar>("Sidebar"); }
        }

    }
}

