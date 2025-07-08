using database.Model;
using database.Repository;
using database.Repsoitory;
using database.Service;
using MongoDB.Bson;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;

namespace Tests.nUnitTests
{
    public class NUnitTestItem1
    {
        private Mock<IUserRepo> _repoMock;
        private IUserService _userService;
        private Mock<ITurfRepo> _turfrepoMock;
        private Mock<ITurfService> _turfServiceMock;

        [SetUp]
        public void Setup()
        {
            _repoMock = new Mock<IUserRepo>();
            _turfrepoMock = new Mock<ITurfRepo>();
            _turfServiceMock = new Mock<ITurfService>();
            _userService = new UserService(_repoMock.Object, _turfrepoMock.Object, _turfServiceMock.Object, null, null);
        }

        [Test]
        public void GetTurfList()
        {
            var expectedTurfs = new List<Turf>
            {
                new Turf { TurfId = new Guid(), Name = "Turf 1" },
                new Turf { TurfId = new Guid(), Name = "Turf 2" }
            };

            _turfrepoMock.Setup(repo => repo.GetTurfList()).Returns(expectedTurfs);

            var result = _userService.GetTurfList();

            Assert.IsNotNull(result);
            Assert.AreEqual(expectedTurfs.Count, result.Count);
            Assert.AreEqual(expectedTurfs[0].TurfId, result[0].TurfId);
            Assert.AreEqual(expectedTurfs[1].Name, result[1].Name);
        }

        [Test]
        public void GetBookingHistory()
        {
            Guid userId = new Guid();
            var expectedBookingHistory = new List<BookingHistory>
            {
                new BookingHistory { Id = Guid.Parse("886D5F04-7997-4FB3-8EC9-335D3EECD2C0"), UserId = userId, TurfId = new Guid(), SlotDateTime = DateTime.Now.AddHours(1) },
                new BookingHistory { Id = Guid.Parse("886D5F04-7997-4FB3-8EC9-335D3EECD2C0"), UserId = userId, TurfId = new Guid(), SlotDateTime = DateTime.Now.AddHours(2) }
            };

            _repoMock.Setup(repo => repo.GetBookingHistoryByUserId(userId)).Returns(expectedBookingHistory);

            var result = _userService.GetBookingHistory(userId);

            Assert.IsNotNull(result);
            Assert.AreEqual(expectedBookingHistory.Count, result.Count);
            Assert.That(result[0].Id.Equals(expectedBookingHistory[0].Id), "ID should match");
            Assert.AreEqual(expectedBookingHistory[1].SlotDateTime, result[1].SlotDateTime);
        }
        [Test]
        public void DeleteTurf()
        {
            Guid turfId = new Guid();
            Guid userId = new Guid();

            _repoMock.Setup(repo => repo.DeleteTurf(turfId, userId)).Verifiable();

            var result = _userService.DeleteTurf(turfId, userId);

            Assert.IsTrue(result);
            _repoMock.Verify();
        }
        [Test]
        public void CancelBooking()
        {
            Guid bookingId = new Guid();
            var booking = new BookingHistory { TurfId = new Guid() };
            var turf = new Turf { TurfId = new Guid(), Price = 100 };

            _turfrepoMock.Setup(repo => repo.GetBookingById(bookingId)).Returns(booking);
            _turfrepoMock.Setup(repo => repo.GetTurfById(booking.TurfId)).Returns(turf);

            var result = _userService.CancelBooking(bookingId);

            //Assert.AreEqual(90, result); 
            _turfrepoMock.Verify();
        }
        [Test]
        public void RescheduleBooking()
        {
            Guid bookingId = new Guid();
            DateTime newSlotDateTime = DateTime.Now.AddHours(2);
            var booking = new BookingHistory { Id = bookingId, SlotDateTime = DateTime.Now.AddHours(1) };

            _turfrepoMock.Setup(repo => repo.GetBookingById(bookingId)).Returns(booking);
            _repoMock.Setup(repo => repo.UpdateBooking(booking)).Verifiable();

            var result = _userService.RescheduleBooking(bookingId, newSlotDateTime);

            Assert.IsTrue(result);
            _repoMock.Verify();
        }
        [Test]
        public void BookRecurringSlots_ShouldReturnTrue_WhenSlotsAreAvailable()
        {
            Guid turfId = new Guid();
            var history = new Recurrence
            {
                UserId = new Guid(),
                SlotDateTime = DateTime.Now.AddDays(1),
                week = 3,
                Slots = new List<string> { "9-10" }
            };

            var requestedSlots = new List<(DateTime SlotDate, string SlotTime)>
            {
                (history.SlotDateTime, history.Slots[0]),
                (history.SlotDateTime.AddDays(7), history.Slots[0]),
                (history.SlotDateTime.AddDays(14), history.Slots[0])
            };

            foreach (var slotRequest in requestedSlots)
            {
                _turfServiceMock.Setup(service => service.CheckSlotAvailability(turfId, slotRequest.SlotDate, slotRequest.SlotTime)).Returns(true);
            }

            _repoMock.Setup(repo => repo.AddBookingHistory(It.IsAny<BookingHistory>())).Verifiable();

            var result = _userService.BookRecurringSlots(turfId, history);

            Assert.IsTrue(result);
            _repoMock.Verify();
        }

        [Test]
        public void BookRecurringSlots_ShouldReturnFalse_WhenSlotIsUnavailable()
        {
            Guid turfId = new Guid();
            var history = new Recurrence
            {
                UserId = new Guid(),
                SlotDateTime = DateTime.Now.AddDays(1),
                week = 3,
                Slots = new List<string> { "09:00-10:00" }
            };

            var requestedSlots = new List<(DateTime SlotDate, string SlotTime)>
            {
                (history.SlotDateTime, history.Slots[0]),
                (history.SlotDateTime.AddDays(7), history.Slots[0]),
                (history.SlotDateTime.AddDays(14), history.Slots[0])
            };

            _turfServiceMock.Setup(service => service.CheckSlotAvailability(turfId, requestedSlots[0].SlotDate, requestedSlots[0].SlotTime)).Returns(true);
            _turfServiceMock.Setup(service => service.CheckSlotAvailability(turfId, requestedSlots[1].SlotDate, requestedSlots[1].SlotTime)).Returns(false);

            var result = _userService.BookRecurringSlots(turfId, history);

            Assert.IsFalse(result);
        }
        //[Test]
        //public void BookHistory_ShouldReturnTrue_WhenBookingIsSuccessful()
        //{
        //    var history = new BookingHistory
        //    {
        //        UserId = new Guid(),
        //        TurfId = new Guid(),
        //        SlotDateTime = DateTime.Now.AddHours(1),
        //        Slots = new List<string> { "9-10" }
        //    };

        //    _repoMock.Setup(repo => repo.AddBookingHistory(It.IsAny<BookingHistory>())).Verifiable();

        //    var result = _userService.BookHistory(history);

        //    Assert.IsTrue(result);
        //    _repoMock.Verify();
        //}

    }
}
