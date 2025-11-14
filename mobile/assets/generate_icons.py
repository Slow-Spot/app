#!/usr/bin/env python3
"""
Generate beautiful meditation app icons with lotus and zen circle designs
"""
from PIL import Image, ImageDraw, ImageFilter
import math

def create_gradient_background(size, color1, color2):
    """Create a radial gradient background"""
    image = Image.new('RGB', size)
    draw = ImageDraw.Draw(image)

    center_x, center_y = size[0] // 2, size[1] // 2
    max_radius = math.sqrt(center_x**2 + center_y**2)

    for y in range(size[1]):
        for x in range(size[0]):
            # Calculate distance from center
            distance = math.sqrt((x - center_x)**2 + (y - center_y)**2)
            # Normalize distance
            ratio = distance / max_radius
            # Interpolate colors
            r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
            g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
            b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
            image.putpixel((x, y), (r, g, b))

    return image

def draw_lotus(draw, center_x, center_y, size, color):
    """Draw a stylized lotus flower"""
    petal_color = color

    # Draw outer petals (8 petals)
    for i in range(8):
        angle = (i * 45) * math.pi / 180
        petal_width = size // 3
        petal_height = size // 2

        # Calculate petal position
        x = center_x + math.cos(angle) * (size // 4)
        y = center_y + math.sin(angle) * (size // 4)

        # Draw ellipse for petal
        bbox = [
            x - petal_width // 2,
            y - petal_height // 2,
            x + petal_width // 2,
            y + petal_height // 2
        ]
        draw.ellipse(bbox, fill=petal_color)

    # Draw center circle
    center_size = size // 3
    bbox = [
        center_x - center_size // 2,
        center_y - center_size // 2,
        center_x + center_size // 2,
        center_y + center_size // 2
    ]
    draw.ellipse(bbox, fill=petal_color)

def draw_zen_circle(draw, center_x, center_y, radius, color, thickness=20):
    """Draw an enso (zen circle)"""
    # Draw incomplete circle (enso style - gap at top)
    for angle in range(15, 345, 2):  # Leave gap at top
        rad = angle * math.pi / 180
        x1 = center_x + math.cos(rad) * radius
        y1 = center_y + math.sin(rad) * radius
        x2 = center_x + math.cos(rad) * (radius - thickness)
        y2 = center_y + math.sin(rad) * (radius - thickness)

        draw.ellipse([x1-2, y1-2, x1+2, y1+2], fill=color)

def create_app_icon(size, filename):
    """Create main app icon with lotus design"""
    # Calming gradient: teal to purple
    color1 = (94, 114, 228)   # Soft blue
    color2 = (142, 84, 233)   # Soft purple

    image = create_gradient_background((size, size), color1, color2)
    draw = ImageDraw.Draw(image, 'RGBA')

    # Draw lotus
    center = size // 2
    lotus_size = int(size * 0.6)
    draw_lotus(draw, center, center, lotus_size, (255, 255, 255, 230))

    # Add zen circle around lotus
    draw_zen_circle(draw, center, center, int(size * 0.45), (255, 255, 255, 180), int(size * 0.03))

    # Apply subtle blur for smoothness
    image = image.filter(ImageFilter.SMOOTH)

    # Convert to RGBA and add alpha channel for rounded corners (iOS style)
    image = image.convert('RGBA')

    image.save(filename, 'PNG', quality=100)
    print(f"Created {filename} ({size}x{size})")

def create_splash_icon(size, filename):
    """Create splash screen icon - simpler design"""
    # Lighter gradient for splash
    color1 = (124, 144, 255)  # Light blue
    color2 = (172, 114, 255)  # Light purple

    image = create_gradient_background((size, size), color1, color2)
    draw = ImageDraw.Draw(image, 'RGBA')

    # Draw simple zen circle
    center = size // 2
    draw_zen_circle(draw, center, center, int(size * 0.4), (255, 255, 255, 200), int(size * 0.04))

    # Add small lotus in center
    lotus_size = int(size * 0.3)
    draw_lotus(draw, center, center, lotus_size, (255, 255, 255, 220))

    image = image.filter(ImageFilter.SMOOTH)
    image = image.convert('RGBA')

    image.save(filename, 'PNG', quality=100)
    print(f"Created {filename} ({size}x{size})")

def create_favicon(filename):
    """Create favicon - simplified icon"""
    size = 48

    # Simple solid color background
    color1 = (108, 128, 240)
    color2 = (156, 98, 240)

    image = create_gradient_background((size, size), color1, color2)
    draw = ImageDraw.Draw(image, 'RGBA')

    # Draw simple lotus
    center = size // 2
    lotus_size = int(size * 0.7)
    draw_lotus(draw, center, center, lotus_size, (255, 255, 255, 255))

    image = image.convert('RGBA')
    image.save(filename, 'PNG', quality=100)
    print(f"Created {filename} ({size}x{size})")

if __name__ == '__main__':
    import os

    # Change to assets directory
    script_dir = os.path.dirname(os.path.abspath(__file__))

    print("🎨 Generating Slow Spot meditation app icons...")
    print("=" * 50)

    # Create main app icon (1024x1024 for iOS/Android)
    create_app_icon(1024, os.path.join(script_dir, 'icon.png'))

    # Create adaptive icon (Android)
    create_app_icon(1024, os.path.join(script_dir, 'adaptive-icon.png'))

    # Create splash icon
    create_splash_icon(1024, os.path.join(script_dir, 'splash-icon.png'))

    # Create favicon
    create_favicon(os.path.join(script_dir, 'favicon.png'))

    print("=" * 50)
    print("✅ All icons generated successfully!")
    print("\nGenerated icons:")
    print("  • icon.png (1024x1024) - Main app icon")
    print("  • adaptive-icon.png (1024x1024) - Android adaptive icon")
    print("  • splash-icon.png (1024x1024) - Splash screen")
    print("  • favicon.png (48x48) - Web favicon")
