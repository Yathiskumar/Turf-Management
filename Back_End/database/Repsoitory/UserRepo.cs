using System.Diagnostics.CodeAnalysis;
using database.Model;
using database.Model.NewFolder2;
using MongoDB.Driver;

namespace database.Repository
{
    [ExcludeFromCodeCoverage]
    public class UserRepo : IUserRepo
    {
        private readonly IMongoCollection<User> collection;
        private readonly IMongoCollection<BookingHistory> historycollection;
        private readonly IMongoCollection<Turf> turfcollection;
        private readonly IConfiguration configuration;
        public UserRepo(IConfiguration config)
        {
            configuration = config;
            var mongoConnectionString = configuration.GetConnectionString("MongoDbConnection");
            var client = new MongoClient(mongoConnectionString);
            var db = client.GetDatabase("admin");
            collection = db.GetCollection<User>("UserDetails");
            historycollection = db.GetCollection<BookingHistory>("BookingHistory");
            turfcollection = db.GetCollection<Turf>("TurfDetails");
            this.configuration = configuration;
        }
        public User GetUserByEmail(string email)
        {
            return collection.Find(user => user.Email == email).FirstOrDefault();
        }
        public void CreateUser(User user)
        {
            collection.InsertOne(user);
        }
        public void AddBookingHistory(BookingHistory booking)
        {
            historycollection.InsertOne(booking);
        }
        public List<BookingHistory> GetBookingHistoryByUserId(Guid userId)
        {
            var filter = Builders<BookingHistory>.Filter.Eq(b => b.UserId, userId);
            return historycollection.Find(filter).ToList();
        }
        public void DeleteTurf(Guid turfId, Guid userId)
        {
            var filter = Builders<Turf>.Filter.Eq(t => t.TurfId, turfId) & Builders<Turf>.Filter.Eq(t => t.OwnerId, userId);
            var result = turfcollection.DeleteOne(filter);
        }
        public Turf ShowHisTurf(Guid turfId, Guid userId)
        {
            var filter = Builders<Turf>.Filter.Eq(t => t.TurfId, turfId) & Builders<Turf>.Filter.Eq(t => t.OwnerId, userId);
            return turfcollection.Find(filter).FirstOrDefault();
        }

        public void UpdateBooking(BookingHistory booking)
        {
            var filter = Builders<BookingHistory>.Filter.Eq(b => b.Id, booking.Id);

            Console.WriteLine(booking.SlotDateTime);
            var update = Builders<BookingHistory>.Update.Set(b => b.SlotDateTime, booking.SlotDateTime);
            historycollection.UpdateOne(filter, update);
        }

        public List<BookingHistory> Freeslots(Guid TurfId , DateTime slotDate)
        {
            var filter = Builders<BookingHistory>.Filter.Eq(t => t.TurfId, TurfId) & Builders<BookingHistory>.Filter.Eq(t=>t.SlotDateTime,slotDate);
            return historycollection.Find(filter).ToList();
        }

        public void Edit(string userid , EditDetails detail)
        {
            var filter = Builders<User>.Filter.Eq(b => b.Id, Guid.Parse(userid));
            var updateBuilder = Builders<User>.Update;
            var update = new List<UpdateDefinition<User>>();
            if (detail.Name != null)
                update.Add(updateBuilder.Set(t => t.Name, detail.Name));
            if (detail.Email != null)
                update.Add(updateBuilder.Set(t => t.Email, detail.Email));
            collection.UpdateOne(filter, Builders<User>.Update.Combine(update));
        }

    }
}
