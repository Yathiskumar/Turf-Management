using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
[ExcludeFromCodeCoverage]
public class Turf
{
    [BsonId]
    [BsonGuidRepresentation(GuidRepresentation.CSharpLegacy)]
    public Guid TurfId { get; set; }
    public string Name { get; set; }
    public string Location { get; set; }
    public List<string> Sports { get; set; }
    public int? MaxMembers { get; set; }
    public string ContactNumber { get; set; }
    public double? Rating { get; set; }
    public List<string> Slots { get; set; }
    public string description { get; set; }
    public int Price { get; set; }
    [BsonGuidRepresentation(GuidRepresentation.CSharpLegacy)]
    public Guid OwnerId { get; set; }
    [BsonElement("image")]
    public string image_path { get; set; }
}
