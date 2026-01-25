/**
 * TimerView
 *
 * Widok aktywnej sesji medytacji z circular progress.
 * Pokazuje czas, przycisk pauzy i przycisk zakonczenia.
 */

import SwiftUI

struct TimerView: View {
    @EnvironmentObject var timerManager: TimerManager

    // Brand colors - zsynchronizowane z design system
    private let brandPurple = Color(hex: "8B5CF6")
    private let brandPurpleLight = Color(hex: "A78BFA")
    private let brandPurpleDark = Color(hex: "7C3AED")

    var body: some View {
        VStack(spacing: 8) {
            // Circular Timer
            ZStack {
                // Background circle
                Circle()
                    .stroke(brandPurple.opacity(0.2), lineWidth: 8)

                // Progress circle
                Circle()
                    .trim(from: 0, to: timerManager.progress)
                    .stroke(
                        LinearGradient(
                            colors: [brandPurpleLight, brandPurple, brandPurpleDark],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        style: StrokeStyle(lineWidth: 8, lineCap: .round)
                    )
                    .rotationEffect(.degrees(-90))
                    .animation(.linear(duration: 0.5), value: timerManager.progress)

                // Time display
                VStack(spacing: 2) {
                    Text(timerManager.formattedTime)
                        .font(.system(size: 32, weight: .semibold, design: .rounded))
                        .monospacedDigit()
                        .foregroundColor(.primary)

                    Text(timerManager.isPaused ? "Paused" : "In Session")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
            .frame(width: 130, height: 130)
            .padding(.top, 8)

            // Controls
            HStack(spacing: 16) {
                // End button
                Button(action: {
                    timerManager.stopSession()
                }) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.title2)
                        .foregroundColor(.red.opacity(0.8))
                }
                .buttonStyle(.plain)

                // Play/Pause button
                Button(action: {
                    if timerManager.isPaused {
                        timerManager.resumeSession()
                    } else {
                        timerManager.pauseSession()
                    }
                }) {
                    Image(systemName: timerManager.isPaused ? "play.circle.fill" : "pause.circle.fill")
                        .font(.largeTitle)
                        .foregroundColor(brandPurple)
                }
                .buttonStyle(.plain)

                // Extend button (+1 min)
                Button(action: {
                    timerManager.extendSession(by: 60)
                }) {
                    Image(systemName: "plus.circle.fill")
                        .font(.title2)
                        .foregroundColor(brandPurpleLight)
                }
                .buttonStyle(.plain)
            }
            .padding(.bottom, 8)
        }
        .navigationBarBackButtonHidden(true)
    }
}

#Preview {
    TimerView()
        .environmentObject(TimerManager())
}
