using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Diagnostics.CodeAnalysis;

namespace database.Model.NewFolder2
{
    [ExcludeFromCodeCoverage]
    public class GetTurf
    {
        public string Name { get; set; }
        public string Location { get; set; }
        public List<string> Sports { get; set; }
        public int? MaxMembers { get; set; }
        public string ContactNumber { get; set; }
        //public double? Rating { get; set; }
        public List<string> Slots { get; set; }
        public int Price { get; set; }
        //public string OwnerId { get; set; }
        public string description { get; set; }
        public IFormFile image { get; set; }
        //public string ImageBase64 { get; set; }
    }
}
