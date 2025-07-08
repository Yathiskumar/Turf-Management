using database.Model;
using database.Model.NewFolder2;

namespace database.Service
{
    public interface IUserService
    {
        string? Login(string emailOrPhone, string password);
        bool Register(RegisterDetails user);
        bool BookHistory(BookingHistory history, string userId, Guid turfId);
        List<Turf> GetTurfList();
        List<BookingHistory> GetBookingHistory(Guid userId);
        bool DeleteTurf(Guid turfId, Guid userId);
        bool AddFeedback(Feedback feedback, Guid turfId);
        decimal CancelBooking(Guid bookingId);
        bool RescheduleBooking(Guid bookingId, DateTime newSlotDateTime);
        bool BookRecurringSlots(Guid turfId, Recurrence history);
        Turf ShowHisTurf(Guid userId, Guid turfId);
        List<string> FreeSlots(Guid TurfId, DateTime slot);
        void EditDetails(string userid, EditDetails detail);
    }
}
