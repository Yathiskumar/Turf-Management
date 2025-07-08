using database.Model;
using database.Model.NewFolder2;

namespace database.Repository
{
    public interface IUserRepo
    {
        User GetUserByEmail(string email);
        void CreateUser(User user);
        void AddBookingHistory(BookingHistory booking);
        List<BookingHistory> GetBookingHistoryByUserId(Guid userId);
        void DeleteTurf(Guid turfId, Guid userId);
        Turf ShowHisTurf(Guid turfId, Guid userId);
        void UpdateBooking(BookingHistory booking);
        List<BookingHistory> Freeslots(Guid TurfId, DateTime slotDate);
        void Edit(string userid, EditDetails detail);
    }
}
