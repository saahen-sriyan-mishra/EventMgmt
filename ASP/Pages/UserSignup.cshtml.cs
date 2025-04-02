using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

public class UserSignupModel : PageModel
{
    [BindProperty]
    public string Email { get; set; }

    [BindProperty]
    public string Password { get; set; }

    [BindProperty]
    public string ConfirmPassword { get; set; }

    public string Message { get; set; }

    public async Task<IActionResult> OnPostAsync()
    {
        if (Password != ConfirmPassword)
        {
            Message = "Passwords do not match.";
            return Page();
        }

        using var client = new HttpClient();
        try
{
    var response = await client.PostAsJsonAsync("http://localhost:5274/api/auth/signup", new { Email, Password });

    if (!response.IsSuccessStatusCode)
    {
        var error = await response.Content.ReadAsStringAsync();
        ModelState.AddModelError(string.Empty, $"Signup failed: {error}");
        return Page();
    }

    return Redirect("/UserLogin");
}
catch (Exception ex)
{
    ModelState.AddModelError(string.Empty, $"An error occurred: {ex.Message}");
    return Page();
}

    }
}
