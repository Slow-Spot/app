/**
 * Extensions
 *
 * Rozszerzenia Swift dla typow podstawowych.
 */

import SwiftUI

// MARK: - Color Extension

extension Color {
    /**
     * Inicjalizuje Color z kodu hex.
     * Wspiera formaty: "8B5CF6", "#8B5CF6"
     */
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)

        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Brand Colors

/**
 * Kolory marki Slow Spot - zsynchronizowane z design system
 * Zrodlo: mobile/src/theme/colors.ts
 */
struct BrandColors {
    // Brand purple gradient
    static let purpleLight = Color(hex: "6366F1")    // brandColors.purple.light
    static let purplePrimary = Color(hex: "8B5CF6")  // brandColors.purple.primary
    static let purpleDark = Color(hex: "A855F7")     // brandColors.purple.dark

    // Accent colors
    static let gold = Color(hex: "FCD34D")           // brandColors.accent.gold

    // Neutral colors
    static let white = Color.white
    static let textPrimary = Color(hex: "1C1C1E")    // neutralColors.charcoal[200]
    static let textSecondary = Color(hex: "48484A")  // neutralColors.gray[700]
    static let textTertiary = Color(hex: "636366")   // neutralColors.gray[600]

    // Meditation state colors
    static let breatheInhale = Color(hex: "70C0FF")  // accentColors.blue[400]
    static let breatheHold = Color(hex: "B7A0FF")    // accentColors.purple[400]
    static let breatheExhale = Color(hex: "5ED9B5")  // accentColors.mint[400]
    static let breatheRest = Color(hex: "8E8E93")    // neutralColors.gray[500]
}
