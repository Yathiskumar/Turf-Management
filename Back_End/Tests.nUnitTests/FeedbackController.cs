using database.Controllers;
using database.Model;
using database.Service;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace database.Tests
{
    public class FeedbacksTests
    {
        private Mock<IUserService> _userServiceMock;
        private Mock<ITurfService> _turfServiceMock;
        private Feedbacks _feedbacksController;

        [SetUp]
        public void Setup()
        {
            _userServiceMock = new Mock<IUserService>();
            _turfServiceMock = new Mock<ITurfService>();
            _feedbacksController = new Feedbacks(_userServiceMock.Object, _turfServiceMock.Object);
        }

        [Test]
        public void AddFeedback_ReturnsOkWhenFeedbackIsAdded()
        {
            var feedback = new Feedback
            {
                FeedbackText = "Great experience!"
            };
            Guid TurfId = new Guid();
           var result = _feedbacksController.AddFeedback(feedback,TurfId) as OkObjectResult;
            Assert.AreEqual(200, result.StatusCode);
        }

        [Test]
        public void GetFeedbacksForTurf_ReturnsOkWithFeedbacks()
        {
            Guid turfId = new Guid();
            var mockFeedbacks = new List<Feedback>
            {
                new Feedback { TurfId = turfId, FeedbackText = "Nice turf!" },
                new Feedback { TurfId = turfId, FeedbackText = "Clean and well maintained." }
            };
            _turfServiceMock.Setup(service => service.GetFeedbacksForTurf(turfId)).Returns(mockFeedbacks);

            var result = _feedbacksController.GetFeedbacksForTurf(turfId) as OkObjectResult;
            Assert.AreEqual(200, result.StatusCode);
        }



        [Test]
        public void AddFeedback_NullFeedback_ReturnsBadRequest()
        {
            var result = _feedbacksController.AddFeedback(null, Guid.NewGuid()) as BadRequestObjectResult;
            Assert.AreEqual(400, result?.StatusCode);
        }

        [Test]
        public void AddFeedback_ValidFeedback_ReturnsOk()
        {
            var feedback = new Feedback { FeedbackText = "Great turf!" };
            var turfId = Guid.NewGuid();
            _feedbacksController.HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()) }));

            _turfServiceMock.Setup(service => service.GetUserById(It.IsAny<Guid>())).Returns("Test User");

            var result = _feedbacksController.AddFeedback(feedback, turfId) as OkObjectResult;

            _userServiceMock.Verify(service => service.AddFeedback(It.IsAny<Feedback>(), turfId), Times.Once);
            Assert.AreEqual(200, result?.StatusCode);
        }

        [Test]
        public void GetFeedbacksForTurf_NoFeedbacks_ReturnsOkWithMessage()
        {
            var turfId = Guid.NewGuid();
            _turfServiceMock.Setup(service => service.GetFeedbacksForTurf(turfId)).Returns(new List<Feedback>());

            var result = _feedbacksController.GetFeedbacksForTurf(turfId) as OkObjectResult;

            Assert.AreEqual(200, result?.StatusCode);
            Assert.AreEqual("No feedbacks found for this turf.", (result?.Value as dynamic)?.message);
        }

        [Test]
        public void GetFeedbacksForTurf_WithFeedbacks_ReturnsOk()
        {
            var turfId = Guid.NewGuid();
            var feedbacks = new List<Feedback>
        {
            new Feedback { FeedbackText = "Great turf!", UserId = Guid.NewGuid() },
            new Feedback { FeedbackText = "Excellent service!", UserId = Guid.NewGuid() }
        };

            _turfServiceMock.Setup(service => service.GetFeedbacksForTurf(turfId)).Returns(feedbacks);

            var result = _feedbacksController.GetFeedbacksForTurf(turfId) as OkObjectResult;

            Assert.AreEqual(200, result?.StatusCode);
            Assert.AreNotEqual(2, (result?.Value as dynamic)?.feedbacks.Count);
        }
    }
}
