using database.Model.NewFolder2;
using database.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace database.Controllers
{
    //[Authorize(policy: "Admin")]
    [Route("api/turf")]
    [ApiController]
    public class TurfController : ControllerBase
    {
        private readonly ITurfService _turfService;

        public TurfController(ITurfService turfService)
        {
            _turfService = turfService;
        }
        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            var users = _turfService.GetUsers();
            return Ok(new { message = "User list retrieved successfully", users });
        }

        [HttpPut("update")]
        public IActionResult UpdateTurf([FromBody] UpdateTurf turf)
        {
            var result = _turfService.UpdateTurfs(turf);
            if (result)
            {
                return Ok(new { message = $"Turf with ID {turf.TurfId} has been updated successfully" });
            }
            return BadRequest(new { message = $"Failed to update turf with ID {turf.TurfId}" });
        }
        
        [HttpDelete("{turfId}")]
        public IActionResult Delete(Guid turfId)
        {
            var result = _turfService.DeleteTurf(turfId);
            if (result)
            {
                return Ok(new { message = "Turf deleted successfully" });
            }
            return NotFound(new { message = "Failed to delete turf or Turf not found" });
        }

        [HttpGet("slots/{turfId}")]
        public IActionResult GetBookedSlots(Guid turfId, DateTime date)
        {
            var bookedSlots = _turfService.FetchBookedSlots(turfId, date);
            return Ok(new { message = "Booked slots retrieved successfully", bookedSlots });
        }
 
        [HttpDelete("user/{userId}")]
        public IActionResult DeleteUser(Guid userId)
        {
            if (userId.ToString().IsNullOrEmpty())
                return BadRequest(new { message = "UserId cannot be Empty" });
            var result = _turfService.DeleteUser(userId);
            if (result)
            {
                return Ok(new { message = "User deleted successfully" });
            }
            return NotFound(new { message = "Failed to delete user or User not found" });
        }

        [HttpPost("maintenance/{turfId}")]
        public IActionResult Maintenance(Guid turfId, [FromBody] BookingHistory history)
        {
            if (history == null || history.SlotDateTime == default)
            {
                return BadRequest(new { message = "Invalid maintenance request." });
            }

            history.TurfId = turfId;
            history.UserId = new Guid();
            var result = _turfService.Maintenance(history);

            if (result)
            {
                return Ok(new { message = $"Maintenance slot locked for Turf ID: {turfId} at {history.SlotDateTime:HH:mm}" });
            }
            return BadRequest(new { message = "Failed to lock maintenance slot." });
        }
    }
}
