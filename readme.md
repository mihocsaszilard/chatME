 <div align="center">
  <h1>chatME</h1>
    <h3>
      A chat app for mobile devices using React Native. The app will
      provide users with a chat interface and options to share images and their
      location.
    </h3>
 </div>

 <h2>Table of content</h2>

  + [Features and Requirements](#features)
      * [User Stories](#stories)
      * [Key Features](#key-features)
  + [Technical Requirements](#technical)
  + [Built with](#built)
  + [Get Started](#get-started)
      * [Setting up](#setting-up)
      + [Install Dependencies](#install-dep)
          * [Dependencies](#dependencies) 
      * [Database Configuration](#config)
      * [Run the app](#run)


<h2 id="features">Features and Requirements</h2>

<h3 id="stories">User Stories</h3>

<p>
  As a new user: 
</p>

<ul>
  <li>
    I want to be able to easily enter a chat room so I can quickly start talking to my
    friends and family
  </li>
  <li>
    I want to be able to send messages to my friends and family members to exchange
  the latest news.
  </li>
  <li>
     I want to send images to my friends to show them what I’m currently doing
  </li>
  <li>
     I want to share my location with my friends to show them where I am.
  </li>
  <li>
    I want to be able to read my messages offline so I can reread conversations at any
    time.
  </li>
  <li>
    I want to use a chat app that is compatible with a screen
    reader so that I can engage with a chat interface.
  </li>
</ul>

<h3 id="key-features">Key Features</h3>

<ul>
   <li>
    A page where users can enter their name and choose a background color for the chat screen
    before joining the chat.
  </li>
  <li>
    A page displaying the conversation, as well as an input field and submit button
  </li>
  <li>
    The chat must provide users with two additional communication features: sending images
    and location data.
  </li>
  <li>
    Data gets stored online and offline.
  </li>
</ul>

<h2 id="technical">Technical Requirements</h2>

<ul>
  <li>
    The app must be written in React Native.
  </li>
  <li>
    The app must be developed using Expo.
  </li>
  <li>
     The app must be styled according to the given screen design.
  </li>
  <li>
     Chat conversations must be stored in Google Firestore Database.
  </li>
  <li>
    The app must authenticate users anonymously via Google Firebase authentication.
  </li>
  <li>
    Chat conversations must be stored locally.
  </li>
  <li>
    The app must let users pick and send images from the phone’s image library
  </li>
  <li>
    The app must let users take pictures with the device’s camera app, and send them.
  </li>
  <li>
    The app must store images in Firebase Cloud Storage.
  </li>
  <li>
     The app must be able to read the user’s location data.
  </li>
  <li>
    Location data must be sent via the chat in a map view
  </li>
  <li>
    The chat interface and functionality must be created using the Gifted Chat library.
  </li>
  <li>
    The app’s codebase must contain comments.
  </li>
</ul>

<h2 id="built">Built with</h2>

<ul>
  <li>React Native</li>
  <li>Node.js</li>
  <li>Expo</li>
  <li>Android Studio</li>
  <li>Firebase</li>
  <li>Google Firestore</li>
  <li>Gifted Chat</li>
  <li>Dialogflow</li>
</ul>


<h2 id="get-started">Get Started</h2>

<h3 id="setting-up">Setting up</h3>

  To develop and test with React Native applications, Facebook recommends using [Expo](https://docs.expo.dev/), an open-source platform for developing native apps that runs on Android, iOS, and the web. First of all, you need to install the [Expo Command Line Interface](https://docs.expo.dev/workflow/expo-cli/) and download the [Expo Go](https://docs.expo.dev/guides/sharing-preview-releases/#expo-go) iOS and Android compatible app on your phone for real time testing.

  To install Expo CLI run the following command in terminal:

  `npm install --global expo-cli`

<h3 id="install-dep">Install Dependencies</h3>

  Once you have the project on your computer, access the project folder via Terminal and run the following command:

  `npm install`

  Now you have installed all the necessary dependencies in order to run the application.

<h4 id="dependencies">Dependencies:</h4>

<ul>
  <li>react-native-community/masked-view 0.1.10,</li>
  <li>react-navigation/native ^6.0.2,</li>
  <li>react-navigation/stack ^6.0.7,</li>
  <li>stripe/stripe-react-native 0.1.4,</li>
  <li>expo ~42.0.1,</li>
  <li>expo-status-bar ~1.0.4,</li>
  <li>firebase 8.2.3,</li>
  <li>react 16.13.1,</li>
  <li>react-dom 16.13.1,</li>
  <li>react-native https//github.com/expo/react-native/archive/sdk-42.0.0.tar.gz,</li>
  <li>react-native-chatbot 0.0.1-alpha.12,</li>
  <li>react-native-dialogflow 3.1.0,</li>
  <li>react-native-gesture-handler ~1.10.2,</li>
  <li>react-native-gifted-chat ^0.16.3,</li>
  <li>react-native-push-notification ^3.5.2,</li>
  <li>react-native-reanimated ~2.2.0,</li>
  <li>react-native-safe-area-context 3.2.0,</li>
  <li>react-native-screens ~3.4.0,</li>
  <li>react-native-svg 12.1.1,</li>
  <li>react-native-voice ^0.3.0,</li>
  <li>react-native-web ~0.13.12,</li>
  <li>react-navigator 0.0.0-0</li>
</ul>

<h3 id="config">Database Configurations</h3>

In order to store the conversation you need a [Firebase](https://console.firebase.google.com/) account. If your account is ready, please create a new project and enable the 'Anonymus Authentication' from the left side Authentication menu. When this is ready, you need to create your database. To do this click the 'Firestore Database' and give it the name 'messages'.
The last step is to configure your freshly created database. To do this, click the little gear icon from the left side menu and select 'Project Settings'. Under the General tab, you’ll find a section called Your apps, which is where you can generate configurations for different platforms. Click the Firestore for Web button (it may be shown as the </> icon). This will open a new screen asking you to register your web application, which will connect to the Cloud Firestore database you just created. For now, only fill in a name for your chat application (e.g., “chat_web_app”), then click Register to generate the configuration code which looks like this:

`const firebaseConfig = {
  apiKey: "AIzAS4G45et6Cs-wSluDnda16f5uc_9QHg7kBxU",
  authDomain: "chat-app-4ae7f.firebaseapp.com",
  projectId: "chat-app-48pif",
  storageBucket: "chat-app-48pif.appspot.com",
  messagingSenderId: "70176808883",
  appId: "1:70690718883:web:46b85078125a1b6a9756b6",
};`

!Make sure you change the content of 'firebaseConfig' with your own!

<h3 id="run">Running the app</h3>

In order to run the app, please run the following command in terminal:

`expo start`

This command will open a new window in your browser and offers more options to open the app: 
<ul>
  <li>on Android/iOS emulator,</li>
  <li>on your phone, scanning the QR Code which redirects to Expo Go</li>
  <li>or in browser</li>
</ul> 

<h2>Contact</h2>

[<img align="left" alt="send me an email" width="25px" src="https://github.com/mihocsaszilard/mihocsaszilard/blob/main/assets/mail.svg" />](mihocsa48@gmail.com)
[<img align="left" alt="linkedin profile" width="25px" src="https://github.com/mihocsaszilard/mihocsaszilard/blob/main/assets/linkedin.svg" />][linkedin]
[<img align="left" alt="twitter profile" width="25px" src="https://github.com/mihocsaszilard/mihocsaszilard/blob/main/assets/twitter.svg" />][twitter]
[<img align="left" alt="portfolio website" width="25px" src="https://github.com/mihocsaszilard/mihocsaszilard/blob/main/assets/website.svg" />][website]
