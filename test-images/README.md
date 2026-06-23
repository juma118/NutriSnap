# Test meal photos

Five real meal photos for testing the **＋ Snap a meal → 🖼️ Library → Analyze**
flow. Verified to work — e.g. `meal5.jpg` analyzes as *"Baked Salmon with
Roasted Tomatoes and Slaw — 520 kcal, 42g protein, health 9/10"*.

| File | Dish |
|------|------|
| `meal1.jpg` | Polish chicken soup (Rosół) |
| `meal2.jpg` | Chicken wings with cumin, lemon & garlic |
| `meal3.jpg` | Thai-style fish broth with greens |
| `meal4.jpg` | Dolma (stuffed vine leaves) |
| `meal5.jpg` | Baked salmon with fennel & tomatoes |

> Source: [TheMealDB](https://www.themealdb.com) (free to use).

## Get them onto your test device

**Android emulator** (easiest with `adb`):
```bash
adb push test-images/. /sdcard/Pictures/
# then, if they don't appear in the gallery, trigger a media rescan:
adb shell "content call --uri content://media/external/file --method scan_volume" 2>/dev/null || \
adb shell am broadcast -a android.intent.action.MEDIA_MOUNTED -d file:///sdcard/Pictures
```
…or just **drag-and-drop** a `.jpg` onto the emulator window.

**iOS simulator:** drag-and-drop a `.jpg` onto the simulator — it saves to Photos.

**Physical phone (Expo Go):** transfer the files to your phone (Google Drive,
email, messaging app) and save to Photos, then pick them in the app via
**🖼️ Library**. Or simply use **📷 Camera** on real food — that's what the app is for!

Then in the app: **＋ Snap a meal → 🖼️ Library →** choose a photo **→ 🧠 Analyze nutrition**.
