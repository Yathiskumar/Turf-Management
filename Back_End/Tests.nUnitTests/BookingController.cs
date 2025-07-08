using database.Controllers;
using database.Model;
using database.Service;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System;
using System.Security.Claims;

namespace database.Tests
{
    public class BHistoryTests
    {
        private Mock<IUserService> _userServiceMock;
        private BHistory _bHistoryController;

        [SetUp]
        public void Setup()
        {
            _userServiceMock = new Mock<IUserService>();
            _bHistoryController = new BHistory(_userServiceMock.Object);
        }

       
        [Test]
        public void CancelBooking_ReturnsOkWhenBookingIsCanceled()
        {
            Guid bookingId = new Guid();
            decimal refundAmount = 50.0m;
            _userServiceMock.Setup(service => service.CancelBooking(bookingId)).Returns(refundAmount);

            var result = _bHistoryController.CancelBooking(bookingId) as OkObjectResult;
            Assert.AreEqual(200, result.StatusCode);
        }
        [Test]
        public void BookRecurringSlots_ReturnsOkWhenSlotsAreBooked()
        {
            var recurrence = new Recurrence
            {
                SlotDateTime = DateTime.Now,
                week = 4
            };
            Guid turfId = new Guid();

            _userServiceMock.Setup(service => service.BookRecurringSlots(turfId, recurrence));

            var result = _bHistoryController.BookRecurringSlots(recurrence, turfId) as OkObjectResult;
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public void History_InvalidBooking_ReturnsBadRequest()
        {
            var result = _bHistoryController.History(null, Guid.NewGuid()) as BadRequestObjectResult;
            Assert.AreEqual(400, result?.StatusCode);
        }

       

        [Test]
        public void RescheduleBooking_InvalidDate_ReturnsBadRequest()
        {
            var result = _bHistoryController.RescheduleBooking(Guid.NewGuid(), default) as BadRequestObjectResult;
            Assert.AreEqual(400, result?.StatusCode);
        }

        [Test]
        public void RescheduleBooking_ValidDate_ReturnsOk()
        {
            var bookingId = Guid.NewGuid();
            var newSlotDateTime = DateTime.Now.AddDays(1);
            _userServiceMock.Setup(service => service.RescheduleBooking(bookingId, newSlotDateTime)).Returns(true);

            var result = _bHistoryController.RescheduleBooking(bookingId, newSlotDateTime) as OkObjectResult;

            Assert.AreEqual(200, result?.StatusCode);
        }

        [Test]
        public void BookRecurringSlots_NullRecurrence_ReturnsBadRequest()
        {
            var result = _bHistoryController.BookRecurringSlots(null, Guid.NewGuid()) as BadRequestObjectResult;
            Assert.AreEqual(400, result?.StatusCode);
        }

        [Test]
        public void BookRecurringSlots_ValidRecurrence_ReturnsOk()
        {
            var recurrence = new Recurrence();
            var turfId = Guid.NewGuid();

            var result = _bHistoryController.BookRecurringSlots(recurrence, turfId) as OkObjectResult;

            _userServiceMock.Verify(service => service.BookRecurringSlots(turfId, recurrence), Times.Once);
            Assert.AreEqual(200, result?.StatusCode);
        }
    }
}
