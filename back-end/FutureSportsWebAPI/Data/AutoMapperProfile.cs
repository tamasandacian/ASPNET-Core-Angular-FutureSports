using FutureSportsWebAPI.Models;
using FutureSportsWebAPI.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;

namespace FutureSportsWebAPI.Data
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Events, EventViewModel>();
            CreateMap<EventViewModel, Events>();

            CreateMap<User, UserViewModel>();
            CreateMap<UserViewModel, User>();
        }
        
       
    }
}
