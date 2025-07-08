using database.Model;
using database.Model.NewFolder2;
using database.Repository;
using database.Repsoitory;
using MongoDB.Driver;

namespace database.Service
{
    public class TurfService : ITurfService
    {
        private readonly ITurfRepo _turfrepo;
        public TurfService(ITurfRepo turfrepo)
        {
            _turfrepo = turfrepo;
        }
        public List<Turf> GetTurfList()
        {
            return _turfrepo.GetTurfList();
        }
        public List<User> GetUsers()
        {
            return _turfrepo.GetUsers();
        }
        public bool CreateTurf(GetTurf turf,string userid)
        {
            if (turf == null) return false;
            try
            {
                _turfrepo.CreateTurf(new Turf
                {
                    ContactNumber = turf.ContactNumber,
                    Location = turf.Location,
                    Slots = turf.Slots,
                    MaxMembers = turf.MaxMembers,
                    Name = turf.Name,
                    Price = turf.Price,
                    Sports = turf.Sports,
                    OwnerId = Guid.Parse(userid),
                    description = turf.description
                }, turf.image);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public bool DeleteTurf(Guid turfId)
        {
            var turf = _turfrepo.GetTurfById(turfId);
            if (turf == null) return false;

            try
            {
                _turfrepo.DeleteTurf(turfId);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public bool UpdateTurfs(UpdateTurf turf)
        {
            if (turf == null) return false;
            try
            {
                _turfrepo.UpdateTurf(turf);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public List<DateTime> FetchBookedSlots(Guid turfId, DateTime date)
        {
            var bookingHistory = _turfrepo.GetBookedSlots(turfId, date);
            return bookingHistory.Select(b => b.SlotDateTime).ToList();
        }
        public List<Feedback> GetFeedbacksForTurf(Guid turfId)
        {
            return _turfrepo.GetFeedbacksForTurf(turfId);
        }
        public bool DeleteUser(Guid userId)
        {
            try
            {
                _turfrepo.DeleteUser(userId);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public bool CheckSlotAvailability(Guid turfId, DateTime date, string requestedSlots)
        {
            var turf = _turfrepo.GetTurfById(turfId);

            if (turf == null || turf.Slots == null || !turf.Slots.Any())
            {
                throw new Exception("Turf not found or no slots available.");
            }

            if (!turf.Slots.Contains(requestedSlots))
            {
                return false;
            }

            var bookedSlots = _turfrepo.GetBookedSlots(turfId, date)
                                        .SelectMany(b => b.Slots);

            return !bookedSlots.Contains(requestedSlots);
        }
        public bool Maintenance(BookingHistory history)
        {
            if (history == null) return false;

            try
            {
                _turfrepo.MaintenanceLock(history);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public string GetUserById(Guid Id)
        {
            return _turfrepo.GetUserById(Id);
        }
        public User GetU(Guid Id)
        {
            return _turfrepo.GetUserDetails(Id);
        }
    }
}
