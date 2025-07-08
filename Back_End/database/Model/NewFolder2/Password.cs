using System.Diagnostics.CodeAnalysis;

namespace database.Model.NewFolder2
{
    [ExcludeFromCodeCoverage]
    public class Password
    {
        public string Salt { get; set; }
        public string HashingAlgorithm { get; set; }
    }
}
