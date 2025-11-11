using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SlowSpot.Api.Data;
using SlowSpot.Api.Models;
using Xunit;

namespace SlowSpot.Api.Tests;

/// <summary>
/// Integration tests for Slow Spot API endpoints
/// Tests all API functionality including quotes and meditation sessions
/// </summary>
public class ApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public ApiTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Remove the existing DbContext registration
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                // Add in-memory database for testing
                services.AddDbContext<AppDbContext>(options =>
                {
                    options.UseInMemoryDatabase("TestDb");
                });

                // Build service provider and seed test data
                var sp = services.BuildServiceProvider();
                using var scope = sp.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Database.EnsureCreated();
            });
        });

        _client = _factory.CreateClient();
    }

    #region Quotes API Tests

    [Fact]
    public async Task GetQuotes_ReturnsOk()
    {
        // Act
        var response = await _client.GetAsync("/api/quotes");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var quotes = await response.Content.ReadFromJsonAsync<List<Quote>>();
        Assert.NotNull(quotes);
        Assert.NotEmpty(quotes);
    }

    [Fact]
    public async Task GetQuotes_WithLanguageFilter_ReturnsOnlySpecifiedLanguage()
    {
        // Act
        var response = await _client.GetAsync("/api/quotes?lang=en");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var quotes = await response.Content.ReadFromJsonAsync<List<Quote>>();
        Assert.NotNull(quotes);
        Assert.All(quotes, q => Assert.Equal("en", q.LanguageCode));
    }

    [Theory]
    [InlineData("en")]
    [InlineData("pl")]
    [InlineData("es")]
    [InlineData("de")]
    [InlineData("fr")]
    [InlineData("hi")]
    public async Task GetQuotes_AllSupportedLanguages_ReturnsQuotes(string language)
    {
        // Act
        var response = await _client.GetAsync($"/api/quotes?lang={language}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var quotes = await response.Content.ReadFromJsonAsync<List<Quote>>();
        Assert.NotNull(quotes);
        Assert.All(quotes, q => Assert.Equal(language, q.LanguageCode));
    }

    [Fact]
    public async Task GetRandomQuote_ReturnsOk()
    {
        // Act
        var response = await _client.GetAsync("/api/quotes/random?lang=en");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var quote = await response.Content.ReadFromJsonAsync<Quote>();
        Assert.NotNull(quote);
        Assert.Equal("en", quote.LanguageCode);
        Assert.False(string.IsNullOrEmpty(quote.Text));
    }

    [Fact]
    public async Task GetRandomQuote_ReturnsNotFound_WhenLanguageHasNoQuotes()
    {
        // Act
        var response = await _client.GetAsync("/api/quotes/random?lang=xx");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    #endregion

    #region Meditation Sessions API Tests

    [Fact]
    public async Task GetSessions_ReturnsOk()
    {
        // Act
        var response = await _client.GetAsync("/api/sessions");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var sessions = await response.Content.ReadFromJsonAsync<List<MeditationSession>>();
        Assert.NotNull(sessions);
        Assert.NotEmpty(sessions);
    }

    [Fact]
    public async Task GetSessions_WithLanguageFilter_ReturnsOnlySpecifiedLanguage()
    {
        // Act
        var response = await _client.GetAsync("/api/sessions?lang=en");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var sessions = await response.Content.ReadFromJsonAsync<List<MeditationSession>>();
        Assert.NotNull(sessions);
        Assert.All(sessions, s => Assert.Equal("en", s.LanguageCode));
    }

    [Theory]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(3)]
    [InlineData(4)]
    [InlineData(5)]
    public async Task GetSessions_WithLevelFilter_ReturnsOnlySpecifiedLevel(int level)
    {
        // Act
        var response = await _client.GetAsync($"/api/sessions?level={level}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var sessions = await response.Content.ReadFromJsonAsync<List<MeditationSession>>();
        Assert.NotNull(sessions);
        Assert.All(sessions, s => Assert.Equal(level, s.Level));
    }

    [Fact]
    public async Task GetSessions_WithLanguageAndLevel_ReturnsFilteredResults()
    {
        // Act
        var response = await _client.GetAsync("/api/sessions?lang=en&level=1");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var sessions = await response.Content.ReadFromJsonAsync<List<MeditationSession>>();
        Assert.NotNull(sessions);
        Assert.All(sessions, s =>
        {
            Assert.Equal("en", s.LanguageCode);
            Assert.Equal(1, s.Level);
        });
    }

    [Fact]
    public async Task GetSessionById_ReturnsOk()
    {
        // Arrange - First get all sessions to get a valid ID
        var allSessionsResponse = await _client.GetAsync("/api/sessions");
        var allSessions = await allSessionsResponse.Content.ReadFromJsonAsync<List<MeditationSession>>();
        var firstSessionId = allSessions!.First().Id;

        // Act
        var response = await _client.GetAsync($"/api/sessions/{firstSessionId}");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var session = await response.Content.ReadFromJsonAsync<MeditationSession>();
        Assert.NotNull(session);
        Assert.Equal(firstSessionId, session.Id);
    }

    [Fact]
    public async Task GetSessionById_ReturnsNotFound_WhenIdDoesNotExist()
    {
        // Act
        var response = await _client.GetAsync("/api/sessions/99999");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    #endregion

    #region Data Validation Tests

    [Fact]
    public async Task GetQuotes_AllQuotesHaveRequiredFields()
    {
        // Act
        var response = await _client.GetAsync("/api/quotes");
        var quotes = await response.Content.ReadFromJsonAsync<List<Quote>>();

        // Assert
        Assert.NotNull(quotes);
        Assert.All(quotes, q =>
        {
            Assert.True(q.Id > 0);
            Assert.False(string.IsNullOrEmpty(q.Text));
            Assert.False(string.IsNullOrEmpty(q.LanguageCode));
            Assert.True(q.LanguageCode.Length == 2); // ISO 639-1 code
        });
    }

    [Fact]
    public async Task GetSessions_AllSessionsHaveRequiredFields()
    {
        // Act
        var response = await _client.GetAsync("/api/sessions");
        var sessions = await response.Content.ReadFromJsonAsync<List<MeditationSession>>();

        // Assert
        Assert.NotNull(sessions);
        Assert.All(sessions, s =>
        {
            Assert.True(s.Id > 0);
            Assert.False(string.IsNullOrEmpty(s.Title));
            Assert.False(string.IsNullOrEmpty(s.LanguageCode));
            Assert.True(s.DurationSeconds > 0);
            Assert.InRange(s.Level, 1, 5); // Levels 1-5
        });
    }

    [Fact]
    public async Task GetQuotes_HasAtLeast50Quotes()
    {
        // Act
        var response = await _client.GetAsync("/api/quotes");
        var quotes = await response.Content.ReadFromJsonAsync<List<Quote>>();

        // Assert
        Assert.NotNull(quotes);
        Assert.True(quotes.Count >= 50, $"Expected at least 50 quotes, found {quotes.Count}");
    }

    [Fact]
    public async Task GetSessions_HasAtLeast32Sessions()
    {
        // Act
        var response = await _client.GetAsync("/api/sessions");
        var sessions = await response.Content.ReadFromJsonAsync<List<MeditationSession>>();

        // Assert
        Assert.NotNull(sessions);
        Assert.True(sessions.Count >= 32, $"Expected at least 32 sessions, found {sessions.Count}");
    }

    [Fact]
    public async Task GetSessions_CoversAllDifficultyLevels()
    {
        // Act
        var response = await _client.GetAsync("/api/sessions");
        var sessions = await response.Content.ReadFromJsonAsync<List<MeditationSession>>();

        // Assert
        Assert.NotNull(sessions);
        var levels = sessions.Select(s => s.Level).Distinct().OrderBy(l => l).ToList();
        Assert.Equal(new[] { 1, 2, 3, 4, 5 }, levels);
    }

    [Fact]
    public async Task GetQuotes_Supports6Languages()
    {
        // Act
        var response = await _client.GetAsync("/api/quotes");
        var quotes = await response.Content.ReadFromJsonAsync<List<Quote>>();

        // Assert
        Assert.NotNull(quotes);
        var languages = quotes.Select(q => q.LanguageCode).Distinct().OrderBy(l => l).ToList();
        var expectedLanguages = new[] { "de", "en", "es", "fr", "hi", "pl" };
        Assert.Equal(expectedLanguages, languages);
    }

    #endregion

    #region Performance Tests

    [Fact]
    public async Task GetQuotes_CompletesInReasonableTime()
    {
        // Act
        var sw = System.Diagnostics.Stopwatch.StartNew();
        var response = await _client.GetAsync("/api/quotes");
        sw.Stop();

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True(sw.ElapsedMilliseconds < 1000, $"Request took {sw.ElapsedMilliseconds}ms, expected < 1000ms");
    }

    [Fact]
    public async Task GetSessions_CompletesInReasonableTime()
    {
        // Act
        var sw = System.Diagnostics.Stopwatch.StartNew();
        var response = await _client.GetAsync("/api/sessions");
        sw.Stop();

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True(sw.ElapsedMilliseconds < 1000, $"Request took {sw.ElapsedMilliseconds}ms, expected < 1000ms");
    }

    #endregion
}
