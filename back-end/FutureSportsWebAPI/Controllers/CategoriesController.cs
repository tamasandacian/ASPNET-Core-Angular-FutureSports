using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FutureSportsWebAPI.Models;
using FutureSportsWebAPI.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace FutureSportsWebAPI.Controllers
{
    [Produces("application/json")]
    [Route("api/Categories")]
    public class CategoriesController : Controller
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoriesController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        [HttpGet]
        public IActionResult GetAllCategories()
        {
            return GetCategories();
        }

      
        private IActionResult GetCategories()
        {
            var categories =  _categoryRepository.GetAllCAtegories();
            return Json(categories);
        }


        [HttpGet("[action]/{id}")]
        public IActionResult GetCategoryId(string id)
        {
            var result = _categoryRepository.GetCategoryById(id);
            return Json(result);
            
        }
    }
}