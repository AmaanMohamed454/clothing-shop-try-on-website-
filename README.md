# Babu Bridal Corner - Virtual Try-On Experience

Welcome to the **Babu Bridal Corner** Virtual Try-On implementation! This project showcases a modern, AI-powered web application that allows users to digitally "try on" clothing—whether it's a ready-made outfit or unstitched material—using state-of-the-art Generative AI models.

## ✨ Features

- **Virtual Try-On (VTON) AI**: Integrates with Hugging Face Inference API (`yisol/IDM-VTON` model) utilizing `@gradio/client` for seamless and high-fidelity clothing transfer.
- **Support for Unstitched Materials**: Users can upload raw fabric or unstitched materials and specify what custom outfit they want it stitched into (e.g., Kurti, Dress, Saree, Lehenga, Blouse, Salwar Kameez).
- **Responsive & Premium UI**: Built with React and Vanilla CSS, offering a luxury editorial aesthetic suited for a bridal boutique.
- **Drag-and-Drop Image Upload**: Intuitive, easy-to-use image upload zones for both user portrait and clothing item.
- **Download & Share**: Generates realistic previews that users can instantly download.

## 🚀 Tech Stack

- **Frontend Framework**: React 19 + Vite 6
- **Styling**: Vanilla CSS with CSS Variables for consistent theming and micro-animations.
- **AI Integration**: `@gradio/client` to execute remote AI inference requests.
- **Tooling**: ESLint, Node.js

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v16.x or later) installed.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/yourusername/babu-bridal-corner.git
   cd babu-bridal-corner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:5173/` to interact with the application.

## 💡 How it Works

1. **Upload Your Photo**: Provide a clear, well-lit, front-facing picture of the user.
2. **Upload the Garment**: Provide an image of the clothing (can be a flat-lay, worn by a mannequin, or a fabric swatch).
3. **Configure Options**: Choose between *Ready-made* or *Unstitched*. Provide optional descriptors for the AI to understand the garment context.
4. **Generate**: Click the generate button to ping the AI model that accurately masks the user and synthesizes the garment onto their body, maintaining pose and respecting the fabric's drape and texture.

## 📝 License

This project is created as a showcase of integrating advanced Generative AI with intuitive web interfaces. Feel free to use this as an inspiration for similar retail augmented reality (AR) / AI applications.
