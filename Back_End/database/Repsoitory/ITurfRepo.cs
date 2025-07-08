using database.Model;
using database.Model.NewFolder2;

namespace database.Repository
{
    public interface ITurfRepo
    {
        void CreateTurf(Turf turf, IFormFile image);
        void DeleteTurf(Guid turfId);
        void UpdateTurf(UpdateTurf updateTurf);
        List<Turf> GetTurfList();
        Turf GetTurfById(Guid turfId);
        List<User> GetUsers();
        void DeleteUser(Guid userId);
        List<Feedback> GetFeedbacksForTurf(Guid turfId);
        void AddFeedback(Feedback feedback, Guid turfId);
        bool DeleteBooking(string bookingId);
        BookingHistory GetBookingById(Guid bookingId);
        List<BookingHistory> GetBookedSlots(Guid turfId, DateTime date);
        void MaintenanceLock(BookingHistory history);
        User GetUserDetails(Guid Id);
        string GetUserById(Guid Id);
    }
}
