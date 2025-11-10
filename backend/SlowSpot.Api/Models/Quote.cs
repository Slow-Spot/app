namespace SlowSpot.Api.Models;

public class Quote
{
    public int Id { get; set; }
    public required string Text { get; set; }
    public string? Author { get; set; }
    public required string LanguageCode { get; set; } // e.g., "en", "pl", "es"
    public string? CultureTag { get; set; } // e.g., "zen", "sufism", "universal"
    public string? Category { get; set; } // e.g., "focus", "compassion", "silence"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
