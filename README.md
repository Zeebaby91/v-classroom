# V-Class | Real-Time Interactive Learning Portal

V-Class is a high-performance, full-stack virtual classroom environment designed to bridge the gap between static content and live engagement. Built with a focus on real-time data synchronization and optimized user state management.

## 🚀 Technical Features

*   **Intelligent Session Filtering**: Implements a "Soft-Clear" UI logic. Using a lazy-initialized session anchor, the application filters legacy database records from the view while maintaining a complete historical audit log in the backend.
*   **Real-Time Presence Engine**: A robust attendance tracking system utilizing Firebase listeners to monitor and display unique active user counts.
*   **Dual-Channel Communication**: Dedicated, isolated streaming channels for #General and #Q&A to minimize discussion noise and improve information hierarchy.
*   **Engagement Layer**: Real-time reaction broadcasting, administrative message pinning, and "Raise Hand" status toggling.
*   **Responsive Media Interface**: A modular video delivery system with integrated loading states and dynamic source switching.

## 🛠️ Tech Stack

*   **Frontend**: React.js (Vite)
*   **Styling**: Tailwind CSS (Utility-first architecture)
*   **Backend/Database**: Firebase Firestore & Authentication
*   **State Management**: React Hooks (State, Effect, Ref, Memo)

## 📂 Project Structure

```text
src/
├── assets/          # Static assets and branding
├── components/      # Reusable UI components (Footer, Navbar)
├── pages/           # View-level components (Classroom, Login)
├── firebase.js      # Centralized Firebase SDK configuration
└── App.jsx          # Root routing and global state
