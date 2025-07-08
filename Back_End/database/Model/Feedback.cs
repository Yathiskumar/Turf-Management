using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace database.Model
{
    public class Feedback
    {
        [BsonId]
        [BsonGuidRepresentation(GuidRepresentation.CSharpLegacy)]
        public Guid Id { get; set; }
        [BsonGuidRepresentation(GuidRepresentation.CSharpLegacy)]
        public Guid UserId { get; set; }
        [BsonGuidRepresentation(GuidRepresentation.CSharpLegacy)]
        public Guid TurfId { get; set; }
        public string FeedbackText { get; set; }
        public int? Rating { get; set; }
        public string? Name { get; set; }
    }
}
