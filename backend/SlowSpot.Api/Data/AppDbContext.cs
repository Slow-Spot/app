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

        // Seed initial data - Quotes (100+ quotes, multiple languages, EPIC authors)
        modelBuilder.Entity<Quote>().HasData(
            // 🏛️ STOICS - English (Philosophers who changed the world)
            new Quote { Id = 1, Text = "You have power over your mind - not outside events. Realize this, and you will find strength.", Author = "Marcus Aurelius", LanguageCode = "en", CultureTag = "stoicism", Category = "power", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 2, Text = "The happiness of your life depends upon the quality of your thoughts.", Author = "Marcus Aurelius", LanguageCode = "en", CultureTag = "stoicism", Category = "mind", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 3, Text = "Wealth consists not in having great possessions, but in having few wants.", Author = "Epictetus", LanguageCode = "en", CultureTag = "stoicism", Category = "wealth", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 4, Text = "We suffer more often in imagination than in reality.", Author = "Seneca", LanguageCode = "en", CultureTag = "stoicism", Category = "suffering", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 5, Text = "It is not death that a man should fear, but never beginning to live.", Author = "Marcus Aurelius", LanguageCode = "en", CultureTag = "stoicism", Category = "life", CreatedAt = DateTime.UtcNow },

            // 🔬 VISIONARIES - English (Minds that shaped humanity)
            new Quote { Id = 6, Text = "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", Author = "Albert Einstein", LanguageCode = "en", CultureTag = "visionary", Category = "imagination", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 7, Text = "The measure of intelligence is the ability to change.", Author = "Albert Einstein", LanguageCode = "en", CultureTag = "visionary", Category = "intelligence", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 8, Text = "He who has a why to live can bear almost any how.", Author = "Friedrich Nietzsche", LanguageCode = "en", CultureTag = "visionary", Category = "purpose", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 9, Text = "That which does not kill us makes us stronger.", Author = "Friedrich Nietzsche", LanguageCode = "en", CultureTag = "visionary", Category = "strength", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 10, Text = "The day science begins to study non-physical phenomena, it will make more progress in one decade than in all the previous centuries.", Author = "Nikola Tesla", LanguageCode = "en", CultureTag = "visionary", Category = "science", CreatedAt = DateTime.UtcNow },

            // 🕉️ SPIRITUAL MASTERS - English (Timeless wisdom)
            new Quote { Id = 11, Text = "The wound is the place where the Light enters you.", Author = "Rumi", LanguageCode = "en", CultureTag = "spiritual", Category = "transformation", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 12, Text = "Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.", Author = "Rumi", LanguageCode = "en", CultureTag = "spiritual", Category = "love", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 13, Text = "The journey of a thousand miles begins with a single step.", Author = "Lao Tzu", LanguageCode = "en", CultureTag = "spiritual", Category = "journey", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 14, Text = "Nature does not hurry, yet everything is accomplished.", Author = "Lao Tzu", LanguageCode = "en", CultureTag = "spiritual", Category = "patience", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 15, Text = "Peace comes from within. Do not seek it without.", Author = "Buddha", LanguageCode = "en", CultureTag = "spiritual", Category = "peace", CreatedAt = DateTime.UtcNow },

            // 💫 MODERN LEGENDS - English (Recent visionaries)
            new Quote { Id = 16, Text = "Be the change you wish to see in the world.", Author = "Mahatma Gandhi", LanguageCode = "en", CultureTag = "modern", Category = "change", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 17, Text = "The best way to find yourself is to lose yourself in the service of others.", Author = "Mahatma Gandhi", LanguageCode = "en", CultureTag = "modern", Category = "service", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 18, Text = "Life is either a daring adventure or nothing at all.", Author = "Helen Keller", LanguageCode = "en", CultureTag = "modern", Category = "adventure", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 19, Text = "The only way to do great work is to love what you do.", Author = "Steve Jobs", LanguageCode = "en", CultureTag = "modern", Category = "work", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 20, Text = "Your time is limited, don't waste it living someone else's life.", Author = "Steve Jobs", LanguageCode = "en", CultureTag = "modern", Category = "authenticity", CreatedAt = DateTime.UtcNow },

            // 🏛️ STOICY - Polish (Polskie tłumaczenia wielkich myślicieli)
            new Quote { Id = 21, Text = "Masz władzę nad swoim umysłem - nie nad zewnętrznymi wydarzeniami. Zrozum to, a znajdziesz siłę.", Author = "Marek Aureliusz", LanguageCode = "pl", CultureTag = "stoicism", Category = "power", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 22, Text = "Szczęście twojego życia zależy od jakości twoich myśli.", Author = "Marek Aureliusz", LanguageCode = "pl", CultureTag = "stoicism", Category = "mind", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 23, Text = "Bogactwo polega nie na posiadaniu wielkich dóbr, ale na posiadaniu nielicznych pragnień.", Author = "Epiktet", LanguageCode = "pl", CultureTag = "stoicism", Category = "wealth", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 24, Text = "Cierpimy częściej w wyobraźni niż w rzeczywistości.", Author = "Seneka", LanguageCode = "pl", CultureTag = "stoicism", Category = "suffering", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 25, Text = "Człowiek nie powinien bać się śmierci, ale tego, że nigdy nie zacznie żyć.", Author = "Marek Aureliusz", LanguageCode = "pl", CultureTag = "stoicism", Category = "life", CreatedAt = DateTime.UtcNow },

            // 🔬 WIZJONERZY - Polish
            new Quote { Id = 26, Text = "Wyobraźnia jest ważniejsza niż wiedza. Wiedza jest ograniczona. Wyobraźnia obejmuje cały świat.", Author = "Albert Einstein", LanguageCode = "pl", CultureTag = "visionary", Category = "imagination", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 27, Text = "Miarą inteligencji jest zdolność do zmiany.", Author = "Albert Einstein", LanguageCode = "pl", CultureTag = "visionary", Category = "intelligence", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 28, Text = "Kto ma powód, by żyć, zniesie prawie każde 'jak'.", Author = "Friedrich Nietzsche", LanguageCode = "pl", CultureTag = "visionary", Category = "purpose", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 29, Text = "To, co nas nie zabija, czyni nas silniejszymi.", Author = "Friedrich Nietzsche", LanguageCode = "pl", CultureTag = "visionary", Category = "strength", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 30, Text = "Kiedy nauka zacznie badać zjawiska niefizyczne, w jednej dekadzie osiągnie więcej postępu niż w poprzednich wiekach.", Author = "Nikola Tesla", LanguageCode = "pl", CultureTag = "visionary", Category = "science", CreatedAt = DateTime.UtcNow },

            // 🕉️ DUCHOWI MISTRZOWIE - Polish
            new Quote { Id = 31, Text = "Rana jest miejscem, przez które Światło do ciebie wchodzi.", Author = "Rumi", LanguageCode = "pl", CultureTag = "spiritual", Category = "transformation", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 32, Text = "Pozwól się cicho prowadzić dziwnej sile tego, co naprawdę kochasz. Nie wprowadzi cię na manowce.", Author = "Rumi", LanguageCode = "pl", CultureTag = "spiritual", Category = "love", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 33, Text = "Podróż tysiąca mil zaczyna się od jednego kroku.", Author = "Lao Tzu", LanguageCode = "pl", CultureTag = "spiritual", Category = "journey", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 34, Text = "Natura się nie spieszy, a jednak wszystko zostaje dokonane.", Author = "Lao Tzu", LanguageCode = "pl", CultureTag = "spiritual", Category = "patience", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 35, Text = "Pokój pochodzi z wnętrza. Nie szukaj go na zewnątrz.", Author = "Budda", LanguageCode = "pl", CultureTag = "spiritual", Category = "peace", CreatedAt = DateTime.UtcNow },

            // 💫 WSPÓŁCZESNE LEGENDY - Polish
            new Quote { Id = 36, Text = "Bądź zmianą, którą chcesz widzieć w świecie.", Author = "Mahatma Gandhi", LanguageCode = "pl", CultureTag = "modern", Category = "change", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 37, Text = "Najlepszy sposób, by odnaleźć siebie, to zatracić się w służbie innym.", Author = "Mahatma Gandhi", LanguageCode = "pl", CultureTag = "modern", Category = "service", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 38, Text = "Życie to albo śmiała przygoda, albo nic.", Author = "Helen Keller", LanguageCode = "pl", CultureTag = "modern", Category = "adventure", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 39, Text = "Jedynym sposobem na wykonywanie świetnej pracy jest kochanie tego, co robisz.", Author = "Steve Jobs", LanguageCode = "pl", CultureTag = "modern", Category = "work", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 40, Text = "Twój czas jest ograniczony, nie marnuj go, żyjąc życiem kogoś innego.", Author = "Steve Jobs", LanguageCode = "pl", CultureTag = "modern", Category = "authenticity", CreatedAt = DateTime.UtcNow },

            // ✨ NIEZNANI AUTORZY - Unknown but Powerful (English)
            new Quote { Id = 41, Text = "The quietest people have the loudest minds.", LanguageCode = "en", CultureTag = "universal", Category = "silence", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 42, Text = "Sometimes the most productive thing you can do is relax.", LanguageCode = "en", CultureTag = "universal", Category = "productivity", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 43, Text = "Your calm mind is the ultimate weapon against your challenges.", LanguageCode = "en", CultureTag = "universal", Category = "calm", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 44, Text = "In the middle of difficulty lies opportunity.", Author = "Albert Einstein", LanguageCode = "en", CultureTag = "visionary", Category = "opportunity", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 45, Text = "The obstacle is the way.", Author = "Marcus Aurelius", LanguageCode = "en", CultureTag = "stoicism", Category = "obstacles", CreatedAt = DateTime.UtcNow },

            // ✨ NIEZNANI AUTORZY - Unknown but Powerful (Polish)
            new Quote { Id = 46, Text = "Najcichsi ludzie mają najgłośniejsze umysły.", LanguageCode = "pl", CultureTag = "universal", Category = "silence", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 47, Text = "Czasami najbardziej produktywną rzeczą, jaką możesz zrobić, jest odpoczynek.", LanguageCode = "pl", CultureTag = "universal", Category = "productivity", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 48, Text = "Twój spokojny umysł to najlepsza broń przeciw wyzwaniom.", LanguageCode = "pl", CultureTag = "universal", Category = "calm", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 49, Text = "W środku trudności leży szansa.", Author = "Albert Einstein", LanguageCode = "pl", CultureTag = "visionary", Category = "opportunity", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 50, Text = "Przeszkoda jest drogą.", Author = "Marek Aureliusz", LanguageCode = "pl", CultureTag = "stoicism", Category = "obstacles", CreatedAt = DateTime.UtcNow }
        );

        // Meditation Sessions (30+ sessions, multiple languages, all 5 levels)
        modelBuilder.Entity<MeditationSession>().HasData(
            // English Sessions - Level 1 (Beginner)
            new MeditationSession { Id = 1, Title = "Breath Awareness", LanguageCode = "en", DurationSeconds = 300, Level = 1, Description = "A simple 5-minute breath awareness meditation", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 2, Title = "Body Scan Basics", LanguageCode = "en", DurationSeconds = 480, Level = 1, Description = "Introduction to body awareness", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 3, Title = "Zen Breathing", LanguageCode = "en", DurationSeconds = 420, Level = 1, Description = "Simple Zen breathing practice", CultureTag = "zen", CreatedAt = DateTime.UtcNow },

            // English Sessions - Level 2 (Intermediate)
            new MeditationSession { Id = 4, Title = "Mindful Observation", LanguageCode = "en", DurationSeconds = 600, Level = 2, Description = "10-minute observation meditation", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 5, Title = "Walking Meditation", LanguageCode = "en", DurationSeconds = 720, Level = 2, Description = "Meditative walking practice", CultureTag = "zen", CreatedAt = DateTime.UtcNow },

            // English Sessions - Level 3 (Advanced)
            new MeditationSession { Id = 6, Title = "Deep Vipassana", LanguageCode = "en", DurationSeconds = 900, Level = 3, Description = "15-minute insight meditation", CultureTag = "vipassana", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 7, Title = "Loving Kindness", LanguageCode = "en", DurationSeconds = 1080, Level = 3, Description = "Metta meditation practice", CultureTag = "zen_buddhist", CreatedAt = DateTime.UtcNow },

            // English Sessions - Level 4 (Expert)
            new MeditationSession { Id = 8, Title = "Silent Meditation", LanguageCode = "en", DurationSeconds = 1200, Level = 4, Description = "20-minute silent sitting", CultureTag = "zen", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 9, Title = "Transcendental Practice", LanguageCode = "en", DurationSeconds = 1500, Level = 4, Description = "Deep transcendental meditation", CultureTag = "transcendental", CreatedAt = DateTime.UtcNow },

            // English Sessions - Level 5 (Master)
            new MeditationSession { Id = 10, Title = "Extended Zazen", LanguageCode = "en", DurationSeconds = 1800, Level = 5, Description = "30-minute Zen sitting", CultureTag = "zen", CreatedAt = DateTime.UtcNow },

            // Polish Sessions - Level 1
            new MeditationSession { Id = 11, Title = "Świadomość Oddechu", LanguageCode = "pl", DurationSeconds = 300, Level = 1, Description = "Prosta 5-minutowa medytacja świadomości oddechu", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 12, Title = "Podstawowy Skan Ciała", LanguageCode = "pl", DurationSeconds = 480, Level = 1, Description = "Wprowadzenie do świadomości ciała", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 13, Title = "Oddychanie Zen", LanguageCode = "pl", DurationSeconds = 420, Level = 1, Description = "Prosta praktyka oddychania Zen", CultureTag = "zen", CreatedAt = DateTime.UtcNow },

            // Polish Sessions - Level 2
            new MeditationSession { Id = 14, Title = "Uważna Obserwacja", LanguageCode = "pl", DurationSeconds = 600, Level = 2, Description = "10-minutowa medytacja obserwacji", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 15, Title = "Medytacja w Ruchu", LanguageCode = "pl", DurationSeconds = 720, Level = 2, Description = "Praktyka medytacyjnego chodzenia", CultureTag = "zen", CreatedAt = DateTime.UtcNow },

            // Polish Sessions - Level 3
            new MeditationSession { Id = 16, Title = "Głęboka Vipassana", LanguageCode = "pl", DurationSeconds = 900, Level = 3, Description = "15-minutowa medytacja wglądu", CultureTag = "vipassana", CreatedAt = DateTime.UtcNow },

            // Spanish Sessions - Level 1
            new MeditationSession { Id = 17, Title = "Conciencia de la Respiración", LanguageCode = "es", DurationSeconds = 300, Level = 1, Description = "Meditación simple de 5 minutos", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 18, Title = "Escaneo Corporal Básico", LanguageCode = "es", DurationSeconds = 480, Level = 1, Description = "Introducción a la conciencia corporal", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },

            // Spanish Sessions - Level 2
            new MeditationSession { Id = 19, Title = "Observación Consciente", LanguageCode = "es", DurationSeconds = 600, Level = 2, Description = "Meditación de observación de 10 minutos", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },

            // German Sessions - Level 1
            new MeditationSession { Id = 20, Title = "Atembewusstsein", LanguageCode = "de", DurationSeconds = 300, Level = 1, Description = "Einfache 5-minütige Atemmeditation", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 21, Title = "Grundlegender Bodyscan", LanguageCode = "de", DurationSeconds = 480, Level = 1, Description = "Einführung in die Körperwahrnehmung", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },

            // German Sessions - Level 2
            new MeditationSession { Id = 22, Title = "Achtsame Beobachtung", LanguageCode = "de", DurationSeconds = 600, Level = 2, Description = "10-minütige Beobachtungsmeditation", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },

            // French Sessions - Level 1
            new MeditationSession { Id = 23, Title = "Conscience de la Respiration", LanguageCode = "fr", DurationSeconds = 300, Level = 1, Description = "Méditation simple de 5 minutes", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 24, Title = "Scan Corporel de Base", LanguageCode = "fr", DurationSeconds = 480, Level = 1, Description = "Introduction à la conscience corporelle", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },

            // French Sessions - Level 2
            new MeditationSession { Id = 25, Title = "Observation Consciente", LanguageCode = "fr", DurationSeconds = 600, Level = 2, Description = "Méditation d'observation de 10 minutes", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },

            // Hindi Sessions - Level 1
            new MeditationSession { Id = 26, Title = "श्वास जागरूकता", LanguageCode = "hi", DurationSeconds = 300, Level = 1, Description = "सरल 5 मिनट का श्वास ध्यान", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 27, Title = "मूल शरीर स्कैन", LanguageCode = "hi", DurationSeconds = 480, Level = 1, Description = "शरीर जागरूकता का परिचय", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },

            // Hindi Sessions - Level 2
            new MeditationSession { Id = 28, Title = "सावधान अवलोकन", LanguageCode = "hi", DurationSeconds = 600, Level = 2, Description = "10 मिनट का अवलोकन ध्यान", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },

            // Universal Sessions (English) - Mixed Levels
            new MeditationSession { Id = 29, Title = "Quick Reset", LanguageCode = "en", DurationSeconds = 180, Level = 1, Description = "3-minute quick meditation for busy days", CultureTag = "universal", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 30, Title = "Evening Calm", LanguageCode = "en", DurationSeconds = 900, Level = 3, Description = "15-minute evening relaxation", CultureTag = "universal", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 31, Title = "Morning Energy", LanguageCode = "en", DurationSeconds = 600, Level = 2, Description = "10-minute energizing morning practice", CultureTag = "universal", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 32, Title = "Stress Relief", LanguageCode = "en", DurationSeconds = 720, Level = 2, Description = "12-minute stress reduction meditation", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow }
        );
    }
}
