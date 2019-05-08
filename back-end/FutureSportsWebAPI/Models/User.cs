using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FutureSportsWebAPI.Models
{
    public class User
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "The client name can not be empty")]
        [StringLength(15, MinimumLength = 5, ErrorMessage = "Client First Name field must have minimum 5 and maximum 15 character!")]
        public string FirstName { get; set; }
        public string LastName { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "The client username can not be empty")]
        [StringLength(10, MinimumLength = 5, ErrorMessage = "Client username must have minimum 5 and maximum 10 characters!")]
        public string Username { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        // Admin
        public bool IsAdmin { get; set; }

        public bool CheckType { get; set; }
        // User Avatar
        public string Avatar { get; set; }

        public List<string> UserEvents { get; set; }
    }
}
