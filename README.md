# 📊 ECDSA Sandbox: Elliptic Curve Digital Signature Algorithm Visualizer

## 🚀 Project Overview
This Next.js project provides an interactive web-based sandbox for exploring **Elliptic Curve Digital Signature Algorithm (ECDSA)** concepts. The application visualizes cryptographic operations, including key generation, digital signing, and signature verification using elliptic curves. It's designed for developers, students, and security enthusiasts to experiment with ECDSA principles in a browser-based environment.

---

## 📦 Features
- **Interactive Elliptic Curve Visualization**: Graphically represent elliptic curves and cryptographic operations.
- **Key Generation**: Generate ECDSA key pairs (private and public keys).
- **Digital Signing**: Sign messages using private keys and verify signatures with public keys.
- **Mathematical Insights**: Display underlying equations and modular arithmetic operations.
- **Responsive Design**: Works seamlessly across desktop and mobile devices.

---

## 📦 Technologies
- **Next.js 13+**: Server-rendered React application with dynamic routing.
- **React**: Component-based UI for interactive elements.
- **TypeScript**: Static typing for robust code structure.
- **Tailwind CSS**: Utility-first styling for a clean, modern interface.
- **Math Libraries**: Custom math utilities for elliptic curve calculations.

---

## 🚀 Try It Out
Explore the ECDSA sandbox live at [https://laborless.github.io/ecdsa_sandbox/](https://laborless.github.io/ecdsa_sandbox/). This interactive demo lets you visualize cryptographic operations in real-time - perfect for experimenting with key generation, signing, and verification without any setup.  

## 🧱 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ecdsa-sandbox.git
cd ecdsa-sandbox
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run the Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the sandbox.

---

## 📌 How to Use
1. **Key Generation**:
   - Navigate to the "Key Generation" section.
   - Select an elliptic curve (e.g., `secp256k1`).
   - Generate a private key and derive the corresponding public key.

2. **Digital Signing**:
   - Enter a message in the input field.
   - Use your private key to sign the message.
   - View the resulting signature and verify it with the public key.

3. **Visual Exploration**:
   - Use the interactive chart to visualize the elliptic curve and cryptographic operations.
   - Adjust parameters to see how changes affect the curve and signatures.

---

## 📦 Deployment
Deploy your app to Vercel with one click:
1. [Sign up for Vercel](https://vercel.com/)
2. Import your GitHub repository
3. Configure the deployment settings (optional: set environment variables for custom domains or API keys)

---

## 📚 About ECDSA
ECDSA is a cryptographic algorithm used to create digital signatures, ensuring data integrity and authenticity. It relies on the mathematical properties of elliptic curves over finite fields. This sandbox provides a hands-on way to explore these concepts, making abstract cryptographic theory accessible through visual and interactive tools.

---

## 🤝 Contributing
Enhance the sandbox by adding:
- New elliptic curves (e.g., `ed25519`, `Curve25519`)
- Advanced visualization features (e.g., animation of signing/verification)
- Educational content (e.g., explanations of cryptographic principles)

---

## 📄 License
MIT License  
This project is open-source and available for modification and distribution under the MIT License.

---

Explore the world of cryptography through code and visualization! 🚀