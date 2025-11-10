using Microsoft.EntityFrameworkCore;
using SlowSpot.Api.Models;

namespace SlowSpot.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Quote> Quotes { get; set; }
    public DbSet<MeditationSession> MeditationSessions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed initial data
        modelBuilder.Entity<Quote>().HasData(
            new Quote { Id = 1, Text = "Peace comes when you stop chasing it.", LanguageCode = "en", CultureTag = "universal", Category = "peace", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 2, Text = "Spokój przychodzi, gdy przestajesz go gonić.", LanguageCode = "pl", CultureTag = "universal", Category = "peace", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 3, Text = "The present moment is all you ever have.", Author = "Eckhart Tolle", LanguageCode = "en", CultureTag = "mindfulness", Category = "presence", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 4, Text = "Obecna chwila to wszystko, co kiedykolwiek masz.", Author = "Eckhart Tolle", LanguageCode = "pl", CultureTag = "mindfulness", Category = "presence", CreatedAt = DateTime.UtcNow }
        );

        modelBuilder.Entity<MeditationSession>().HasData(
            new MeditationSession
            {
                Id = 1,
                Title = "Breath Awareness",
                LanguageCode = "en",
                DurationSeconds = 300,
                Level = 1,
                Description = "A simple 5-minute breath awareness meditation",
                CultureTag = "mindfulness",
                CreatedAt = DateTime.UtcNow
            },
            new MeditationSession
            {
                Id = 2,
                Title = "Świadomość Oddechu",
                LanguageCode = "pl",
                DurationSeconds = 300,
                Level = 1,
                Description = "Prosta 5-minutowa medytacja świadomości oddechu",
                CultureTag = "mindfulness",
                CreatedAt = DateTime.UtcNow
            }
        );
    }
}
