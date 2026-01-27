/**
 * BreathingGuideView
 *
 * Animowany przewodnik oddychania z haptic feedback.
 * Wspiera 6 wzorcow oddychania jak w glownej aplikacji.
 */

import SwiftUI
import WatchKit

// MARK: - Breathing Patterns

enum BreathingPattern: String, CaseIterable, Identifiable {
    case relaxing = "Relaxing"      // 4-7-8
    case balanced = "Balanced"      // 4-4-4-4
    case calming = "Calming"        // 4-6
    case energizing = "Energizing"  // 2-2
    case focus = "Focus"            // 4-4-6
    case sleep = "Sleep"            // 4-7-8-2

    var id: String { rawValue }

    // Fazy: [inhale, hold1, exhale, hold2] w sekundach
    var phases: [Int] {
        switch self {
        case .relaxing:   return [4, 7, 8, 0]
        case .balanced:   return [4, 4, 4, 4]
        case .calming:    return [4, 0, 6, 0]
        case .energizing: return [2, 0, 2, 0]
        case .focus:      return [4, 4, 6, 0]
        case .sleep:      return [4, 7, 8, 2]
        }
    }

    var totalCycleDuration: Int {
        phases.reduce(0, +)
    }
}

// MARK: - Breathing Phase

enum BreathingPhase: String {
    case inhale = "Inhale"
    case holdIn = "Hold"
    case exhale = "Exhale"
    case holdOut = "Rest"

    var color: Color {
        switch self {
        case .inhale:  return Color(hex: "70C0FF") // accentColors.blue[400]
        case .holdIn:  return Color(hex: "B7A0FF") // accentColors.purple[400]
        case .exhale:  return Color(hex: "5ED9B5") // accentColors.mint[400]
        case .holdOut: return Color(hex: "8E8E93") // neutralColors.gray[500]
        }
    }

    var hapticType: WKHapticType {
        switch self {
        case .inhale:  return .directionUp
        case .holdIn:  return .click
        case .exhale:  return .directionDown
        case .holdOut: return .click
        }
    }
}

// MARK: - Breathing Guide View

struct BreathingGuideView: View {
    @State private var selectedPattern: BreathingPattern = .relaxing
    @State private var isActive = false
    @State private var currentPhase: BreathingPhase = .inhale
    @State private var phaseProgress: Double = 0
    @State private var cycleCount = 0
    @State private var breathScale: CGFloat = 0.6

    private let brandPurple = Color(hex: "8B5CF6")
    private let maxCycles = 10

    var body: some View {
        VStack(spacing: 8) {
            if isActive {
                activeBreathingView
            } else {
                patternSelectionView
            }
        }
        .navigationTitle("Breathe")
    }

    // MARK: - Pattern Selection

    private var patternSelectionView: some View {
        VStack(spacing: 12) {
            // Pattern picker
            Picker("Pattern", selection: $selectedPattern) {
                ForEach(BreathingPattern.allCases) { pattern in
                    Text(pattern.rawValue).tag(pattern)
                }
            }
            .pickerStyle(.wheel)
            .frame(height: 60)

            // Pattern info
            Text(patternDescription)
                .font(.caption2)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)

            // Start button
            Button(action: startBreathing) {
                HStack {
                    Image(systemName: "wind")
                    Text("Start")
                }
                .font(.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 8)
                .background(brandPurple)
                .cornerRadius(12)
            }
            .buttonStyle(.plain)
        }
    }

    private var patternDescription: String {
        let phases = selectedPattern.phases
        var parts: [String] = []
        if phases[0] > 0 { parts.append("In \(phases[0])s") }
        if phases[1] > 0 { parts.append("Hold \(phases[1])s") }
        if phases[2] > 0 { parts.append("Out \(phases[2])s") }
        if phases[3] > 0 { parts.append("Rest \(phases[3])s") }
        return parts.joined(separator: " · ")
    }

    // MARK: - Active Breathing

    private var activeBreathingView: some View {
        VStack(spacing: 8) {
            // Breathing circle
            ZStack {
                // Outer ring
                Circle()
                    .stroke(currentPhase.color.opacity(0.3), lineWidth: 4)
                    .frame(width: 100, height: 100)

                // Animated breath circle
                Circle()
                    .fill(
                        RadialGradient(
                            colors: [currentPhase.color, currentPhase.color.opacity(0.3)],
                            center: .center,
                            startRadius: 0,
                            endRadius: 50
                        )
                    )
                    .frame(width: 80 * breathScale, height: 80 * breathScale)
                    .animation(.easeInOut(duration: Double(currentPhaseDuration)), value: breathScale)
            }

            // Phase label
            Text(currentPhase.rawValue)
                .font(.title3)
                .fontWeight(.semibold)
                .foregroundColor(currentPhase.color)

            // Cycle counter
            Text("Cycle \(cycleCount + 1) / \(maxCycles)")
                .font(.caption2)
                .foregroundColor(.secondary)

            // Stop button
            Button(action: stopBreathing) {
                Image(systemName: "xmark.circle.fill")
                    .font(.title2)
                    .foregroundColor(.red.opacity(0.7))
            }
            .buttonStyle(.plain)
        }
    }

    private var currentPhaseDuration: Int {
        let phases = selectedPattern.phases
        switch currentPhase {
        case .inhale:  return phases[0]
        case .holdIn:  return phases[1]
        case .exhale:  return phases[2]
        case .holdOut: return phases[3]
        }
    }

    // MARK: - Actions

    private func startBreathing() {
        isActive = true
        cycleCount = 0
        startPhase(.inhale)
    }

    private func stopBreathing() {
        isActive = false
        currentPhase = .inhale
        breathScale = 0.6
    }

    private func startPhase(_ phase: BreathingPhase) {
        guard isActive else { return }

        let phases = selectedPattern.phases
        let phaseIndex: Int
        let duration: Int

        switch phase {
        case .inhale:
            phaseIndex = 0
            breathScale = 1.0
        case .holdIn:
            phaseIndex = 1
            breathScale = 1.0
        case .exhale:
            phaseIndex = 2
            breathScale = 0.6
        case .holdOut:
            phaseIndex = 3
            breathScale = 0.6
        }

        duration = phases[phaseIndex]

        // Skip phase if duration is 0
        if duration == 0 {
            moveToNextPhase(from: phase)
            return
        }

        currentPhase = phase

        // Haptic feedback
        WKInterfaceDevice.current().play(phase.hapticType)

        // Schedule next phase
        DispatchQueue.main.asyncAfter(deadline: .now() + Double(duration)) {
            self.moveToNextPhase(from: phase)
        }
    }

    private func moveToNextPhase(from phase: BreathingPhase) {
        guard isActive else { return }

        switch phase {
        case .inhale:
            startPhase(.holdIn)
        case .holdIn:
            startPhase(.exhale)
        case .exhale:
            startPhase(.holdOut)
        case .holdOut:
            cycleCount += 1
            if cycleCount >= maxCycles {
                completeBreathing()
            } else {
                startPhase(.inhale)
            }
        }
    }

    private func completeBreathing() {
        // Final haptic
        WKInterfaceDevice.current().play(.success)
        stopBreathing()
    }
}

#Preview {
    BreathingGuideView()
}
