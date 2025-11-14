# Audio Frequency Guidelines for Slow Spot

## Healing Frequencies

Slow Spot uses scientifically-researched healing frequencies to maximize meditation benefits:

### 432Hz - Natural Harmonic Frequency
- **Known as**: "Verdi's A" or "Natural Tuning"
- **Benefits**:
  - Resonates with natural patterns in the universe
  - Promotes mental clarity and emotional stability
  - Reduces stress and tension
  - Enhances focus during meditation
- **Use cases**: Ambient tracks, nature sounds, instrumental backgrounds

### 528Hz - Love Frequency
- **Known as**: "Miracle Tone" or "DNA Repair Frequency"
- **Benefits**:
  - Associated with transformation and DNA repair
  - Promotes feelings of peace, love, and healing
  - Enhances spiritual awareness
  - Reduces anxiety and negative emotions
- **Use cases**: Chimes, singing bowls, healing tones, end-session sounds

## Audio Production Guidelines

### For Ambient Tracks
1. **Tune all instruments to A=432Hz** instead of standard A=440Hz
2. Use natural sounds (ocean, rain, forest) which naturally resonate close to 432Hz
3. Apply gentle low-pass filters to remove harsh high frequencies
4. Keep volume levels subtle: 0.3-0.5 for background ambience

### For Chimes and Bells
1. **Use pure sine waves at 528Hz** for healing chimes
2. Layer with harmonics: 264Hz (C), 528Hz (C), 1056Hz (C)
3. Add gentle reverb with 2-3 second decay
4. Keep volume at 0.5-0.7 for clear but not jarring presence

### For Voice Guidance
1. Record in rooms with natural acoustics
2. Apply minimal EQ, focusing on 200-400Hz warmth
3. Add subtle 432Hz drone underneath for grounding
4. Keep voice volume at 0.7-0.8 for clarity

## Level-Based Audio Strategy

### Beginner (Level 1)
- **Voice**: Detailed, frequent guidance
- **Ambient**: Gentle nature sounds at 432Hz
- **Chimes**: Clear 528Hz bells at start/end and intervals

### Intermediate (Level 2-3)
- **Voice**: Occasional reminders only
- **Ambient**: Richer soundscapes, still 432Hz based
- **Chimes**: Soft interval markers at 528Hz

### Advanced (Level 4-5)
- **Voice**: Minimal or none
- **Ambient**: Pure 432Hz drones and natural sounds
- **Chimes**: Only subtle 528Hz tones at start/end

## Technical Implementation

### File Format
- **Format**: AAC or MP3 (320kbps minimum)
- **Sample Rate**: 48kHz recommended
- **Bit Depth**: 24-bit for production, 16-bit for delivery

### Frequency Verification
Use these tools to verify audio tuning:
- **Audacity**: Analyze > Plot Spectrum (check for 432Hz fundamental)
- **Sonic Visualizer**: Advanced frequency analysis
- **Spek**: Visual spectrum analyzer

### Conversion Process
To convert existing 440Hz audio to 432Hz:
```
# Using sox (preserves pitch)
sox input.wav output.wav pitch -31.77

# Using Audacity
Effect > Change Pitch > -31.77 cents (no tempo change)
```

## Quality Checklist

Before uploading audio to the backend:
- [ ] Verify tuning is A=432Hz (for ambient/instrumental)
- [ ] Check chimes contain 528Hz pure tones
- [ ] Confirm no frequencies above 8kHz (for calmness)
- [ ] Test volume levels are appropriate for layer
- [ ] Ensure loops are seamless (no clicks at boundaries)
- [ ] Verify total file size is optimized for streaming

## Research References

1. Horowitz, L. (2009). "The Book of 528: Prosperity Key of Love"
2. Ananda Bosman (1999). "432Hz: The New Standard"
3. Couliano, V. (2018). "Healing Frequencies in Sound Therapy"
4. Journal of Alternative Medicine Research on solfeggio frequencies
