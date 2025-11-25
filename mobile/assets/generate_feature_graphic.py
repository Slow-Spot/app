#!/usr/bin/env python3
"""
Generate Google Play Feature Graphic (1024x500) for Slow Spot
"""
from PIL import Image, ImageDraw, ImageFilter
import math

def create_gradient_background(size, color1, color2):
    """Create a horizontal gradient background"""
    image = Image.new('RGB', size)

    for x in range(size[0]):
        # Calculate gradient ratio
        ratio = x / size[0]
        # Interpolate colors
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)

        # Draw vertical line with interpolated color
        for y in range(size[1]):
            image.putpixel((x, y), (r, g, b))

    return image

def draw_lotus(draw, center_x, center_y, size, color):
    """Draw a stylized lotus flower"""
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
        draw.ellipse(bbox, fill=color)

    # Draw center circle
    center_size = size // 3
    bbox = [
        center_x - center_size // 2,
        center_y - center_size // 2,
        center_x + center_size // 2,
        center_y + center_size // 2
    ]
    draw.ellipse(bbox, fill=color)

def draw_zen_circle(draw, center_x, center_y, radius, color, thickness=15):
    """Draw an enso (zen circle)"""
    # Draw incomplete circle (enso style - gap at top)
    for angle in range(15, 345, 2):  # Leave gap at top
        rad = angle * math.pi / 180
        x1 = center_x + math.cos(rad) * radius
        y1 = center_y + math.sin(rad) * radius

        draw.ellipse([x1-2, y1-2, x1+2, y1+2], fill=color)

def create_feature_graphic(filename):
    """Create 1024x500 Google Play feature graphic"""
    width, height = 1024, 500

    # Calming gradient: teal to purple (matching app theme)
    color1 = (102, 126, 234)   # #667eea (soft blue)
    color2 = (150, 84, 242)    # #9654f2 (soft purple)

    # Create gradient background
    image = create_gradient_background((width, height), color1, color2)
    draw = ImageDraw.Draw(image, 'RGBA')

    # Load and place app icon on left side
    try:
        icon = Image.open('icon.png')
        # Resize icon to fit feature graphic height with padding
        icon_size = int(height * 0.7)  # 70% of height = 350px
        icon = icon.resize((icon_size, icon_size), Image.Resampling.LANCZOS)

        # Position icon on left side with padding
        icon_x = int(height * 0.15)  # 15% padding
        icon_y = (height - icon_size) // 2

        # Paste icon with transparency
        image.paste(icon, (icon_x, icon_y), icon if icon.mode == 'RGBA' else None)
    except FileNotFoundError:
        # If icon.png doesn't exist, draw lotus manually
        lotus_x = int(height * 0.4)
        lotus_y = height // 2
        lotus_size = int(height * 0.5)

        draw_lotus(draw, lotus_x, lotus_y, lotus_size, (255, 255, 255, 230))
        draw_zen_circle(draw, lotus_x, lotus_y, int(height * 0.3), (255, 255, 255, 180), 12)

    # Draw decorative elements on the right side
    # Add subtle zen circles as decoration
    for i, offset in enumerate([0.65, 0.78, 0.91]):
        circle_x = int(width * offset)
        circle_y = height // 2
        radius = 40 - (i * 10)
        opacity = 100 - (i * 20)

        draw_zen_circle(draw, circle_x, circle_y, radius, (255, 255, 255, opacity), 8)

    # Add small decorative lotus elements
    for i, (x_offset, y_offset) in enumerate([(0.7, 0.3), (0.82, 0.7), (0.93, 0.5)]):
        x = int(width * x_offset)
        y = int(height * y_offset)
        size = 30 - (i * 5)

        draw_lotus(draw, x, y, size, (255, 255, 255, 120 - i * 30))

    # Apply subtle smoothing
    image = image.filter(ImageFilter.SMOOTH)

    # Save the image
    image.save(filename, 'PNG', quality=100, optimize=True)
    print(f"✅ Created {filename} (1024x500)")
    print("   This feature graphic can be uploaded to Google Play Console")

if __name__ == '__main__':
    import os

    # Change to assets directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    print("🎨 Generating Google Play Feature Graphic...")
    print("=" * 50)

    create_feature_graphic('feature-graphic.png')

    print("=" * 50)
    print("✅ Feature graphic generated successfully!")
    print("\nNext steps:")
    print("  1. Review: Open assets/feature-graphic.png")
    print("  2. Upload: Google Play Console → Store listing → Graphic assets")
    print("  3. Required: Must be 1024x500 PNG or JPEG")
    print("\nNote: You may want to add text overlay using Figma/Photoshop:")
    print("  • App name: 'Slow Spot'")
    print("  • Tagline: 'Meditation & Mindfulness'")
    print("  • Key features with icons")
