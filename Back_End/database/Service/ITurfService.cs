using database.Model;
using database.Model.NewFolder2;

namespace database.Service
{
    public interface ITurfService
    {
        List<Turf> GetTurfList();
        List<User> GetUsers();
        bool CreateTurf(GetTurf turf, string userid);
        bool DeleteTurf(Guid turfId);
        bool UpdateTurfs(UpdateTurf turf);
        List<DateTime> FetchBookedSlots(Guid turfId, DateTime date);
        List<Feedback> GetFeedbacksForTurf(Guid turfId);
        bool DeleteUser(Guid userId);
        bool CheckSlotAvailability(Guid turfId, DateTime date, string requestedSlots);
        bool Maintenance(BookingHistory history);
        string GetUserById(Guid Id);
        User GetU(Guid Id);

    }
}
