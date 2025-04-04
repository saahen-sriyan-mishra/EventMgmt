using ASP.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Adding services to the container
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddRazorPages();

// Adding controllers
builder.Services.AddControllers();

builder.Services.AddHttpClient();


//Error logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();


// Configuring JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });


var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.Urls.Add("http://0.0.0.0:5274");

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Using authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// Mapping controllers for APIs
app.MapControllers();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

// Redirecting the root URL to the Home Razor Page
app.MapGet("/", (context) =>
{
    context.Response.Redirect("/Home");
    return Task.CompletedTask;
});

app.Run();
