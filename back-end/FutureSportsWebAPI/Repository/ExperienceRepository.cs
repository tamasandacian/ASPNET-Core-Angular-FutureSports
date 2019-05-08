using FutureSportsWebAPI.Data;
using FutureSportsWebAPI.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FutureSportsWebAPI.Repository
{

    public interface IExperienceRepository
    {
        IEnumerable<Experience> GetAllExperiences();
        Task<Experience> GetExperienceById(string id);
    }
    public class ExperienceRepository: IExperienceRepository
    {
        private readonly MongoDbContext _context = null;

        public ExperienceRepository(IOptions<Settings> settings)
        {
            _context = new MongoDbContext(settings);
        }

  

        public IEnumerable<Experience> GetAllExperiences()
        {
            try
            {
                List<Experience> experienceList = new List<Experience>();

                var exp = (from data in _context.Experiences.Find(_ => true).ToEnumerable()
                                select new Experience
                                {
                                    Id = data.Id,
                                    ExperienceType = data.ExperienceType
                                }).ToList();



                exp.ForEach(x =>
                {
                    Experience ex = new Experience();
                    ex.Id = x.Id;
                    ex.ExperienceType = x.ExperienceType;
                    experienceList.Add(ex);
                });

                return exp;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public Task<Experience> GetExperienceById(string id)
        {
            // Filter is a query
            var filter = Builders<Experience>.Filter.Eq("Id", id);

            try
            {

                return _context.Experiences
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
