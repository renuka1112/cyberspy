# CYBERSPY 🛡️
### AI-Powered Next-Gen Threat Intelligence Platform

CyberSpy is a cutting-edge, real-time cybersecurity dashboard and threat analysis platform. It leverages Google's Gemini AI and advanced visualization techniques to provide security analysts with instant insights into network security, file integrity, and global threat vectors.

![CyberSpy Dashboard](https://media.discordapp.net/attachments/1063523062332162058/1199321356073164800/image.png?ex=65c21966&is=65afa466&hm=8029d5b5071199484080175865246700055110& "CyberSpy Dashboard")

## 🚀 Features

*   **Global Attack Map**: Real-time 3D and 2D visualization of global cyber attacks using `react-globe.gl`.
*   **SIMBA AI Assistant**: An integrated AI chatbot (Security Intelligence Multi-Agent Bot) powered by Gemini Pro to explain threats, analyze PCAP files, and answer security queries.
*   **Real-time Network Scanning**: Wireless landscape auditing, WiFi security status, and fraud link detection.
*   **PCAP Forensics**: Deep packet inspection with protocol distribution charts and anomaly detection.
*   **Live Threat Monitoring**: WebSocket-based real-time streaming of simulated or actual network traffic.
*   **Secure QR Analysis**: Webcam-enabled QR scanner to detect malicious payloads before execution.
*   **Dark Mode UI**: A premium, "glass-morphism" aesthetic designed for prolonged use in SOC environments.

## 🏗️ Architecture

CyberSpy follows a modern Client-Server architecture:

### Frontend (`/frontend`)
*   **Framework**: React (Vite)
*   **Styling**: TailwindCSS (v4), Framer Motion (Animations)
*   **Visualization**: Recharts (Analytics), React Globe GL (3D Map)
*   **State Management**: React Hooks


### Backend (`/backend`)
*   **Framework**: FastAPI (Python 3.10+)
*   **AI Engine**: Google Generative AI (Gemini 2.5 Flash)
*   **Real-time Sync**: WebSockets (`/ws/stream`)
*   **Analysis Tools**: 
    *   `scapy` (Packet manipulation/analysis mock)
    *   `requests` (URL analysis)
    *   `Pillow` (Image processing for QR)

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)
*   **Npcap** (Windows only): Required for packet capture. Download from [nmap.org/npcap](https://npcap.com/#download). 
    *   *Important*: During installation, check **"Install Npcap in WinPcap API-compatible Mode"**.
*   Google Gemini API Key
*   virustotal API Key

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```
GEMINI_API_KEY=your_actual_api_key_here
VIRUSTOTAL_API_KEY=your_actual_api_key_here
```

Run the server:
```bash
uvicorn app.main:app --reload
```
The API will start at `http://localhost:8000`.

### 2. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## 📂 Project Structure

```
cyberspy/
├── backend/
│   ├── app/
│   │   ├── routers/       # API Endpoints (analysis, dashboard, network)
│   │   ├── services/      # Core logic (AI, PCAP processing)
│   │   └── main.py        # Server entry point
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components (Sidebar)
│   │   ├── pages/         # Main Views (Dashboard, Network, AIChat)
│   │   ├── index.css      # Tailwind & Global Styles
│   │   └── App.tsx        # Routing Logic
│   └── package.json
└── README.md
```

## 🔒 Security Note
This project is a demonstration of **Defensive Security Tooling**. While it simulates real-world attack patterns for training and visualization, always ensure you have authorization before scanning any network or system.

---

