using System.Diagnostics.CodeAnalysis;

namespace database.Model.NewFolder2
{
    [ExcludeFromCodeCoverage]
    public class SlotAvailabilityRequest
    {
        public DateTime Date { get; set; }
        public string RequestedSlot { get; set; }
    }
}
