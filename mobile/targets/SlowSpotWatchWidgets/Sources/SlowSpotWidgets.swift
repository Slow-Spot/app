/**
 * Slow Spot Watch Complications (WidgetKit)
 *
 * Komplikacje na tarcze zegarka Apple Watch.
 * Pokazuje statystyki medytacji i szybki dostep do aplikacji.
 */

import WidgetKit
import SwiftUI

// MARK: - Timeline Provider

struct MeditationTimelineProvider: TimelineProvider {
    typealias Entry = MeditationEntry

    func placeholder(in context: Context) -> MeditationEntry {
        MeditationEntry(date: Date(), todayMinutes: 0, streak: 0)
    }

    func getSnapshot(in context: Context, completion: @escaping (MeditationEntry) -> Void) {
        // Dla preview pokazujemy przykladowe dane
        let entry = MeditationEntry(date: Date(), todayMinutes: 15, streak: 7)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<MeditationEntry>) -> Void) {
        // Pobierz dane z shared UserDefaults (App Group)
        let sharedDefaults = UserDefaults(suiteName: "group.com.slowspot.app")
        let todayMinutes = sharedDefaults?.integer(forKey: "todayMindfulMinutes") ?? 0
        let streak = sharedDefaults?.integer(forKey: "currentStreak") ?? 0

        let entry = MeditationEntry(
            date: Date(),
            todayMinutes: todayMinutes,
            streak: streak
        )

        // Refresh co 15 minut
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 15, to: Date())!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))

        completion(timeline)
    }
}

// MARK: - Timeline Entry

struct MeditationEntry: TimelineEntry {
    let date: Date
    let todayMinutes: Int
    let streak: Int
}

// MARK: - Complication Views

struct CircularComplicationView: View {
    let entry: MeditationEntry

    private let brandPurple = Color(hex: "8B5CF6")

    var body: some View {
        ZStack {
            // Progress ring (target: 10 min daily)
            Circle()
                .stroke(brandPurple.opacity(0.3), lineWidth: 4)

            Circle()
                .trim(from: 0, to: min(CGFloat(entry.todayMinutes) / 10.0, 1.0))
                .stroke(brandPurple, style: StrokeStyle(lineWidth: 4, lineCap: .round))
                .rotationEffect(.degrees(-90))

            // Minutes count
            VStack(spacing: 0) {
                Text("\(entry.todayMinutes)")
                    .font(.system(size: 16, weight: .semibold, design: .rounded))
                    .foregroundColor(.primary)

                Text("min")
                    .font(.system(size: 8))
                    .foregroundColor(.secondary)
            }
        }
        .padding(4)
    }
}

struct RectangularComplicationView: View {
    let entry: MeditationEntry

    private let brandPurple = Color(hex: "8B5CF6")

    var body: some View {
        HStack(spacing: 8) {
            // Icon
            Image(systemName: "leaf.fill")
                .font(.title3)
                .foregroundColor(brandPurple)

            VStack(alignment: .leading, spacing: 2) {
                Text("Today")
                    .font(.caption2)
                    .foregroundColor(.secondary)

                Text("\(entry.todayMinutes) min")
                    .font(.headline)
                    .foregroundColor(.primary)
            }

            Spacer()

            // Streak badge
            if entry.streak > 0 {
                VStack(spacing: 0) {
                    Image(systemName: "flame.fill")
                        .font(.caption)
                        .foregroundColor(.orange)

                    Text("\(entry.streak)")
                        .font(.caption2)
                        .fontWeight(.semibold)
                }
            }
        }
        .padding(.horizontal, 8)
    }
}

struct CornerComplicationView: View {
    let entry: MeditationEntry

    private let brandPurple = Color(hex: "8B5CF6")

    var body: some View {
        ZStack {
            Image(systemName: "leaf.fill")
                .font(.title2)
                .foregroundColor(brandPurple)
        }
    }
}

struct InlineComplicationView: View {
    let entry: MeditationEntry

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "leaf.fill")
            Text("\(entry.todayMinutes) min today")
        }
    }
}

// MARK: - Widget Configuration

struct MeditationComplication: Widget {
    let kind: String = "MeditationComplication"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: MeditationTimelineProvider()) { entry in
            ComplicationEntryView(entry: entry)
                .containerBackground(.clear, for: .widget)
        }
        .configurationDisplayName("Meditation")
        .description("Track your daily mindfulness minutes.")
        .supportedFamilies([
            .accessoryCircular,
            .accessoryRectangular,
            .accessoryCorner,
            .accessoryInline
        ])
    }
}

struct ComplicationEntryView: View {
    @Environment(\.widgetFamily) var family
    let entry: MeditationEntry

    var body: some View {
        switch family {
        case .accessoryCircular:
            CircularComplicationView(entry: entry)
        case .accessoryRectangular:
            RectangularComplicationView(entry: entry)
        case .accessoryCorner:
            CornerComplicationView(entry: entry)
        case .accessoryInline:
            InlineComplicationView(entry: entry)
        @unknown default:
            CircularComplicationView(entry: entry)
        }
    }
}

// MARK: - Widget Bundle

@main
struct SlowSpotWidgetBundle: WidgetBundle {
    var body: some Widget {
        MeditationComplication()
    }
}

// MARK: - Color Extension

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r, g, b: UInt64
        (r, g, b) = (int >> 16, int >> 8 & 0xFF, int & 0xFF)
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: 1
        )
    }
}

// MARK: - Previews

#Preview("Circular", as: .accessoryCircular) {
    MeditationComplication()
} timeline: {
    MeditationEntry(date: Date(), todayMinutes: 5, streak: 3)
    MeditationEntry(date: Date(), todayMinutes: 10, streak: 3)
}

#Preview("Rectangular", as: .accessoryRectangular) {
    MeditationComplication()
} timeline: {
    MeditationEntry(date: Date(), todayMinutes: 15, streak: 7)
}
