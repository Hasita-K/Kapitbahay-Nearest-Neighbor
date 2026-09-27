# Project Guidelines for Kapitbahay-Nearest-Neighbors 

## Project Overview
-Hi. The purpose of this file is to allow an AI agent to gain valuable insights when given instruction when working on the following project. KNN is a Phillipine province inspired mobile app built with React Native, Node.js, and PostgreSQL that allows you to create custom "villages" with close friends to inventory and trade excess fridge ingredients. It features an interactive top downisland interface, custom fridge management, and a dedicated state machine handling trade requests, counter offers, and reputation stats

## Techstack
**Framework**: React Native (`~54.0.36`)
**Language**: TypeScript (`~5.9.2`)
**Core Library**: React `19.1.0`
**HTTP Client**: Axios (`^1.20.0`)

# Backend
**Runtime**: node.js (`^5.2.1`)
**Database**: PostgreSQL (`pg` ^8.23.0)
**Env Manager**: `dotenv`
**Utility** `cors`, `nodemon` (dev)

# File paths
- if you are trying to access any of the files here is the compelte file path at the moment
KNN/             # Root Directory of the Repository
├── .git/                     # Git metadata (Hidden)
├── AGENT.md                  # Project-wide AI context rules and commands (This File)
│
├── backend/                  # Node.js backend API
│   ├── AGENT.md              # Specific instructions for backend-focused agents
│   ├── app.js                # API Entry point
│   ├── config.js             # Database/env configuration
│   ├── package.json          # Backend dependencies
│   ├── routes/               # API endpoint definitions
│   └── node_modules/         # (Generated) Backend library dependencies
│
└── frontend/                 # React Native / Expo mobile application
    ├── AGENTS.md             # Specific instructions for frontend-focused agents
    ├── App.js                # Mobile app entry point
    ├── app.json              # Expo configuration
    ├── package.json          # Frontend dependencies
    ├── screens/              # UI Screen components
    └── node_modules/         # (Generated) Frontend library dependencies
