using database.Model;
using database.Model.NewFolder2;
using database.Repository;
using database.Repsoitory;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace database.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepo _repo;
        private readonly ITurfRepo _turfrepo;
        private readonly ITurfService _turfService;
        private readonly Password _password;
        private readonly IConfiguration _configuration;
        private IUserRepo object1;
        private ITurfRepo object2;
        private ITurfService object3;
        
        public UserService(IUserRepo repo, ITurfRepo turfRepo, ITurfService turfService, Password password, IConfiguration configuration)
        {
            _repo = repo;
            _turfrepo = turfRepo;
            _turfService = turfService;
            _password = password;
            _configuration = configuration;
        }

        public UserService(IUserRepo object1, ITurfRepo object2, ITurfService object3)
        {
            this.object1 = object1;
            this.object2 = object2;
            this.object3 = object3;
        }

        public string? Login(string emailOrPhone, string password)
        {
            var existingUser = _repo.GetUserByEmail(emailOrPhone);

            if (existingUser != null)
            {
                if (existingUser.Password == CreatePasswordHash(password))
                {
                    return CreateToken(existingUser.Id.ToString(), existingUser.UserClass);
                }
            }
            return null;
        }

        public bool Register(RegisterDetails user)
        {
            try
            {
                var newUser = new User
                {
                    Email = user.Email,
                    Password = CreatePasswordHash(user.Password),
                    Name = user.Name,
                    UserClass = "User"
                };
                _repo.CreateUser(newUser);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public string CreatePasswordHash(string password)
        {
            string saltedpassword = password + _password.Salt;

            using (var sha256 = SHA256.Create())
            {
                byte[] saltedPasswordBytes = Encoding.UTF8.GetBytes(saltedpassword);
                byte[] hashBytes = sha256.ComputeHash(saltedPasswordBytes);
                return Convert.ToBase64String(hashBytes);
            }
        }
        private string CreateToken(string id, string role)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Aud, "JwtAudience"),
                new Claim(JwtRegisteredClaimNames.Iss,"JwtIssuer"),
                new Claim(JwtRegisteredClaimNames.Sub, id)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(5),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public bool BookHistory(BookingHistory history,string userId,Guid turfId)
        {
            var turf = _turfrepo.GetTurfById(turfId);
            try
            {
                var booking = new BookingHistory
                {
                    UserId = Guid.Parse(userId),
                    TurfId = turfId,
                    SlotDateTime = history.SlotDateTime,
                    Slots = history.Slots,
                    TurfName = turf.Name
                };
                _repo.AddBookingHistory(booking);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public List<Turf> GetTurfList()
        {
            return _turfrepo.GetTurfList();
        }
        public List<BookingHistory> GetBookingHistory(Guid userId)
        {
            return _repo.GetBookingHistoryByUserId(userId);
        }
        public bool DeleteTurf(Guid turfId, Guid userId)
        {
            try
            {
                _repo.DeleteTurf(turfId, userId);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public bool AddFeedback(Feedback feedback,Guid turfId)
        {
            try
            {
                _turfrepo.AddFeedback(feedback,turfId);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public decimal CancelBooking(Guid bookingId)
        {
            var booking = _turfrepo.GetBookingById(bookingId);
            var turf = _turfrepo.GetTurfById(booking.TurfId);
            //decimal refundAmount = turf.Price - turf.Price * 0.10m;
            decimal refundAmount = 12;
            _turfrepo.DeleteBooking(bookingId.ToString());
            return refundAmount;
        }

        public bool RescheduleBooking(Guid bookingId, DateTime newSlotDateTime)
        {
            try
            {
                // Get booking using the repository
                var booking = _turfrepo.GetBookingById(bookingId);
                Console.WriteLine(booking);
                if (booking == null)
                {
                    throw new Exception($"No booking found with ID {bookingId}");
                }

                if (newSlotDateTime < DateTime.Now)
                {
                    throw new Exception("New slot datetime must be in the future.");
                }

                // Update the booking's SlotDateTime
                booking.SlotDateTime = newSlotDateTime;

                // Use the repository to update the booking in the database
                _repo.UpdateBooking(booking);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        public bool BookRecurringSlots(Guid turfId, Recurrence history)
        {
            try
            {
                var currentSlotDate = history.SlotDateTime;
                int weeksToBook = history.week;
                var requestedSlots = new List<(DateTime SlotDate, string SlotTime)>();

               

                for (int i = 0; i < weeksToBook; i++)
                {
                    requestedSlots.Add((currentSlotDate, history.Slots.First()));
                    currentSlotDate = currentSlotDate.AddDays(7);
                    //Console.WriteLine(requestedSlots.Count());
                }



                //foreach (var slotRequest in requestedSlots)
                //{
                //    if (!_turfService.CheckSlotAvailability(turfId, slotRequest.SlotDate, slotRequest.SlotTime))
                //    {
                //        throw new Exception($"Slot {slotRequest.SlotTime} on {slotRequest.SlotDate:yyyy-MM-dd} is unavailable. Recurring booking failed.");
                //    }
                //}
                Console.WriteLine(requestedSlots.Count());
                foreach (var slotRequest in requestedSlots)
                {
                    var newBooking = new BookingHistory
                    {
                        TurfId = turfId,
                        UserId = history.UserId,
                        SlotDateTime = slotRequest.SlotDate,
                        Slots = new List<string> { slotRequest.SlotTime }
                    };
                    Console.WriteLine("jhj");
                    _repo.AddBookingHistory(newBooking);
                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }



        public Turf ShowHisTurf(Guid userId, Guid turfId)
        {
            return _repo.ShowHisTurf(turfId, userId);
        }

        public List<string> FreeSlots(Guid TurfId, DateTime slot)
        {
            var summa = _repo.Freeslots(TurfId, slot);

            var data = _turfrepo.GetTurfById(TurfId).Slots;
            if (summa == null)
                return data;

            foreach(BookingHistory s in summa)
            {
                foreach(string str in s.Slots)
                    data.Remove(str);
            }

            //var slots = summa.Slots;
            return data;
        }

        public void EditDetails(string userid , EditDetails detail)
        {
            _repo.Edit(userid, detail);

        }
        }
    }

