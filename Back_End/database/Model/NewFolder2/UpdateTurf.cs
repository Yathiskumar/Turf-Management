using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Diagnostics.CodeAnalysis;

namespace database.Model.NewFolder2
{
    [ExcludeFromCodeCoverage]
    public class UpdateTurf
    {
        [BsonGuidRepresentation(GuidRepresentation.CSharpLegacy)]
        public Guid TurfId { get; set; }
        public string? Name { get; set; }
        public string? Location { get; set; }
        public List<string>? Sports { get; set; }
        public int? MaxMembers { get; set; }
        public string? ContactNumber { get; set; }
        public double? Rating { get; set; }
        public List<string>? Slots { get; set; }
        public int? Price { get; set; }
        [BsonGuidRepresentation(GuidRepresentation.CSharpLegacy)]
        public Guid? OwnerId { get; set; }
        public string description { get; set; }
    }
}
