using api.Controllers;
using database.Model;
using database.Service;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;

namespace Tests
{
    [TestFixture]
    public class UserControllerTests
    {
        private UserController _controller;
        private Mock<IUserService> _userServiceMock;
        private Mock<ITurfService> _turfServiceMock;

        [SetUp]
        public void SetUp()
        {
            _userServiceMock = new Mock<IUserService>();
            _turfServiceMock = new Mock<ITurfService>();
            _controller = new UserController(_userServiceMock.Object, _turfServiceMock.Object);
        }

        [Test]
        public void Login_ValidCredentials_ReturnsOk()
        {
            var loginDetails = new LoginDetails { Email = "test@example.com", Password = "password" };
            _userServiceMock.Setup(x => x.Login(loginDetails.Email, loginDetails.Password))
                .Returns("someUserId");

            var result = _controller.Login(loginDetails) as OkObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
        }

 

        [Test]
        public void GetTurf_ReturnsOkWithTurfList()
        {
            _userServiceMock.Setup(x => x.GetTurfList())
                .Returns(new List<Turf>());

            var result = _controller.GetTurf() as OkObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
        }

        //[Test]
        //public void CreateTurf_ValidTurf_ReturnsOk()
        //{
        //    var turf = new Turf();
        //    _turfServiceMock.Setup(x => x.CreateTurf(turf)).Returns(true);

        //    var result = _controller.CreateTurf(turf) as OkObjectResult;

        //    Assert.IsNotNull(result);
        //    Assert.AreEqual(200, result.StatusCode);
        //}

        [Test]
        public void DeleteTurf_ValidIds_ReturnsOk()
        {
            _userServiceMock.Setup(x => x.DeleteTurf(new Guid(), new Guid())).Returns(true);

            var result = _controller.DeleteTurf(new Guid(), new Guid()) as OkObjectResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public void Login_ReturnsOkWhenCredentialsAreValid()
        {
            var loginDetails = new LoginDetails { Email = "test@example.com", Password = "password" };
            _userServiceMock.Setup(service => service.Login(loginDetails.Email, loginDetails.Password)).Returns("token");

            var result = _controller.Login(loginDetails) as OkObjectResult;

            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public void Login_ReturnsBadRequestWhenCredentialsAreInvalid()
        {
            var loginDetails = new LoginDetails { Email = "test@example.com", Password = "wrongpassword" };
            _userServiceMock.Setup(service => service.Login(loginDetails.Email, loginDetails.Password)).Returns((string)null);

            var result = _controller.Login(loginDetails) as BadRequestObjectResult;

            Assert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public void Register_ReturnsOkWhenUserIsValid()
        {
            var user = new RegisterDetails { Name = "Test User", Email = "test@example.com", Password = "password123" };
            _userServiceMock.Setup(service => service.Register(user)).Returns(true);

            var result = _controller.Register(user) as OkObjectResult;

            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public void Register_ReturnsBadRequestWhenEmailIsInvalid()
        {
            var user = new RegisterDetails { Name = "Test User", Email = "invalidemail", Password = "password123" };

            var result = _controller.Register(user) as BadRequestObjectResult;

            Assert.AreEqual(400, result.StatusCode);
        }

        [Test]
        public void GetTurf_ReturnsOiekWithTurfList()
        {
            var turfs = new List<Turf> { new Turf { Name = "Turf 1" }, new Turf { Name = "Turf 2" } };
            _userServiceMock.Setup(service => service.GetTurfList()).Returns(turfs);

            var result = _controller.GetTurf() as OkObjectResult;

            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public void GetBookingHistory_ReturnsOkWithBookingHistory()
        {
            var userId = Guid.NewGuid();
            var bookingHistory = new List<BookingHistory> { new BookingHistory { TurfName = "Turf 1" } };
            _userServiceMock.Setup(service => service.GetBookingHistory(userId)).Returns(bookingHistory);

            var result = _controller.GetBookingHistory(userId) as OkObjectResult;

            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public void CreateTurf_ReturnsOkWhenTurfIsCreated()
        {
            var turf = new GetTurf { Name = "Turf 1", Location = "Location 1", Sports = new List<string> { "Football" }, Slots = new List<string> { "Slot 1" }, ContactNumber = "1234567890", Price = 100 };
            _turfServiceMock.Setup(service => service.CreateTurf(turf, It.IsAny<string>())).Returns(true);

            var result = _controller.CreateTurf(turf) as OkObjectResult;

            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public void DeleteTurf_ReturnsOkWhenTurfIsDeleted()
        {
            var userId = Guid.NewGuid();
            var turfId = Guid.NewGuid();
            _userServiceMock.Setup(service => service.DeleteTurf(turfId, userId)).Returns(true);

            var result = _controller.DeleteTurf(userId, turfId) as OkObjectResult;

            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public void HisTurf_ReturnsOkWhenTurfIsRetrieved()
        {
            var request = new TurfRequest { UserId = Guid.NewGuid(), TurfId = Guid.NewGuid() };
            var turf = new Turf { Name = "Turf 1" };
            _userServiceMock.Setup(service => service.ShowHisTurf(request.UserId, request.TurfId)).Returns(turf);

            var result = _controller.HisTurf(request) as OkObjectResult;

            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public void FreeSlots_ReturnsOkWhenSlotIsAvailable()
        {
            var request = new SlotAvailabilityRequest { Date = DateTime.Now, RequestedSlot = "Slot 1" };
            var turfId = Guid.NewGuid();
            _turfServiceMock.Setup(service => service.CheckSlotAvailability(turfId, request.Date, request.RequestedSlot)).Returns(true);

            var result = _controller.FreeSlots(request, turfId) as OkObjectResult;

            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public void GetSlots_ReturnsOkWithAvailableSlots()
        {
            var turfid = Guid.NewGuid();
            var slot = DateTime.Now;
            var slots = new List<string> { "Slot 1", "Slot 2" };
            _userServiceMock.Setup(service => service.FreeSlots(turfid, slot)).Returns(slots);

            var result = _controller.GetSlots(turfid, slot) as OkObjectResult;

            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public void GetmyDetails_ReturnsOkWithUserDetails()
        {
            var userid = Guid.NewGuid();
            var user = new User { Name = "Test User" };
            _turfServiceMock.Setup(service => service.GetU(userid)).Returns(user);

            var result = _controller.GetmyDetails(userid) as OkObjectResult;

            Assert.AreEqual(200, result.StatusCode);
        }


    }
}
