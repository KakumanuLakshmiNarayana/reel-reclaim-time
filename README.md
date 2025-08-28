# 🧠 FocusGuard - Digital Wellness App

**FocusGuard** is a powerful digital wellness application designed to help users reclaim their focus by blocking distracting social media apps during dedicated focus sessions. Built with modern web technologies and optimized for mobile devices.

## ✨ Features

### 🛡️ App Blocking
- **Smart App Detection**: Automatically identifies and blocks popular social media platforms
- **Customizable Duration**: Set focus sessions from 1 to 8 hours
- **Real-time Monitoring**: Continuously monitors for blocked app launches
- **Background Persistence**: Maintains blocks even when the app is closed

### 📱 Supported Platforms
- **Instagram** - Photo and video sharing
- **YouTube Shorts** - Short-form video content
- **TikTok** - Music and dance videos
- **Facebook Watch** - Video content
- **Twitter/X** - Social media and news
- **Snapchat** - Ephemeral messaging

### 🎯 Focus Features
- **Habit Tracking**: Monitor your focus session patterns
- **Progress Visualization**: Track your digital wellness journey
- **OTP Unlock**: Secure verification required to end sessions early
- **Usage Statistics**: Detailed insights into your app usage

### 🔧 Technical Features
- **Cross-Platform**: Works on Android, iOS, and Web
- **Background Services**: Persistent app blocking
- **Accessibility Integration**: Seamless Android integration
- **Real-time Updates**: Live session monitoring

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Capacitor CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd focusguard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Mobile Development

#### Android Setup
1. **Add Android platform**
   ```bash
   npx cap add android
   ```

2. **Sync project**
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

4. **Build and run**
   ```bash
   npx cap run android
   ```

#### iOS Setup
1. **Add iOS platform**
   ```bash
   npx cap add ios
   ```

2. **Sync project**
   ```bash
   npx cap sync ios
   ```

3. **Open in Xcode**
   ```bash
   npx cap open ios
   ```

## 🔐 Permissions Required

### Android
- **Accessibility Service**: Required for app blocking functionality
- **Usage Stats**: For tracking app usage patterns
- **System Alert Window**: For blocking notifications

### iOS
- **Screen Time API**: For app blocking (requires iOS 12+)
- **Notification Permissions**: For focus session updates

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Router** for navigation
- **React Query** for state management

### Backend Services
- **AppBlockingService**: Core app blocking logic
- **BackgroundTask**: Persistent background monitoring
- **Capacitor Plugins**: Native platform integration

### Native Integration
- **Android**: Accessibility Service + SharedPreferences
- **iOS**: Screen Time API + UserDefaults
- **Web**: LocalStorage + Service Workers

## 📱 Usage

### Starting a Focus Session
1. Select the social media platforms you want to block
2. Choose your desired session duration (1-8 hours)
3. Click "Start Focus Session"
4. Grant necessary permissions when prompted
5. Your selected apps are now blocked!

### During a Session
- Blocked apps will automatically close if launched
- You'll receive notifications when blocking occurs
- Session timer shows remaining time
- Background monitoring ensures persistence

### Ending a Session
- Wait for the session to complete naturally, OR
- Use the OTP unlock feature for early termination
- All blocked apps will be restored

## 🧪 Development

### Project Structure
```
src/
├── components/          # React components
├── pages/              # Page components
├── services/           # Business logic services
├── plugins/            # Capacitor plugins
├── hooks/              # Custom React hooks
└── lib/                # Utility functions
```

### Key Components
- **PlatformCard**: Individual platform selection
- **BlockTimer**: Session countdown display
- **HabitTracker**: Usage pattern visualization
- **OTPUnlock**: Secure session termination

### Testing
```bash
# Run linting
npm run lint

# Run tests (when implemented)
npm test

# Build for production
npm run build
```

## 🚀 Deployment

### Web Deployment
1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Configure environment variables if needed

### Mobile App Stores
1. **Android**: Build APK/AAB and submit to Google Play Store
2. **iOS**: Build IPA and submit to Apple App Store
3. Ensure all permissions and privacy policies are documented

## 🔒 Security & Privacy

- **Local Storage**: All blocking data is stored locally
- **No Data Collection**: App doesn't collect personal information
- **Permission-Based**: Only requests necessary system permissions
- **Transparent**: Clear indication of what the app does

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join community discussions on GitHub

## 🔮 Future Enhancements

- [ ] **AI-Powered Insights**: Smart recommendations based on usage patterns
- [ ] **Focus Challenges**: Gamified focus sessions with rewards
- [ ] **Social Features**: Share progress with friends and family
- [ ] **Advanced Analytics**: Detailed productivity insights
- [ ] **Custom Block Lists**: User-defined app blocking rules
- [ ] **Focus Music Integration**: Curated playlists for productivity

---

**Built with ❤️ using modern web technologies to help you stay focused in a distracted world.**
