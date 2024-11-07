
# Chat Application

A real-time chat application that supports private and public messaging between registered users. This application enables users to engage in seamless communication while staying connected with their contacts. It’s built with React Native and utilizes MongoDB for persistent data storage. Users can receive notifications for private messages, view online contacts, and add new contacts to expand their network.

## Features

- **Public and Private Chat**: Engage in both public chat rooms and private conversations.
- **Real-time Notifications**: Receive instant notifications for private messages, displaying the sender's name and the message content.
- **Add New Contacts**: Expand your network by adding new contacts to your chat list.
- **View Online Status**: See who is currently online to know when contacts are available.

## Installation

### Running the App with Expo

To run the app with Expo, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/walided88/wassap.git
   cd wassap
   ```

2. **Install dependencies**:
   Make sure you have `node` and `npm` or `yarn` installed. Run:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Start the Expo server**:
   ```bash
   npx expo start
   ```
   This will open Expo Developer Tools in your browser. You can run the app on an Android or iOS device via the Expo Go app, or use an emulator.

### Running the APK on Android

If you prefer to run the app as a standalone application, follow these steps to download and install the APK:

1. **Download the APK**:
   Go to the [Releases](https://github.com/walided88/wassap/releases/tag/v1.0.0-alpha) section of this repository and download the latest APK file.

2. **Install the APK**:
   Transfer the APK to your Android device and install it. Make sure to enable installation from unknown sources in your device’s settings.

3. **Run the App**:
   Open the app from your device's application list and sign in to start chatting!

## Technology Stack

- **Frontend**: React Native (Expo)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB for persistent storage
- **Real-time Communication**: WebSocket for real-time updates

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch with your feature or bug fix.
3. Submit a pull request.

## License

This project is licensed under the MIT License.


