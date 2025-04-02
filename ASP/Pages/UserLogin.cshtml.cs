using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

public class UserLoginModel : PageModel
{
    // Properties bound to the form inputs
    [BindProperty]
    public string Email { get; set; }

    [BindProperty]
    public string Password { get; set; }

    // Property to hold error or success messages
    public string Message { get; set; }

    // OnPostAsync handles the form submission
    public async Task<IActionResult> OnPostAsync()
    {
        using var client = new HttpClient();

        try
        {
            // Debug: Log that the login request is being sent
            Console.WriteLine($"Attempting login for email: {Email}");

            // Make the API call to the login endpoint
            var response = await client.PostAsJsonAsync("http://localhost:5274/api/auth/login", new { Email, Password });

            // If login is successful
            if (response.IsSuccessStatusCode)
            {
                // Parse the response to extract the JWT token
                var result = await response.Content.ReadFromJsonAsync<LoginResponse>();

                // Debug: Log the successful response
                Console.WriteLine($"Login successful for email: {Email}. JWT Token received.");

                // Store the JWT token in a secure cookie
                Response.Cookies.Append("jwt", result.Token);

                // Redirect the user to the Home page
                return Redirect($"http://localhost:5173/email?user={Email}");
        
            }
            else
            {
                // Capture detailed error response from the API
                var errorMessage = await response.Content.ReadAsStringAsync();

                // Debug: Log the error message from the API
                Console.WriteLine($"Login failed for email: {Email}. Server responded with: {errorMessage}");

                // Display the error message to the user
                Message = "Invalid credentials. Please try again.";
                return Page();
            }
        }
        catch (HttpRequestException httpEx)
        {
            // Debug: Log any network-related exception
            Console.WriteLine($"HttpRequestException occurred: {httpEx.Message}");

            // Show a user-friendly message for network issues
            Message = "Unable to connect to the server. Please try again later.";
            return Page();
        }
        catch (System.Exception ex)
        {
            // Debug: Log any unexpected exception
            Console.WriteLine($"An unexpected error occurred: {ex.Message}");

            // Show a generic error message to the user
            Message = "An error occurred while processing your request. Please try again.";
            return Page();
        }
    }

    // Class to parse the token from the API response
    public class LoginResponse
    {
        public string Token { get; set; }
    }
}
