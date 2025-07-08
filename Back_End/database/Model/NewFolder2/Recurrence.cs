using System.Diagnostics.CodeAnalysis;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace database.Model.NewFolder2
{
    [ExcludeFromCodeCoverage]
    public class Recurrence
    {
        [BsonId]
        [BsonGuidRepresentation(GuidRepresentation.CSharpLegacy)]
        public Guid Id { get; set; }
        [BsonGuidRepresentation(GuidRepresentation.CSharpLegacy)]
        public Guid UserId { get; set; }
        public DateTime SlotDateTime { get; set; }
        [BsonGuidRepresentation(GuidRepresentation.CSharpLegacy)]
        public Guid TurfId { get; set; }
        public List<string> Slots { get; set; }
        public int week { get; set; } = 1;
    }
}
