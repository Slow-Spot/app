using Microsoft.EntityFrameworkCore;
using SlowSpot.Api.Data;
using SlowSpot.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        // Configure specific allowed origins for security
        // Production URLs are set as defaults, development URLs are loaded from appsettings.Development.json
        var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
            ?? new[] { "https://slowspot.me", "https://www.slowspot.me" };
        
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add Database (SQLite for MVP, easy to switch to PostgreSQL later)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=slowspot.db"));

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// API Endpoints
app.MapGet("/", () => new
{
    name = "Slow Spot API",
    version = "1.0.0",
    status = "healthy"
});

// Quotes endpoints
app.MapGet("/api/quotes", async (AppDbContext db, string? lang = null) =>
{
    var query = db.Quotes.AsQueryable();
    if (!string.IsNullOrEmpty(lang))
        query = query.Where(q => q.LanguageCode == lang);

    return await query.ToListAsync();
})
.WithName("GetQuotes")
.WithOpenApi();

app.MapGet("/api/quotes/random", async (AppDbContext db, string lang = "en") =>
{
    var quotes = await db.Quotes
        .Where(q => q.LanguageCode == lang)
        .ToListAsync();

    if (quotes.Count == 0)
        return Results.NotFound(new { message = "No quotes found for this language" });

    var random = quotes[Random.Shared.Next(quotes.Count)];
    return Results.Ok(random);
})
.WithName("GetRandomQuote")
.WithOpenApi();

// Meditation Sessions endpoints
app.MapGet("/api/sessions", async (AppDbContext db, string? lang = null, int? level = null) =>
{
    var query = db.MeditationSessions.AsQueryable();

    if (!string.IsNullOrEmpty(lang))
        query = query.Where(s => s.LanguageCode == lang);

    if (level.HasValue)
        query = query.Where(s => s.Level == level.Value);

    return await query.ToListAsync();
})
.WithName("GetSessions")
.WithOpenApi();

app.MapGet("/api/sessions/{id}", async (int id, AppDbContext db) =>
{
    var session = await db.MeditationSessions.FindAsync(id);
    return session is not null ? Results.Ok(session) : Results.NotFound();
})
.WithName("GetSessionById")
.WithOpenApi();

// Health check
app.MapGet("/health", () => new
{
    status = "healthy",
    timestamp = DateTime.UtcNow
})
.WithName("HealthCheck")
.WithOpenApi();

app.Run();

// Make the implicit Program class public so integration tests can access it
public partial class Program { }
