# FinacPlus — Micro Frontend Music Platform

This is a modern, role-based Music Platform built using a **Micro Frontend Architecture** powered by Vite and Module Federation.

It consists of two separate applications:
1. **`host-app`**: The outer shell and platform container.
2. **`music-library`**: A self-contained widget that handles its own data fetching, UI, state, and authentication context.

---

## 🚀 How to Run Locally

Because this project uses Module Federation, both applications need to be running. The easiest way to run the full stack locally is to build the remote and run the host in dev mode.

### 1. Start the Music Library (Remote)
The `@originjs/vite-plugin-federation` plugin requires the remote app to be built so it generates the `remoteEntry.js` file.

```bash
cd music-library
npm install
npm run build
npm run preview
```
*Runs on `http://localhost:5173`*

### 2. Start the Host App
In a new terminal, start the host application. Make sure the remote URL in `host-app/vite.config.js` is pointed to localhost (`http://localhost:5173/assets/remoteEntry.js`) if you want to test local widget changes.

```bash
cd host-app
npm install
npm run dev
```
*Runs on `http://localhost:5174`*

---

## 🌍 How it was Deployed

Both applications are deployed independently on **Vercel**.

- **Music Library (Remote)**: Deployed as a standalone Vite application. Vercel acts as a proxy for the iTunes API via rewrites in `vercel.json` to bypass CORS restrictions.
- **Host App**: Deployed separately. In its `vite.config.js`, the federation plugin is configured to pull the `remoteEntry.js` dynamically from the deployed Music Library's Vercel URL at runtime.

**Live Demo:**
* **Host Platform:** [https://finac-plus-pvdp.vercel.app](https://finac-plus-pvdp.vercel.app)
* **Music Library (Standalone):** [https://finac-plus-qdq3.vercel.app](https://finac-plus-qdq3.vercel.app)

---

## 🔐 Credentials for Demo

The application uses a simulated JWT-based authentication system to demonstrate role-based access control.

| Role | Username | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Read, Add Songs, Delete Songs |
| **User** | `user` | `user123` | Read-only |

*Try logging in as `admin` to see the "+ Add" button and the delete icons on individual song cards.*

---

## 🏗️ Architecture & Role-Based Auth

### Micro Frontend Setup
This project uses **Vite** and `@originjs/vite-plugin-federation`. 
- The `music-library` exports a single `<MusicLibraryWidget />` component.
- The CSS from Tailwind is dynamically injected at runtime (`?inline` import) so that the widget retains its styling regardless of where it is hosted.
- The `host-app` imports this widget over the network. It doesn't need to know anything about the widget's internal dependencies like React Query or Tailwind.

### Role-Based Auth
Authentication is handled entirely within the `music-library` domain.
- The widget wraps its internal UI in an `<AuthProvider>`.
- When a user logs in, a mock JWT is generated and stored in `localStorage`.
- The UI conditionally renders elements based on the `user.role` (e.g., only admins see the add/delete buttons).

---

## ⚖️ Tradeoffs & Future Improvements

**Tradeoffs made:**
To keep the architecture simple and easy to deploy on Vercel without a dedicated backend, I mocked the JWT authentication and used `localStorage` for custom song persistence. I also bypassed CORS issues with the iTunes API by proxying requests through Vercel's serverless rewrites (`vercel.json`), which couples the API fetching slightly to the hosting platform. Injecting Tailwind CSS dynamically via JS string (`?inline`) ensures styling works in the micro-frontend context, but it slightly increases the JS bundle size and impacts time-to-first-paint for the widget.

**What I'd improve:**
In a production scenario, I would replace the mock JWT system with a real identity provider (like Auth0 or NextAuth) and move the custom song data to a real database (like PostgreSQL or MongoDB) via a dedicated backend service. I would also investigate using Module Federation 2.0 or switching to a framework like Next.js with Module Federation for better Server-Side Rendering (SSR) support, as the current client-side federation approach is not optimal for SEO or initial load performance.
