using FutureSportsWebAPI.Data;
using FutureSportsWebAPI.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FutureSportsWebAPI.Repository
{

    public interface ICategoryRepository {
        IEnumerable<Categories> GetAllCAtegories();
        Task<Categories> GetCategoryById(string id);
    }

    public class CategoryRepository : ICategoryRepository
    {
        private readonly MongoDbContext _context = null;

        public CategoryRepository(IOptions<Settings> settings)
        {
            _context = new MongoDbContext(settings);

        }

        public IEnumerable<Categories> GetAllCAtegories()
        {
            try
            {
                List<Categories> categoryList = new List<Categories>();

              var category =  (from data in _context.Categories.Find(_ => true).ToEnumerable()
                        select new Categories
                                    {
                                        Id = data.Id,
                                        CategoryName = data.CategoryName,
                                        ImageCategory = data.ImageCategory,
                                        MaxNoOfPlayers = data.MaxNoOfPlayers,
                                        MainPicGoogleMap = data.MainPicGoogleMap
                        }).ToList();



                category.ForEach(x =>
                {
                    Categories c = new Categories();
                    c.Id = x.Id;
                    c.CategoryName = x.CategoryName;
                    c.ImageCategory = x.ImageCategory;
                    c.MaxNoOfPlayers = x.MaxNoOfPlayers;
                    c.MainPicGoogleMap = x.MainPicGoogleMap;
                    categoryList.Add(c);
                });

                return category;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public Task<Categories> GetCategoryById(string id)
        {
            // Filter is a query
            var filter = Builders<Categories>.Filter.Eq("Id", id);

            try
            {

                return _context.Categories
                           .Find(filter)
                           .FirstOrDefaultAsync();

            }
            catch (Exception ex)
            {
                // log or manage the exception
                throw ex;
            }
        }
    }
}
