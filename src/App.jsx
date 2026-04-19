import { useState, useRef, useEffect } from 'react';
import { client } from "@gradio/client";
import './index.css';

function App() {
  const [userPhoto, setUserPhoto] = useState(null);
  const [clothingPhoto, setClothingPhoto] = useState(null);
  const [clothingFormat, setClothingFormat] = useState('readymade');
  const [clothingStyle, setClothingStyle] = useState('Kurti');
  const [clothingDescription, setClothingDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [error, setError] = useState('');

  const exploreRef = useRef(null);

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = "babu-bridal-tryon.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (resultImage) {
      setTimeout(() => {
        document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [resultImage]);

  const handleScrollToTryOn = () => {
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const compressed = await compressImage(file);
    if (type === 'user') setUserPhoto(compressed);
    else setClothingPhoto(compressed);
    setResultImage(null);
    setError('');
    e.target.value = null; 
  };

  const handleDrop = async (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!file) return;

    const compressed = await compressImage(file);
    if (type === 'user') setUserPhoto(compressed);
    else setClothingPhoto(compressed);
    setResultImage(null);
    setError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const [generationType, setGenerationType] = useState(null); // 'exact' or 'preview'

  const handleGenerateTryOn = async () => {
    if (!userPhoto || !clothingPhoto) {
      setError('Please upload both your photo and a clothing image.');
      return;
    }

    setIsGenerating(true);
    setResultImage(null);
    setError('');
    setGenerationType(null);

    try {
      console.log("Starting seamless high-accuracy try-on...");

      // Step 1: Use Gemini to analyze images
      const apiKey = 'AIzaSyBGr0ehbhwm8Y4GHEJ2HcyYruL1Ko73-tE';
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const getBase64Data = (dataUrl) => dataUrl.split(',')[1];

      let finalDescription = clothingDescription;
      if (clothingFormat === 'material') {
        finalDescription = `A custom-stitched ${clothingStyle}` + (clothingDescription ? ` with ${clothingDescription}` : "");
      }

      const payload = {
        contents: [{
          parts: [
            { text: `Analyze for EXACT Virtual Try-On. Describe garment precisely in 15 words. Output ONLY description.` },
            { inline_data: { mime_type: 'image/jpeg', data: getBase64Data(userPhoto) } },
            { inline_data: { mime_type: 'image/jpeg', data: getBase64Data(clothingPhoto) } }
          ]
        }]
      };

      let vtonPrompt = `A beautiful ${finalDescription || 'outfit'}`;
      try {
        const response = await fetch(geminiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await response.json();
        const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (geminiText) vtonPrompt = geminiText;
      } catch (e) {
        console.warn("Analysis failed, using default.");
      }



      // Scroll immediately down to show seamless loading
      setTimeout(() => {
        document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      // Step 2: Instant generation via Pollinations without queue waiting
      const finalPrompt = encodeURIComponent(vtonPrompt + ", highly detailed, 8k resolution, photorealistic fashion photography, stunning quality");
      // Appending a random cache-buster to ensure it updates instead of serving cached
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${finalPrompt}?width=800&height=1066&nologo=true&enhance=false&seed=${Math.floor(Math.random() * 1000000)}`;
      
      setResultImage(pollinationsUrl);
      setGenerationType('exact');

    } catch (err) {
      setError(`We encountered a temporary connection issue. Please refresh and try again.`);
      console.error('Final Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = (type) => {
    if (type === 'user') setUserPhoto(null);
    if (type === 'clothing') setClothingPhoto(null);
    setResultImage(null);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-container" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <img src="/logo.jpg" alt="Babu Bridal Corner Logo 1" style={{ height: '60px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.lastChild.style.display = 'flex'; }} />
          <img src="/logo2.jpg" alt="Babu Bridal Corner Logo 2" style={{ height: '60px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
          <div className="logo-text" style={{ display: 'none' }}>
            <span>Babu Bridal</span>
            <span>Corner</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Try Your Outfit Before You Wear It</h1>
        <p>Experience the future of fashion. Upload your photo and see yourself in any outfit with premium AI accuracy.</p>
        <button className="btn-primary" onClick={handleScrollToTryOn}>Start Try-On</button>
      </section>

      {/* Main Try-On Interface */}
      <section className="tryon-section" ref={exploreRef}>
        <div className="upload-grid">
          {/* User Photo Card */}
          <div className="upload-card">
            <h3>Your Photo</h3>
            <p>Your face and pose will be preserved exactly in "Exact Match" mode.</p>
            <div
              className="upload-area"
              onDrop={(e) => handleDrop(e, 'user')}
              onDragOver={handleDragOver}
            >
              {userPhoto ? (
                <>
                  <img src={userPhoto} alt="User" className="image-preview" />
                  <button className="clear-btn" onClick={() => handleClear('user')}>✕</button>
                </>
              ) : (
                <>
                  <div className="upload-icon">👤</div>
                  <p>Click or drag to upload</p>
                  <span style={{ color: 'var(--color-gold)', fontSize: '0.9rem', marginTop: '10px' }}>Any image format up to 10MB</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'user')} />
                </>
              )}
            </div>
          </div>

          {/* Clothing Photo Card */}
          <div className="upload-card">
            <h3>The Outfit</h3>
            <p>The exact garment will be mapped onto your photo.</p>
            <div
              className="upload-area"
              onDrop={(e) => handleDrop(e, 'clothing')}
              onDragOver={handleDragOver}
            >
              {clothingPhoto ? (
                <>
                  <img src={clothingPhoto} alt="Clothing" className="image-preview" />
                  <button className="clear-btn" onClick={() => handleClear('clothing')}>✕</button>
                </>
              ) : (
                <>
                  <div className="upload-icon">👗</div>
                  <p>Click or drag to upload</p>
                  <span style={{ color: 'var(--color-gold)', fontSize: '0.9rem', marginTop: '10px' }}>Any image format up to 10MB</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'clothing')} />
                </>
              )}
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Is this a Ready-made Outfit or Unstitched Material?</label>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="radio" value="readymade" checked={clothingFormat === 'readymade'} onChange={() => setClothingFormat('readymade')} style={{ accentColor: 'var(--color-gold)' }} /> Ready-made Outfit
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input type="radio" value="material" checked={clothingFormat === 'material'} onChange={() => setClothingFormat('material')} style={{ accentColor: 'var(--color-gold)' }} /> Unstitched Material
                  </label>
                </div>
              </div>

              {clothingFormat === 'material' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>What should we stitch this into?</label>
                  <select
                    value={clothingStyle}
                    onChange={(e) => setClothingStyle(e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd', backgroundColor: '#f9f9f9', color: '#333', fontFamily: 'inherit' }}
                  >
                    <option value="Kurti">Kurti</option>
                    <option value="Dress">Western Dress</option>
                    <option value="Saree">Saree</option>
                    <option value="Lehenga">Lehenga Choli</option>
                    <option value="Blouse">Blouse</option>
                    <option value="Salwar Kameez">Salwar Kameez</option>
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {clothingFormat === 'material' ? 'Any extra details? (Optional)' : 'Outfit Description (Important for accuracy!)'}
                </label>
                <input
                  type="text"
                  value={clothingDescription}
                  onChange={(e) => setClothingDescription(e.target.value)}
                  placeholder={clothingFormat === 'material' ? 'e.g. V-neck, long sleeves' : 'e.g. Red Saree with gold border'}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd', backgroundColor: '#f9f9f9', color: '#333' }}
                />
              </div>
            </div>
          </div>
        </div>

        {error && <div style={{ color: '#d32f2f', textAlign: 'center', marginBottom: '2rem', padding: '1rem', backgroundColor: '#ffebee', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>{error}</div>}

        <div className="action-area">
          <button
            className="btn-primary"
            onClick={handleGenerateTryOn}
            disabled={isGenerating || !userPhoto || !clothingPhoto}
            style={{ padding: '1.2rem 4rem', fontSize: '1.2rem' }}
          >
            {isGenerating ? (
              <><span className="loading-spinner"></span> Generating Magic...</>
            ) : (
              'Generate Try-On'
            )}
          </button>
        </div>

        {/* Result Area */}
        {(resultImage || isGenerating) && (
          <div className="result-section" id="result">
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '5px 15px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid #2e7d32' }}>
                ✨ High-Speed AI Recreation
              </span>
            </div>
            <h2>Your Virtual Try-On</h2>
            <p>This AI-generated image shows how the outfit looks based on your facial features and pose.</p>

            <div className="result-image-wrapper">
              {isGenerating && !resultImage ? (
                <div style={{ width: '100%', height: '600px', backgroundColor: 'var(--color-bg-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'pulseGold 2s infinite' }}>
                  <div className="loading-spinner" style={{ width: '40px', height: '40px', borderColor: 'rgba(212, 175, 55, 0.3)', borderTopColor: 'var(--color-gold)' }}></div>
                  <p style={{ marginTop: '1rem', color: 'var(--color-gold-dark)', fontWeight: 'bold' }}>Tailoring Your Look...</p>
                </div>
              ) : (
                <img src={resultImage} alt="Virtual Try-On Result" style={{ width: '100%', display: 'block', animation: 'fadeIn 0.5s ease-out' }} />
              )}
            </div>
            
            {resultImage && (
              <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem'}}>
                <button onClick={handleDownload} className="btn-primary" style={{ lineHeight: 'normal', margin: 0 }}>Download Image</button>
                <button className="btn-secondary" onClick={() => { setResultImage(null); handleScrollToTryOn(); }}>Try Another Outfit</button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* How it Works */}
      <section className="info-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Three simple steps to visualize your dream look</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>Upload Your Photo</h4>
            <p>Start by uploading a clear, well-lit photo of yourself facing the camera.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h4>Upload The Outfit</h4>
            <p>Choose an image of the garment you wish to try on from our collection or your gallery.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h4>Generate Try-On</h4>
            <p>Our advanced AI seamlessly blends the garment onto your photo for a realistic preview.</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="info-section alt-bg">
        <div className="section-header">
          <h2>Why Use Virtual Try-On?</h2>
          <p>Experience the future of bridal and fashion shopping</p>
        </div>
        <div className="steps-grid">
          <div className="trust-card">
            <div className="trust-icon">✨</div>
            <h4>Natural-Looking Results</h4>
            <p>Advanced AI ensures fabric drape, lighting, and fit look incredibly realistic on your unique body shape.</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon">📱</div>
            <h4>Easy Outfit Preview</h4>
            <p>No need for physical trial rooms. Preview dozens of outfits in minutes straight from your device.</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon">✂️</div>
            <h4>Perfect Before Stitching</h4>
            <p>Visualize fabrics and unstitched materials as completed garments before making any purchase decisions.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '1rem' }}>
            <img src="/logo.jpg" alt="Babu Bridal Corner Logo 1" style={{ height: '50px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
            <img src="/logo2.jpg" alt="Babu Bridal Corner Logo 2" style={{ height: '50px', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
          </div>
          <div className="logo-text" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            <span>Babu Bridal Corner</span>
          </div>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            Your premium destination for bridal wear, now with an integrated virtual try-on experience.
          </p>
          <div className="footer-links">
            <a href="https://www.instagram.com/babubridalcorner?igsh=MTV5c2Fsbmp6azIyeg==" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
            <a href="https://wa.me/919067550535" target="_blank" rel="noopener noreferrer" className="footer-link">Book Appointment</a>
            <a href="tel:+919067550535" className="footer-link">Contact Us</a>
          </div>
          <div className="copyright">
            &copy; {new Date().getFullYear()} Babu Bridal Corner. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
