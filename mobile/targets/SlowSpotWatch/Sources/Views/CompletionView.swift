/**
 * CompletionView
 *
 * Widok wyswietlany po zakonczeniu sesji medytacji.
 * Pokazuje gratulacje i statystyki.
 */

import SwiftUI

struct CompletionView: View {
    let completedDuration: Int
    let onDismiss: () -> Void

    private let brandPurple = Color(hex: "8B5CF6")
    private let successGreen = Color(hex: "34D399")

    var body: some View {
        VStack(spacing: 12) {
            // Success icon
            ZStack {
                Circle()
                    .fill(successGreen.opacity(0.2))
                    .frame(width: 60, height: 60)

                Image(systemName: "checkmark.circle.fill")
                    .font(.system(size: 40))
                    .foregroundColor(successGreen)
            }

            // Congratulations text
            Text("Well Done!")
                .font(.headline)
                .foregroundColor(.primary)

            // Duration
            Text(formatDuration(completedDuration))
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(brandPurple)

            Text("of mindfulness")
                .font(.caption)
                .foregroundColor(.secondary)

            // Done button
            Button(action: onDismiss) {
                Text("Done")
                    .font(.body)
                    .fontWeight(.medium)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(brandPurple)
                    .cornerRadius(10)
            }
            .buttonStyle(.plain)
            .padding(.top, 4)
        }
        .padding()
    }

    private func formatDuration(_ seconds: Int) -> String {
        let minutes = seconds / 60
        if minutes < 60 {
            return "\(minutes) min"
        } else {
            let hours = minutes / 60
            let remainingMinutes = minutes % 60
            return "\(hours)h \(remainingMinutes)m"
        }
    }
}

#Preview {
    CompletionView(completedDuration: 600) {
        // dismiss
    }
}
