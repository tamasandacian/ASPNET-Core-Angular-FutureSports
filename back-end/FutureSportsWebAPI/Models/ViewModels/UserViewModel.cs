using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FutureSportsWebAPI.Models.ViewModels
{
    public class UserViewModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public bool CheckType { get; set; }
    }
}
