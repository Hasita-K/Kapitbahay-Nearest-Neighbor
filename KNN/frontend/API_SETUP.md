# Frontend API address

The app reads `EXPO_PUBLIC_API_URL` to find the Express backend. Create a
`KNN/frontend/.env` file with:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

`localhost` works when the app and backend run on the same computer (for
example, Expo web or an iOS simulator). For a physical phone, replace it with
your computer's LAN IP address, such as `http://192.168.1.20:3000`, and keep
the phone and computer on the same network. Restart Expo after changing this
value.
