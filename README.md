# clothing-shop-try-on-website-

This website generates images that show how you would look wearing the choice of your clothing. Simply upload your image and a clothing image, and provide details about the garment. It will generate a high-quality, photorealistic image of you wearing that piece of clothing.

# Babu Bridal Corner - Virtual Try-On Experience

Welcome to the **Babu Bridal Corner** Virtual Try-On implementation! This project showcases a modern, AI-powered web application that allows users to digitally "try on" clothing—whether it's a ready-made outfit or unstitched material—using state-of-the-art Generative AI models.

## ✨ Features

- **AI-Powered Virtual Try-On**: Utilizes Google Gemini to analyze user poses and garment details, combined with Pollinations.ai for high-fidelity image synthesis.
- **Support for Unstitched Materials**: Users can upload raw fabric or unstitched materials and specify what custom outfit they want it stitched into (e.g., Kurti, Dress, Saree, Lehenga, Blouse, Salwar Kameez).
- **Responsive & Premium UI**: Built with React and Vanilla CSS, offering a luxury editorial aesthetic suited for a bridal boutique.
- **Drag-and-Drop Image Upload**: Intuitive, easy-to-use image upload zones for both user portrait and clothing item.
- **Download & Share**: Generates realistic previews that users can instantly download.

## 🚀 Tech Stack

- **Frontend Framework**: React 19 + Vite 6
- **Styling**: Vanilla CSS with CSS Variables for consistent theming and micro-animations.
- **AI Integration**: 
  - **Google Gemini 1.5 Flash**: For precise image analysis and context-aware prompt generation.
  - **IDM-VTON (via @gradio/client)**: For high-fidelity, identity-preserving virtual try-on that accurately maps garments to the user's pose.
- **Tooling**: ESLint, Node.js

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v16.x or later) installed.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AmaanMohamed454/clothing-shop-try-on-website-.git
   cd clothing-shop-try-on-website-
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
4. **Generate**: Click the generate button. The AI analyzes the person and the garment to create a custom prompt, which is then used to synthesize a realistic image of the person wearing the outfit.

## 📝 License

This project is created as a showcase of integrating advanced Generative AI with intuitive web interfaces.
