# VoidFlux GUI Roadmap

This document triggers the development milestones for the VoidFlux GUI application, intended to be a robust, local-first API client.

## 🚀 Phase 1: Core Functionality (Current Status: In Progress)

- [x] **API Requester**
  - [x] HTTP Methods (GET, POST, PUT, PATCH, DELETE)
  - [x] Request Body (JSON Editor)
  - [x] Headers Management
  - [x] Response Viewer (Body, Headers, Status, Time, Size)
  - [x] Multi-tab Interface
- [x] **Request History**
  - [x] Local Storage Persistence
  - [x] History List / Log
  - [x] Load Request from History
  - [x] Clear History
- [x] **Settings**
  - [x] Max History Entries Config
  - [x] Storage Usage Visualizer
  - [x] Reset App Data
- [x] **Responsive Design**
  - [x] Desktop (Split View)
  - [x] Mobile (Stacked View)
  - [x] Adaptive Navigation
- [x] **Local Proxy Integration**
  - [x] Frontend URL Validation
  - [x] Proxy Error Handling

## 🛠 Phase 2: Enhanced Features (Next Steps)

- [x] **Collections**
  - [x] Create/Edit/Delete Collections
  - [x] Folder Organization
  - [x] Save Requests to Collections
  - [ ] Run Collection interactively
- [x] **Environments**
  - [x] Global & Environment Variables
  - [x] Variable Syntax `{{var}}` in URL/Headers/Body
  - [x] Environment Switcher
- [ ] **Authentication**
  - [ ] Bearer Token Helper
  - [ ] Basic Auth Helper
  - [ ] API Key Helper
- [ ] **Data Import/Export**
  - [ ] Export Collection/History to JSON
  - [ ] Import from Curl/Postman (stretch goal)

## 🔮 Phase 3: Advanced Capabilities

- [ ] **Tunneling**
  - [ ] Expose local servers to internet via CLI tunnel
- [ ] **Scripting**
  - [ ] Pre-request Scripts
  - [ ] Post-request Tests
- [ ] **Collaboration**
  - [ ] Sync Collections (Cloud or Peer-to-Peer)

## 🐛 Known Issues / Polish

- [ ] Improve error messages for network failures.
- [ ] Add loading skeletons for smoother improved UX.
- [ ] Refine syntax highlighting in JSON editors.
