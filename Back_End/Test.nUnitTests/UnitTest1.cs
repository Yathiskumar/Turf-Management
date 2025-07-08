using NUnit.Framework;
using Moq;
using MongoDB.Bson;
using System.Collections.Generic;
using database.Model;
using database.Repository;
using database.Service;
using System;
using database.Repsoitory;

namespace YourNamespace.Tests
{
    [TestFixture]
    public class UserServiceTests
    {
        private Mock<ITurfRepo> _mockTurfRepo;
        private Mock<IUserRepo> _mockUserRepo;
        private Mock<ITurfService> _mockTurfService;
        private UserService _userService;

        [SetUp]
        public void Setup()
        {
            // Create mocks for the dependencies
            _mockTurfRepo = new Mock<ITurfRepo>();
            _mockUserRepo = new Mock<IUserRepo>();
            _mockTurfService = new Mock<ITurfService>();

            // Instantiate UserService with the mocked dependencies
            _userService = new UserService(
                _mockUserRepo.Object, // UserRepo mock
                _mockTurfRepo.Object, // TurfRepo mock
                _mockTurfService.Object, // TurfService mock
                null, // Password mock (can be null for this test)
                null // Configuration mock (can be null for this test)
            );
        }

        [Test]
        public void GetTurfList_ShouldReturnListOfTurfs()
        {
            // Arrange
            var expectedTurfs = new List<Turf>
            {
                new Turf
                {
                    Id = ObjectId.GenerateNewId(),
                    TurfId = 1,
                    Name = "Turf 1",
                    Location = "Location 1",
                    Sports = new List<string> { "Football", "Cricket" },
                    MaxMembers = 20,
                    ContactNumber = "1234567890",
                    Rating = 4.5,
                    Slots = new List<string> { "10:00 AM", "02:00 PM" },
                    Price = 1000,
                    OwnerId = 1
                },
                new Turf
                {
                    Id = ObjectId.GenerateNewId(),
                    TurfId = 2,
                    Name = "Turf 2",
                    Location = "Location 2",
                    Sports = new List<string> { "Football" },
                    MaxMembers = 15,
                    ContactNumber = "0987654321",
                    Rating = 4.8,
                    Slots = new List<string> { "11:00 AM", "03:00 PM" },
                    Price = 1200,
                    OwnerId = 2
                }
            };

            // Set up the mock to return the expected turfs
            _mockTurfRepo.Setup(repo => repo.GetTurfList()).Returns(expectedTurfs);

            // Act
            var result = _userService.GetTurfList();

            // Assert
            Assert.IsNotNull(result); // Check that the result is not null
            Assert.AreEqual(expectedTurfs.Count, result.Count); // Verify the count matches
            Assert.AreEqual(expectedTurfs[0].TurfId, result[0].TurfId); // Verify TurfId for the first turf
            Assert.AreEqual(expectedTurfs[1].Name, result[1].Name); // Verify Name for the second turf

            // Verify that GetTurfList was called exactly once on the mock repository
            _mockTurfRepo.Verify(repo => repo.GetTurfList(), Times.Once);
        }
    }
}
