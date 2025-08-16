# SignBridge (Expo SDK 54)

Modern learning app for sign language recognition practice. Features:

- Firebase Auth (email/password & Google planned) with persistent session
- Quests (per-letter practice) awarding XP & leveling system (mocked inference)
- Leaderboard (mock data placeholder)
- Profile & progress tracking stored locally
- Modular architecture with Expo Router route groups
- Theming via styled-components (colors + typography)
- Mock AI prediction service to be replaced by TensorFlow.js later

## Getting Started

1. Copy env file:
```
cp .env.example .env
```
Fill in your real Firebase api key.

2. Install deps:
```
npm install
```

3. Run:
```
npm start
```
Open in Expo Go.

## Structure
- `app/` route groups `(auth)` & `(app)` for gating
- `src/services/firebase.ts` lazy init
- `src/services/predict.ts` mock inference
- `src/store/progress.ts` zustand store with AsyncStorage persistence

## Next Steps
- Integrate Google OAuth (Firebase + expo-auth-session)
- Add offline TFJS model loading & warmup screen
- Add achievements system & server sync to Realtime DB
- Implement real leaderboard backed by Firebase
- Add image cropping / hand detection pre-processing
- Add accessibility & haptics feedback

## Replacing Mock AI
Create `src/services/model.ts` to load tfjs model (e.g. `@tensorflow/tfjs-react-native`). Preprocess image to tensor, run `model.predict`, map logits to letters.

## License
MIT
