namespace database.Model
{
    using System.ComponentModel.DataAnnotations;
    using System.Diagnostics.CodeAnalysis;
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;
    [ExcludeFromCodeCoverage]
    public class User
    {
        [BsonGuidRepresentation(GuidRepresentation.CSharpLegacy)]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        //public string PhoneNumber { get; set; }
        public string UserClass { get; set; } 
    }
}
