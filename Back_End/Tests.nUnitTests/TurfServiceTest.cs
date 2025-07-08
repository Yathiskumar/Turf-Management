using database.Model;
using database.Model.NewFolder2;
using database.Repository;
using database.Repsoitory;
using database.Service;
using MongoDB.Driver.Linq;
using Moq;

namespace Tests.nUnitTests
{
    public class Tests
    {
        private Mock<ITurfRepo> _turfRepoMock;
        private Mock<IUserRepo> _userRepoMock;
        private TurfService _turfService;
        private UserService _userService;
        private Mock<ITurfService> _turfServiceMock;
        [SetUp]
        public void Setup()
        {
            _turfRepoMock = new Mock<ITurfRepo>();
            _userRepoMock = new Mock<IUserRepo>();
            _turfService = new TurfService(_turfRepoMock.Object);
            _turfServiceMock = new Mock<ITurfService>();
            _userService = new UserService(_userRepoMock.Object, _turfRepoMock.Object, _turfServiceMock.Object, null, null);
        }
        [Test]
        public void Delete_Turf_Positive()
        {
            Guid turfId = new Guid();
            _turfRepoMock.Setup(repo => repo.GetTurfById(turfId)).Returns(new Turf { TurfId = turfId });
            _turfRepoMock.Setup(repo => repo.DeleteTurf(turfId));
            var result = _turfService.DeleteTurf(turfId);
            Assert.IsTrue(result);
        }
        [Test]
        public void Delete_Turf_Negative()
        {
            Guid turfId = new Guid();
            _turfRepoMock.Setup(repo => repo.GetTurfById(turfId)).Returns(new Turf { TurfId = turfId });
            _turfRepoMock.Setup(repo => repo.DeleteTurf(turfId)).Throws(new Exception("Deletion failed"));

            var result = _turfService.DeleteTurf(turfId);

            Assert.IsFalse(result);
        }
        [Test]
        public void UpdateTurfs_Positive()
        {
            var turf = new UpdateTurf { TurfId = new Guid(), Name = "Updated Turf" };
            _turfRepoMock.Setup(repo => repo.UpdateTurf(turf));

            var result = _turfService.UpdateTurfs(turf);

            Assert.IsTrue(result);
        }
        [Test]
        public void UpdateTurfs_Negative()
        {
            var turf = new UpdateTurf { TurfId = new Guid(), Name = "Updated Turf" };
            _turfRepoMock.Setup(repo => repo.UpdateTurf(turf)).Throws(new Exception());

            var result = _turfService.UpdateTurfs(turf);

            Assert.IsFalse(result);
        }
        //[Test]
        //public void CreateTurf_Positive()
        //{
        //    var turf = new GetTurf {
        //        Name = "New Turf",
        //        Location = "Location1",
        //        Sports = new List<string> { "Football", "Cricket" },
        //        MaxMembers = 20,
        //        ContactNumber = "1234567890",
        //        Slots = new List<string> { "Morning", "Evening" },
        //        Price = 500,
        //        image = "image.jpg"
        //    };

        //    _turfRepoMock.Setup(repo => repo.CreateTurf(turf,image));

        //    var result = _turfService.CreateTurf(turf,image);

        //    Assert.IsTrue(result);
        //}
        [Test]
        public void Bookslots_fetching_correctly()
        {
            Guid TurfId = new Guid();
            DateTime dateTime = DateTime.Now;

            var bookingHistory = new List<BookingHistory>
            {
                new BookingHistory { SlotDateTime = dateTime.AddHours(1) },
                new BookingHistory { SlotDateTime = dateTime.AddHours(2) }
            };

            _turfRepoMock.Setup(repo => repo.GetBookedSlots(TurfId, dateTime.Date)).Returns(bookingHistory);

            var result = _turfService.FetchBookedSlots(TurfId, dateTime.Date);

            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count);
            Assert.AreEqual(dateTime.AddHours(1), result[0]);
            Assert.AreEqual(dateTime.AddHours(2), result[1]);
        }
        [Test]
        public void Bookslots_fetching_correctly2()
        {
            Guid TurfId = new Guid();
            DateTime dateTime = DateTime.Now;

            var bookingHistory = new List<BookingHistory>
            {
                new BookingHistory { SlotDateTime = dateTime.AddHours(1) },
                new BookingHistory { SlotDateTime = dateTime.AddDays(5) }
            };

            _turfRepoMock.Setup(repo => repo.GetBookedSlots(TurfId, dateTime.Date)).Returns(bookingHistory);

            var result = _turfService.FetchBookedSlots(TurfId, dateTime.Date);

            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count);
        }
        [Test]
        public void GetFeedbacksForTurf()
        {
            Guid turfId = new Guid();
            var feedbacks = new List<Feedback>
            {
                new Feedback { TurfId = turfId, Rating = 5, FeedbackText = "Great Turf!" },
                new Feedback { TurfId = turfId, Rating = 4, FeedbackText = "Good experience" }
            };

            _turfRepoMock.Setup(repo => repo.GetFeedbacksForTurf(turfId)).Returns(feedbacks);

            var result = _turfService.GetFeedbacksForTurf(turfId);

            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count);
            Assert.AreEqual(feedbacks[0].Rating, result[0].Rating);
            Assert.AreEqual(feedbacks[1].FeedbackText, result[1].FeedbackText);
        }
        [Test]
        public void Maintenance_True()
        {
            var history = new BookingHistory { UserId = new Guid(), TurfId = new Guid(), SlotDateTime = DateTime.Now, Slots = new List<string> {"10-11" } };
            _turfRepoMock.Setup(repo => repo.MaintenanceLock(history)).Verifiable();
            var result = _turfService.Maintenance(history);
            Assert.IsTrue(result);
            _turfRepoMock.Verify(repo => repo.MaintenanceLock(history), Times.Once);
        }
        [Test]
        public void Maintenance_False()
        {
            BookingHistory history = null;
            var result = _turfService.Maintenance(history);
            Assert.IsFalse(result);
        }
        [Test]
        public void DeleteUser()
        {
            Guid userId = new Guid();
            _turfRepoMock.Setup(repo => repo.DeleteUser(userId)).Verifiable();
            var result = _turfService.DeleteUser(userId);
            Assert.IsTrue(result);
            _turfRepoMock.Verify(repo => repo.DeleteUser(userId), Times.Once);
        }
        [Test]
        public void CheckSlotAvailability()
        {
            Guid turfId = new Guid();
            DateTime date = DateTime.Now;
            string requestedSlots = "10-11";

            var turf = new Turf
            {
                TurfId = turfId,
                Slots = new List<string> { "10-11", "11-12" }
            };

            var bookedSlots = new List<BookingHistory>
            {
                new BookingHistory { Slots = new List<string> { "11-12" } }
            };
            _turfRepoMock.Setup(repo => repo.GetTurfById(turfId)).Returns(turf);
            _turfRepoMock.Setup(repo => repo.GetBookedSlots(turfId, date)).Returns(bookedSlots);
            var result = _turfService.CheckSlotAvailability(turfId, date, requestedSlots);
            Assert.IsTrue(result);
        }
        [Test]
        public void GetTurfListAndUsers_ShouldReturnCorrectData()
        {
            var turfList = new List<Turf>
            {
                new Turf { TurfId = new Guid(), Name = "Turf 1" },
                new Turf { TurfId = new Guid(), Name = "Turf 2" }
            };

                    var userList = new List<User>
            {
                new User { Id = new Guid(), Name = "User 1" },
                new User { Id = new Guid(), Name = "User 2" }
            };

            _turfRepoMock.Setup(repo => repo.GetTurfList()).Returns(turfList);
            _turfRepoMock.Setup(repo => repo.GetUsers()).Returns(userList);

            var resultTurfList = _turfService.GetTurfList();
            var resultUserList = _turfService.GetUsers();

            Assert.IsNotNull(resultTurfList);
            Assert.AreEqual(2, resultTurfList.Count);
            Assert.AreEqual("Turf 1", resultTurfList[0].Name);
            Assert.AreEqual("Turf 2", resultTurfList[1].Name);

            Assert.IsNotNull(resultUserList);
            Assert.AreEqual(2, resultUserList.Count);
            Assert.AreEqual("User 1", resultUserList[0].Name);
            Assert.AreEqual("User 2", resultUserList[1].Name);
        }
        [Test]
        public void GetUserById_ValidId_ReturnsExpectedUserId()
        {

            var userId = Guid.NewGuid();
            var expectedUserId = "TestUserId";
            _turfRepoMock.Setup(repo => repo.GetUserById(userId)).Returns(expectedUserId);

            var result = _turfService.GetUserById(userId);

            Assert.AreEqual(expectedUserId, result);
            _turfRepoMock.Verify(repo => repo.GetUserById(userId), Times.Once);
        }

        [Test]
        public void GetU_ValidId_ReturnsExpectedUser()
        {
            var userId = Guid.NewGuid();
            var expectedUser = new User
            {
                Id = userId,
                Name = "Test User"
            };
            _turfRepoMock.Setup(repo => repo.GetUserDetails(userId)).Returns(expectedUser);

            var result = _turfService.GetU(userId);

 
            Assert.AreEqual(expectedUser, result);
            _turfRepoMock.Verify(repo => repo.GetUserDetails(userId), Times.Once);
        }

        [Test]
        public void Maintenance_ValidBookingHistory_ReturnsTrue()
        {
            var history = new BookingHistory();
            _turfRepoMock.Setup(repo => repo.MaintenanceLock(history));

            var result = _turfService.Maintenance(history);

            Assert.IsTrue(result);
            _turfRepoMock.Verify(repo => repo.MaintenanceLock(history), Times.Once);
        }

        [Test]
        public void Maintenance_NullBookingHistory_ReturnsFalse()
        {
            var result = _turfService.Maintenance(null);

            Assert.IsFalse(result);
            _turfRepoMock.Verify(repo => repo.MaintenanceLock(It.IsAny<BookingHistory>()), Times.Never);
        }

        [Test]
        public void Maintenance_ThrowsException_ReturnsFalse()
        {
            var history = new BookingHistory();
            _turfRepoMock.Setup(repo => repo.MaintenanceLock(history)).Throws(new Exception());

            var result = _turfService.Maintenance(history);

            Assert.IsFalse(result);
            _turfRepoMock.Verify(repo => repo.MaintenanceLock(history), Times.Once);
        }

        [Test]
        public void CheckSlotAvailability_TurfNotFound_ThrowsException()
        {
            var turfId = Guid.NewGuid();
            _turfRepoMock.Setup(repo => repo.GetTurfById(turfId)).Returns((Turf)null);

            Assert.Throws<Exception>(() => _turfService.CheckSlotAvailability(turfId, DateTime.Today, "9:00-10:00"));
        }

        [Test]
        public void CheckSlotAvailability_NoSlotsAvailable_ThrowsException()
        {
            var turfId = Guid.NewGuid();
            var turf = new Turf { Slots = null };
            _turfRepoMock.Setup(repo => repo.GetTurfById(turfId)).Returns(turf);

            Assert.Throws<Exception>(() => _turfService.CheckSlotAvailability(turfId, DateTime.Today, "9:00-10:00"));
        }

        [Test]
        public void CheckSlotAvailability_RequestedSlotNotInTurf_ReturnsFalse()
        {
            var turfId = Guid.NewGuid();
            var turf = new Turf { Slots = new List<string> { "10:00-11:00", "11:00-12:00" } };
            _turfRepoMock.Setup(repo => repo.GetTurfById(turfId)).Returns(turf);

            var result = _turfService.CheckSlotAvailability(turfId, DateTime.Today, "9:00-10:00");

            Assert.IsFalse(result);
        }

       


    }
};