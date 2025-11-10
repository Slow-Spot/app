namespace SlowSpot.Api.Models;

public class MeditationSession
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string LanguageCode { get; set; } // e.g., "en", "pl"
    public int DurationSeconds { get; set; } // e.g., 300 for 5 minutes
    public string? VoiceUrl { get; set; } // URL to voice guidance audio
    public string? AmbientUrl { get; set; } // URL to ambient background audio
    public string? ChimeUrl { get; set; } // URL to chime/bell sound
    public string? CultureTag { get; set; } // e.g., "zen", "mindfulness"
    public int Level { get; set; } // 1-5 (beginner to advanced)
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
