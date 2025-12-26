# Notification Sounds

This directory contains sound files for notification alerts.

## Sound Files

- `notification-normal.mp3` - Standard notification sound (gentle blep)
- `notification-action.mp3` - Action notification sound (more urgent blep)
- `notification-critical.mp3` - Critical notification sound (urgent alert)
- `notification-success.mp3` - Success/completion sound (positive chime)

## Usage

These sounds are used by the `useNotificationSounds` hook to provide audio feedback for different types of notifications based on:

- **Priority**: Critical notifications use urgent sounds
- **Type**: Action notifications use distinct sounds
- **Completion**: Success actions use positive sounds
- **Metadata**: Notifications can specify custom sound preferences

## Sound Selection Logic

1. **Critical Priority** → `notification-critical.mp3`
2. **Action Notifications** → `notification-action.mp3`
3. **Success/Completion** → `notification-success.mp3`
4. **Default** → `notification-normal.mp3`

## Metadata Support

Notifications can control sound behavior via metadata:

```json
{
  "soundConfig": {
    "enabled": true,
    "customSound": "/sounds/custom.mp3",
    "volume": 0.8
  }
}
```
