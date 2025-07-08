using System.Security.Claims;
using database.Model.NewFolder2;
using database.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace database.Controllers
{
    [Authorize]
    [Route("api/booking")]
    [ApiController]
    public class BHistory : ControllerBase
    {
        private readonly IUserService _userService;

        public BHistory(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("{turfId}")]
        public IActionResult History([FromBody] BookingHistory booking,Guid turfId)
        {
            if (booking == null || booking.SlotDateTime == default)
            {
                return BadRequest(new { message = "Invalid booking details." });
            }
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            _userService.BookHistory(booking,userId,turfId);
            return Ok(new { message = "Booking registered successfully." });
        }

        [HttpDelete("cancel/{bookingId}")]
        public IActionResult CancelBooking(Guid bookingId)
        {
            if (string.IsNullOrWhiteSpace(bookingId.ToString()))
            {
                return BadRequest(new { message = "Booking ID is required." });
            }

            decimal refundAmount = _userService.CancelBooking(bookingId);
            return Ok(new { message = $"Booking with ID {bookingId} has been canceled.", refundAmount });
        }

        [HttpPatch("reschedule/{bookingId}")]
        public IActionResult RescheduleBooking(Guid bookingId, [FromQuery] DateTime newSlotDateTime)
        {
            // Validate that the new slot date is not in the past
            if (newSlotDateTime == default)
            {
                return BadRequest(new { message = "Invalid new slot date and time." });
            }

            try
            {
                bool rescheduled = _userService.RescheduleBooking(bookingId, newSlotDateTime);

                if (rescheduled)
                {
                    return Ok(new { message = $"Booking with ID {bookingId} has been rescheduled to {newSlotDateTime}." });
                }
                else
                {
                    return BadRequest(new { message = "Failed to reschedule the booking. Please ensure the new slot is in the future." });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error: {ex.Message}" });
            }
        }


        [HttpPost("book-recurring-slots/{turfId}")]
        public IActionResult BookRecurringSlots([FromBody] Recurrence history, Guid turfId)
        {
            if (history == null)
            {
                return BadRequest(new { message = "Invalid recurrence or turf ID." });
            }

            try
            {
                _userService.BookRecurringSlots(turfId, history);
                return Ok(new { message = "Slots successfully booked for all weeks." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
