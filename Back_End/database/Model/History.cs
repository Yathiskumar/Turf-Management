using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
[ExcludeFromCodeCoverage]
public class BookingHistory
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
    public string? TurfName { get; set; }
    public int week { get; set; } = 1;
}
