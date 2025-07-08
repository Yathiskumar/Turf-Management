using System.Security.Claims;
using database.Model;
using database.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace database.Controllers
{
    [Authorize]
    [Route("api/feedback")]
    [ApiController]
    public class Feedbacks : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITurfService _turfService;

        public Feedbacks(IUserService userService, ITurfService turfService)
        {
            _userService = userService;
            _turfService = turfService;
        }

        [HttpPost("{turfId}")]
        public IActionResult AddFeedback([FromBody] Feedback feedback, Guid turfId)
        {
            if (feedback == null || string.IsNullOrWhiteSpace(feedback.FeedbackText))
            {
                return BadRequest(new { message = "Invalid feedback data." });
            }
            feedback.UserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            feedback.Name = _turfService.GetUserById(feedback.UserId);

            _userService.AddFeedback(feedback,turfId);
            return Ok(new { message = "Feedback added successfully." });
        }

        [HttpGet("details/turf/{turfId}")]
        public IActionResult GetFeedbacksForTurf(Guid turfId)
        {
  
            var feedbacks = _turfService.GetFeedbacksForTurf(turfId);
            if (feedbacks == null || !feedbacks.Any())
            {
                return Ok(new { message = "No feedbacks found for this turf." });
            }

            return Ok(new { message = "Feedbacks retrieved successfully.", feedbacks });
        }
    }
}
