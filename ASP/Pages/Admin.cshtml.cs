using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace ASP.Pages
{
    public class AdminModel : PageModel
    {
        private readonly ILogger<AdminModel> _logger;
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;

        // Updated constructor with proper injection
        public AdminModel(
            ILogger<AdminModel> logger, 
            IConfiguration config,
            IHttpClientFactory httpClientFactory)
        {
            _logger = logger;
            _config = config;
            _httpClientFactory = httpClientFactory;
        }

        [BindProperty]
        public string Username { get; set; }

        [BindProperty]
        public string Password { get; set; }

        public string ErrorMessage { get; set; }

        public void OnGet()
        {
            _logger.LogInformation("Admin login page accessed");
        }

        public async Task<IActionResult> OnPost()
        {
            Username = Username?.Trim();
            _logger.LogInformation("Admin login attempt for: {Email}", Username);

            // Create HttpClient using the factory
            var httpClient = _httpClientFactory.CreateClient();

            try
            {
                var apiBaseUrl = _config["ApiBaseUrl"] ?? "http://localhost:5274";
                var response = await httpClient.PostAsJsonAsync(
                    $"{apiBaseUrl}/api/auth/admin-login",
                    new { Email = Username, Password });

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<LoginResponse>();
                    
                    Response.Cookies.Append("jwt", result.Token, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.Strict,
                        Expires = DateTimeOffset.Now.AddHours(2)
                    });

                    return Redirect("http://localhost:5174/admindashboard");
                }

                ErrorMessage = "Invalid admin credentials";
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "API request failed");
                ErrorMessage = "Service unavailable. Please try again later.";
            }

            return Page();
        }

        private class LoginResponse
        {
            public string Token { get; set; }
            public bool IsAdmin { get; set; }
        }
    }
}