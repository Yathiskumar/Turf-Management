using database.Controllers;
using database.Model;
using database.Service;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;

namespace database.Tests
{
    public class TurfControllerTests
    {
        private Mock<ITurfService> _turfServiceMock;
        private TurfController _turfController;

        [SetUp]
        public void Setup()
        {
            _turfServiceMock = new Mock<ITurfService>();
            _turfController = new TurfController(_turfServiceMock.Object);
        }

        //[Test]
        //public void Get_ReturnsTurfListWithOkResult()
        //{
        //    var mockTurfs = new List<Turf> { new Turf { TurfId = new Guid(), Name = "Sample Turf" } };
        //    _turfServiceMock.Setup(service => service.GetTurfList()).Returns(mockTurfs);

        //    var result = _turfController.Get() as OkObjectResult;
        //    Assert.IsNotNull(result);
        //    Assert.That(result.StatusCode, Is.EqualTo(200));
        //}

        [Test]
        public void GetUsers_ReturnsUserListWithOkResult()
        {
            var mockUsers = new List<User>
                {
                    new User { Id = new Guid(), Name = "User1" },
                    new User { Id = new Guid(), Name = "User2" }
                };
            _turfServiceMock.Setup(service => service.GetUsers()).Returns(mockUsers);

            var result = _turfController.GetUsers() as OkObjectResult;
            Assert.IsNotNull(result);
            Assert.That(result.StatusCode, Is.EqualTo(200));
        }

        //[Test]
        //public void CreateTurf_ReturnsOkWhenTurfIsCreated()
        //{
        //    var newTurf = new Turf {  Name = "New Turf" };
        //    _turfServiceMock.Setup(service => service.CreateTurf(newTurf)).Returns(true);

        //    var result = _turfController.CreateTurf(newTurf) as OkObjectResult;
        //    Assert.IsNotNull(result);
        //    Assert.That(result.StatusCode, Is.EqualTo(200));
        //}

        [Test]
        public void Delete_ReturnsOkWhenTurfIsDeleted()
        {
            Guid turfId = new Guid();
            _turfServiceMock.Setup(service => service.DeleteTurf(turfId)).Returns(true);

            var result = _turfController.Delete(turfId) as OkObjectResult;
            Assert.IsNotNull(result);
            Assert.That(result.StatusCode, Is.EqualTo(200));
        }

        [Test]
        public void UpdateTurf_ReturnsOkWhenTurfIsUpdated()
        {
            var updatedTurf = new UpdateTurf { TurfId = new Guid(), Name = "Updated Turf" };
            _turfServiceMock.Setup(service => service.UpdateTurfs(updatedTurf)).Returns(true);

            var result = _turfController.UpdateTurf(updatedTurf) as OkObjectResult;
            Assert.IsNotNull(result);
            Assert.That(result.StatusCode, Is.EqualTo(200));
        }

        [Test]
        public void GetBookedSlots_ReturnsOkWithBookedSlots()
        {
            var date = DateTime.Today;
            var turfId = new Guid();
            var bookedSlots = new List<DateTime> { date.AddHours(10) };
            _turfServiceMock.Setup(service => service.FetchBookedSlots(turfId, date)).Returns(bookedSlots);

            var result = _turfController.GetBookedSlots(turfId, date) as OkObjectResult;
            Assert.IsNotNull(result);
            Assert.That(result.StatusCode, Is.EqualTo(200));
        }

        [Test]
        public void DeleteUser_ReturnsOkWhenUserIsDeleted()
        {
            Guid userId = new Guid();
            _turfServiceMock.Setup(service => service.DeleteUser(userId)).Returns(true);

            var result = _turfController.DeleteUser(userId) as OkObjectResult;
            Assert.IsNotNull(result);
            Assert.That(result.StatusCode, Is.EqualTo(200));
        }

        [Test]
        public void Maintenance_ReturnsOkWhenMaintenanceSlotIsLocked()
        {
            Guid turfId = new Guid();
            var bookingHistory = new BookingHistory
            {
                TurfId = turfId,
                UserId = new Guid(),
                SlotDateTime = DateTime.Now
            };
            _turfServiceMock.Setup(service => service.Maintenance(bookingHistory)).Returns(true);

            var result = _turfController.Maintenance(turfId, bookingHistory) as OkObjectResult;
            Assert.IsNotNull(result);
            Assert.That(result.StatusCode, Is.EqualTo(200));
        }

        [Test]
        public void UpdateTurf_ShouldReturnBadRequest_WhenUpdateFails()
        {
            var updateTurf = new UpdateTurf { TurfId = Guid.NewGuid(), Name = "Failed Update" };
            _turfServiceMock.Setup(service => service.UpdateTurfs(updateTurf)).Returns(false);

            var result = _turfController.UpdateTurf(updateTurf) as BadRequestObjectResult;

            Assert.NotNull(result);
            Assert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public void Delete_ShouldReturnOk_WhenDeleteIsSuccessful()
        {
            var turfId = Guid.NewGuid();
            _turfServiceMock.Setup(service => service.DeleteTurf(turfId)).Returns(true);

            var result = _turfController.Delete(turfId) as OkObjectResult;

            Assert.NotNull(result);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public void Delete_ShouldReturnNotFound_WhenDeleteFails()
        {
            var turfId = Guid.NewGuid();
            _turfServiceMock.Setup(service => service.DeleteTurf(turfId)).Returns(false);

            var result = _turfController.Delete(turfId) as NotFoundObjectResult;

            Assert.NotNull(result);
            Assert.AreEqual(404, result.StatusCode);
        }

   

        [Test]
        public void DeleteUser_ShouldReturnOk_WhenDeleteIsSuccessful()
        {
            var userId = Guid.NewGuid();
            _turfServiceMock.Setup(service => service.DeleteUser(userId)).Returns(true);

            var result = _turfController.DeleteUser(userId) as OkObjectResult;

            Assert.NotNull(result);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public void Maintenance_ShouldReturnBadRequest_WhenHistoryIsInvalid()
        {
            var turfId = Guid.NewGuid();

            var result = _turfController.Maintenance(turfId, null) as BadRequestObjectResult;

            Assert.NotNull(result);
            Assert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public void Maintenance_ShouldReturnOk_WhenMaintenanceIsSuccessful()
        {
            var turfId = Guid.NewGuid();
            var history = new BookingHistory
            {
                TurfId = turfId,
                SlotDateTime = DateTime.Now
            };
            _turfServiceMock.Setup(service => service.Maintenance(history)).Returns(true);

            var result = _turfController.Maintenance(turfId, history) as OkObjectResult;

            Assert.NotNull(result);
            Assert.AreEqual(200, result.StatusCode);
        }
    }
}
