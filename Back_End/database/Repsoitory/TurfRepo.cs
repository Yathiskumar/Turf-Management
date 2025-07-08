using System.Diagnostics.CodeAnalysis;
using database.Model;
using database.Model.NewFolder2;
using database.Repository;
using MongoDB.Bson;
using MongoDB.Driver;
using Pipelines.Sockets.Unofficial.Arenas;

namespace database.Repsoitory
{
    [ExcludeFromCodeCoverage]
    public class TurfRepo : ITurfRepo
    {

        private readonly string _imageDirectory = @"C:\Users\YathiskumarDhayalan\OneDrive - Integrate\Desktop\images";
        private readonly IMongoCollection<Turf> collection;
        private readonly IMongoCollection<User> users;
        private readonly IMongoCollection<BookingHistory> bookings;
        private readonly IMongoCollection<Feedback> feedbackCollection;
        private readonly IConfiguration configuration;
        public TurfRepo(IConfiguration config)
        {
            configuration = config;
            var mongoConnectionString = configuration.GetConnectionString("MongoDbConnection");
            var client = new MongoClient(mongoConnectionString);
            var db = client.GetDatabase("admin");
            collection = db.GetCollection<Turf>("TurfDetails");
            users = db.GetCollection<User>("UserDetails");
            bookings = db.GetCollection<BookingHistory>("BookingHistory");
            feedbackCollection = db.GetCollection<Feedback>("Feedback");
            this.configuration = configuration;
        }
        public void CreateTurf(Turf turf, IFormFile image)
        {
            string path = SaveImageToLocalFolderAsync(image); // Await the async method
            Console.WriteLine(path);

            turf.image_path = path;
            collection.InsertOne(turf);
        }



        private string SaveImageToLocalFolderAsync(IFormFile imageFile)
        {
            //try
            //{

            //    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
            //    var filePath = Path.Combine(_imageDirectory, fileName);

            //    if (!Directory.Exists(_imageDirectory))
            //    {
            //        Directory.CreateDirectory(_imageDirectory);
            //    }

            //    using (var fileStream = new FileStream(filePath, FileMode.Create))
            //    {
            //        imageFile.CopyTo(fileStream);
            //    }

            //    return "/images/" + fileName; 
            //}
            //catch (Exception ex)
            //{
            //    Console.WriteLine($"Error saving image: {ex.Message}");
            //    return "";
            //}

            byte[] data;
            using (var memorystream = new MemoryStream())
            {
                imageFile.CopyTo(memorystream);
                data = memorystream.ToArray();
            }

            var bson = new BsonBinaryData(data, BsonBinarySubType.Binary);

            string base64String = Convert.ToBase64String(bson.Bytes);

            return base64String;
        }



        public void DeleteTurf(Guid turfId)
        {
            var filter = Builders<Turf>.Filter.Eq(t => t.TurfId, turfId);
            collection.DeleteOne(filter);
        }
        public void UpdateTurf(UpdateTurf updateTurf)
        {
            var filter = Builders<Turf>.Filter.Eq(t => t.TurfId, updateTurf.TurfId);

            var updateBuilder = Builders<Turf>.Update;

            var update = new List<UpdateDefinition<Turf>>();

            if (updateTurf.Name != null)
                update.Add(updateBuilder.Set(t => t.Name, updateTurf.Name));
            if (updateTurf.Location != null)
                update.Add(updateBuilder.Set(t => t.Location, updateTurf.Location));
            if (updateTurf.Sports != null)
                update.Add(updateBuilder.Set(t => t.Sports, updateTurf.Sports));
            if (updateTurf.MaxMembers.HasValue)
                update.Add(updateBuilder.Set(t => t.MaxMembers, updateTurf.MaxMembers.Value));
            if (updateTurf.ContactNumber != null)
                update.Add(updateBuilder.Set(t => t.ContactNumber, updateTurf.ContactNumber));
            if (updateTurf.Rating.HasValue)
                update.Add(updateBuilder.Set(t => t.Rating, updateTurf.Rating.Value));
            if (updateTurf.Slots != null)
                update.Add(updateBuilder.Set(t => t.Slots, updateTurf.Slots));
            if (updateTurf.Price.HasValue)
                update.Add(updateBuilder.Set(t => t.Price, updateTurf.Price.Value));
            if (updateTurf.OwnerId != null)
                update.Add(updateBuilder.Set(t => t.OwnerId, updateTurf.OwnerId.Value));
            if (updateTurf.description != null)
                update.Add(updateBuilder.Set(t => t.description, updateTurf.description));
            collection.UpdateOne(filter, Builders<Turf>.Update.Combine(update));
        }
        public List<Turf> GetTurfList()
        {
            return collection.Find(_ => true).ToList();
        }
        public List<User> GetUsers()
        {
            return users.Find(_ => true).ToList();
        }
        public List<Feedback> GetFeedbacksForTurf(Guid turfId)
        {
            var filter = Builders<Feedback>.Filter.Eq(f => f.TurfId, turfId);
            var feedbacks = feedbackCollection.Find(filter).ToList();
            return feedbacks;
        }
        public void AddFeedback(Feedback feedback, Guid turfId)
        {
            feedback.TurfId = turfId;
            feedbackCollection.InsertOne(feedback);
        }
        public bool DeleteBooking(string bookingId)
        {
            var filter = Builders<BookingHistory>.Filter.Eq(b => b.Id, new Guid(bookingId));
            var result = bookings.DeleteOne(filter);
            return result.DeletedCount > 0;
        }
        public BookingHistory GetBookingById(Guid bookingId)
        {
            var filter = Builders<BookingHistory>.Filter.Eq(b => b.Id, bookingId);
            return bookings.Find(filter).FirstOrDefault();
        }

        public Turf GetTurfById(Guid turfId)
        {
            var filter = Builders<Turf>.Filter.Eq(t => t.TurfId, turfId);
            return collection.Find(filter).FirstOrDefault();
        }
        public void DeleteUser(Guid userId)
        {
            var user = Builders<User>.Filter.Eq(b => b.Id, userId);
            users.DeleteOne(user);
        }
        public List<BookingHistory> GetBookedSlots(Guid turfId, DateTime date)
        {
            var filter = Builders<BookingHistory>.Filter.And(
                Builders<BookingHistory>.Filter.Eq(b => b.TurfId, turfId),
                Builders<BookingHistory>.Filter.Gte(b => b.SlotDateTime, date.Date),
                Builders<BookingHistory>.Filter.Lt(b => b.SlotDateTime, date.Date.AddDays(1))
            );
            return bookings.Find(filter).ToList();
        }
        public void MaintenanceLock(BookingHistory history)
        {
            bookings.InsertOne(history);
        }

        public string GetUserById(Guid Id)
        {
            var user = Builders<User>.Filter.Eq(b => b.Id, Id);
            var us = users.Find(user).FirstOrDefault();
            return us.Name;
        }

        public User GetUserDetails(Guid Id)
        {
            var filter = Builders<User>.Filter.Eq(b => b.Id, Id);

            try
            {
                var user = users.Find(filter).FirstOrDefault();
                if (user == null)
                {
                    Console.WriteLine($"No user found with Id: {Id}");
                }
                return user;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching user details: {ex.Message}");
                throw;
            }
        }

    }
}
