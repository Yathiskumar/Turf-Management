using System.Security.Claims;
using System.Text.RegularExpressions;
using database.Model.NewFolder2;
using database.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITurfService _turfService;

        public UserController(IUserService userService, ITurfService turfService)
        {
            _userService = userService;
            _turfService = turfService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDetails loginDto)
        {
            var user = _userService.Login(loginDto.Email, loginDto.Password);
            if (user != null)
            {
                return Ok(new { message = "Login successful", Token = user });
            }
            return BadRequest(new { message = "Invalid login credentials" });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDetails user)
        {
            var emailRegex = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            if (!Regex.IsMatch(user.Email, emailRegex))
            {
                return BadRequest(new { message = "Invalid email format" });
            }
            if (user.Name.IsNullOrEmpty())
            {
                return BadRequest(new { message = "Name should not be empty" });
            }
            if (user.Password.Length < 8)
            {
                return BadRequest(new { message = "Password Length must be greater than 8" });
            }
            _userService.Register(user);
            return Ok(new { message = "User registered successfully" });
        }

        [HttpGet("turf")]
        public IActionResult GetTurf()
        {
            var turfs = _userService.GetTurfList();
            return Ok(new { message = "Turf list retrieved", turfs });
        }

        [Authorize]
        [HttpGet("{userId}/history")]
        public IActionResult GetBookingHistory(Guid userId)
        {
            var bookingHistory = _userService.GetBookingHistory(userId);
            return Ok(new { message = "Booking history retrieved", bookingHistory });
        }

        [Authorize]
        [HttpPost("create-turf")]
        public IActionResult CreateTurf([FromForm] GetTurf turf)
        {
            string userid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // if (turf.image == null)
            // return BadRequest(new { message = "Turf image is not found!" });
            if (turf.Name.IsNullOrEmpty())
                return BadRequest(new { message = "Turf Should have Name" });
            if (turf.Sports.IsNullOrEmpty())
                return BadRequest(new { message = "Turf should have sports" });
            if (turf.Slots.IsNullOrEmpty())
                return BadRequest(new { message = "Turf should have slots to play" });
            if (turf.ContactNumber.IsNullOrEmpty())
                return BadRequest(new { message = "Turf should have phone number" });
            if (turf.Price.ToString().IsNullOrEmpty())
                return BadRequest(new { message = "Turf should have price" });
            if (turf.Location.IsNullOrEmpty())
                return BadRequest(new { message = "Turf should have Location" });
            if (turf.description.IsNullOrEmpty())
                return BadRequest(new { message = "Turf should have Description" });

            var result = _turfService.CreateTurf(turf,userid);
            if (result)
            {
                return Ok(new { message = "Turf created successfully" });
            }
            return BadRequest(new { message = "Failed to create turf" });
        }

        [Authorize]
        [HttpDelete("{userId}/{turfId}")]
        public IActionResult DeleteTurf(Guid userId, Guid turfId)
        {
            var result = _userService.DeleteTurf(turfId, userId);
            if (result)
            {
                return Ok(new { message = "Turf deleted successfully" });
            }
            return NotFound(new { message = "Failed to delete turf" });
        }

        [Authorize]
        [HttpPost("my-turf")]
        public IActionResult HisTurf([FromBody] TurfRequest request)
        {
            var turf = _userService.ShowHisTurf(request.UserId, request.TurfId);
            if (turf != null)
            {
                return Ok(new { message = "Turf retrieved successfully", turf });
            }
            return NotFound(new { message = "Turf not found" });
        }
        [Authorize]
        [HttpPost("free-slots/{turfId}")]
        public IActionResult FreeSlots([FromBody] SlotAvailabilityRequest request,Guid turfId)
        {
            if (request == null || turfId == Guid.Empty || string.IsNullOrWhiteSpace(request.RequestedSlot))
            {
                return BadRequest("Invalid request data.");
            }

            try
            {
                bool isAvailable = _turfService.CheckSlotAvailability(turfId, request.Date, request.RequestedSlot);

                return Ok(new { Available = isAvailable });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize]
        [HttpPost("getslots/{turfid}")]
        public IActionResult GetSlots(Guid turfid, [FromQuery] DateTime slot)
        {
            try
            {
                List<string> slots = _userService.FreeSlots(turfid, slot);
                return Ok(new { SLOTS = slots });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize]
        [HttpGet("{userid}")]
        public IActionResult GetmyDetails(Guid userid)
        {
            return Ok(new { Details = _turfService.GetU(userid) });
        }

        [Authorize]
        [HttpPut("edit")]
        public IActionResult EditUserDetails([FromBody] EditDetails detail)
        {
            string userid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            _userService.EditDetails(userid,detail);
            return Ok(new { Message = "Details Edited" });

        }
    }
}
