using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FutureSportsWebAPI.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FutureSportsWebAPI.Controllers
{
    [Produces("application/json")]
    [Route("api/Experiences")]
    public class ExperiencesController : Controller
    {
        private readonly IExperienceRepository _experienceRepository;

        public ExperiencesController(IExperienceRepository experienceRepository)
        {
            _experienceRepository = experienceRepository;
        }

        [HttpGet]
        public IActionResult GetAllExperiences()
        {
            return GetExperiences();
        }

        private IActionResult GetExperiences()
        {
            var experiences = _experienceRepository.GetAllExperiences();
            return Json(experiences);
        }

        [HttpGet("[action]/{id}")]
        public IActionResult GetExperienceId(string id)
        {
            var result = _experienceRepository.GetExperienceById(id);
            return Json(result);
        }
    }
}