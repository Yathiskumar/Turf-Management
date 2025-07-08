using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Diagnostics.CodeAnalysis;

namespace database.Model.NewFolder2
{
    [ExcludeFromCodeCoverage]
    public class TurfRequest
    {
        [BsonGuidRepresentation(GuidRepresentation.CSharpLegacy)]
        public Guid UserId { get; set; }
        [BsonGuidRepresentation(GuidRepresentation.CSharpLegacy)]
        public Guid TurfId { get; set; }
    }
}
