# Plan: Refaktoryzacja Haptyki na 3 Osobne Opcje

## Problem
Obecnie mamy jedną opcję `vibrationEnabled` która kontroluje całą haptykę. To nie jest optymalne, ponieważ użytkownik może chcieć:
- Haptykę przy starcie/końcu sesji, ale nie przy oddychaniu
- Haptykę oddychania bez wibracji przy dzwonkach
- Dzwonki interwałowe z haptyka, ale bez haptyki oddychania

## Rozwiązanie: 3 Niezależne Opcje Haptyki

### 1. Haptyka Sesji (Start/Koniec) - `sessionHaptics`
**Lokalizacja w UI:** W sekcji "Dzwonki" (Bells) - osobny toggle
**Domyślnie:** `true` (włączona)
**Opis:** Delikatna wibracja przy:
- Rozpoczęciu sesji
- Zakończeniu sesji (wraz z końcowym dzwonkiem)

**Implementacja:**
- Nowa właściwość `sessionHaptics?: boolean` w `CustomSessionConfig`
- Haptyka przy końcu sesji (w `playChime` dla końcowego dzwonka)

### 2. Haptyka Wzorca Oddechowego - `breathingHaptics`
**Lokalizacja w UI:** W sekcji "Wzorzec oddechowy" - pojawia się gdy wzorzec ≠ 'none'
**Domyślnie:** `true` (włączona)
**Opis:** Pulsująca wibracja synchronizowana z fazami oddychania:
- Wdech: narastająca intensywność
- Zatrzymanie: delikatne, równomierne pulsowanie
- Wydech: malejąca intensywność

**Implementacja:**
- Nowa właściwość `breathingHaptics?: boolean` w `CustomSessionConfig`
- Używana w `triggerBreathingHaptic()` i `startContinuousHaptic()`
- Pokazywana tylko gdy `breathingPattern !== 'none'`

### 3. Haptyka Dzwonków Interwałowych - `intervalBellHaptics`
**Lokalizacja w UI:** W sekcji "Dzwonki interwałowe" - pojawia się gdy `intervalBellEnabled === true`
**Domyślnie:** `true` (włączona)
**Opis:** Wibracja przy każdym dzwonku interwałowym

**Implementacja:**
- Nowa właściwość `intervalBellHaptics?: boolean` w `CustomSessionConfig`
- Używana w `playChime()` dla dzwonków interwałowych

## Zmiany w Plikach

### 1. `src/services/customSessionStorage.ts`
```typescript
export interface CustomSessionConfig {
  // ... istniejące pola ...

  // Zastąpienie vibrationEnabled trzema nowymi opcjami:
  /** @deprecated Use sessionHaptics, breathingHaptics, intervalBellHaptics instead */
  vibrationEnabled?: boolean; // Zachowane dla wstecznej kompatybilności

  /** Haptic feedback at session start/end */
  sessionHaptics?: boolean;

  /** Haptic feedback synchronized with breathing phases */
  breathingHaptics?: boolean;

  /** Haptic feedback for interval bells */
  intervalBellHaptics?: boolean;
}
```

**Migracja:** Jeśli `vibrationEnabled` jest ustawione a nowe pola nie, użyj wartości `vibrationEnabled` dla wszystkich trzech.

### 2. `src/screens/CustomSessionBuilderScreen.tsx`

**Stan:**
```typescript
// Zastąpienie:
// const [vibrationEnabled, setVibrationEnabled] = useState(initialConfig?.vibrationEnabled ?? true);

// Na:
const [sessionHaptics, setSessionHaptics] = useState(
  initialConfig?.sessionHaptics ?? initialConfig?.vibrationEnabled ?? true
);
const [breathingHaptics, setBreathingHaptics] = useState(
  initialConfig?.breathingHaptics ?? initialConfig?.vibrationEnabled ?? true
);
const [intervalBellHaptics, setIntervalBellHaptics] = useState(
  initialConfig?.intervalBellHaptics ?? initialConfig?.vibrationEnabled ?? true
);
```

**UI - Sekcja Dzwonki (Bells):**
```
┌─────────────────────────────────────────────────┐
│ 🔔 Dzwonki                                      │
│                                                 │
│ Dzwonek końcowy          [========●]            │
│ Delikatny dźwięk na zakończenie                 │
│ ─────────────────────────────────               │
│ Wibracja sesji           [========●]            │  ← NOWE
│ Wibracja przy starcie i końcu sesji             │
│ ─────────────────────────────────               │
│ Ukryj licznik            [========●]            │
│ ─────────────────────────────────               │
│ Dzwonki interwałowe      [○========]            │
│                                                 │
│   (gdy włączone:)                               │
│   ┌─────────────────────────────────────────┐   │
│   │ Co ile minut: [3] [5] [10]   [__] min   │   │
│   │ ─────────────────────────────────       │   │
│   │ Wibracja dzwonków    [========●]        │   │  ← NOWE
│   │ Wibracja przy dzwonkach interwałowych   │   │
│   └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

**UI - Sekcja Wzorzec Oddechowy:**
```
┌─────────────────────────────────────────────────┐
│ 💨 Wzorzec oddechowy                            │
│                                                 │
│ [Bez instrukcji] [Box] [4-7-8] [Equal] [Calm]   │
│                                                 │
│   (gdy wybrany wzorzec ≠ 'none':)               │
│   ─────────────────────────────────             │
│   Wibracja oddechowa     [========●]            │  ← NOWE
│   Pulsująca wibracja synchronizowana z oddechem │
└─────────────────────────────────────────────────┘
```

### 3. `src/components/MeditationTimer.tsx`

**Props:**
```typescript
interface MeditationTimerProps {
  // ... istniejące props ...

  // Zastąpienie:
  // vibrationEnabled?: boolean;

  // Na:
  sessionHaptics?: boolean;
  breathingHaptics?: boolean;
  intervalBellHaptics?: boolean;
}
```

**Logika:**
- `playChime()` - użyj `intervalBellHaptics` dla dzwonków interwałowych, `sessionHaptics` dla końcowego
- `triggerBreathingHaptic()` - użyj `breathingHaptics`
- `startContinuousHaptic()` - użyj `breathingHaptics`

### 4. `src/screens/MeditationScreen.tsx`
Przekaż nowe props do `MeditationTimer`:
```typescript
<MeditationTimer
  // ... inne props ...
  sessionHaptics={config.sessionHaptics}
  breathingHaptics={config.breathingHaptics}
  intervalBellHaptics={config.intervalBellHaptics}
/>
```

### 5. Tłumaczenia (wszystkie locale files)
Nowe klucze:
```json
{
  "custom": {
    "sessionHaptics": "Wibracja sesji",
    "sessionHapticsHint": "Wibracja przy starcie i końcu sesji",
    "breathingHaptics": "Wibracja oddechowa",
    "breathingHapticsHint": "Pulsująca wibracja synchronizowana z fazami oddychania",
    "intervalBellHaptics": "Wibracja dzwonków",
    "intervalBellHapticsHint": "Wibracja przy dzwonkach interwałowych"
  }
}
```

### 6. `DEFAULT_EVIDENCE_BASED_SESSION` w customSessionStorage.ts
```typescript
export const DEFAULT_EVIDENCE_BASED_SESSION: CustomSessionConfig = {
  // ... istniejące pola ...
  sessionHaptics: true,      // Delikatny feedback na start/koniec
  breathingHaptics: true,    // Pomaga w synchronizacji oddychania
  intervalBellHaptics: true, // Używane tylko gdy intervalBellEnabled=true
  // vibrationEnabled: true, // deprecated, zachowane dla migracji
};
```

## Wsteczna Kompatybilność
- Stare sesje z `vibrationEnabled` będą działać - wartość ta zostanie użyta jako fallback dla wszystkich trzech nowych opcji
- Nowe sesje będą zapisywać tylko nowe pola
- Po edycji starej sesji, zostanie zmigrowana do nowego formatu

## Kolejność Implementacji
1. ✅ Zdefiniuj nowe typy w `customSessionStorage.ts`
2. ✅ Dodaj stany w `CustomSessionBuilderScreen.tsx`
3. ✅ Zaktualizuj UI w `CustomSessionBuilderScreen.tsx`
4. ✅ Zaktualizuj props i logikę w `MeditationTimer.tsx`
5. ✅ Przekaż props w `MeditationScreen.tsx`
6. ✅ Dodaj tłumaczenia do wszystkich locale files
7. ✅ Zaktualizuj `DEFAULT_EVIDENCE_BASED_SESSION`
