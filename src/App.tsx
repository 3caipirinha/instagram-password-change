import { useState } from 'react';
import './App.css';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';

function App() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Invia i dati all'API per il log
      const response = await fetch('/api/log-password-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          // NON inviamo le password in chiaro per sicurezza!
          // Inviamo solo metadati
          passwordLength: {
            current: currentPassword.length,
            new: newPassword.length
          }
        }),
      });

      if (response.ok) {
        // Mostra messaggio di successo
        setShowSuccess(true);
        
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Nascondi messaggio dopo 5 secondi
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        alert('Errore durante il salvataggio. Riprova.');
      }
    } catch (error) {
      console.error('Errore:', error);
      alert('Errore di connessione. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = currentPassword && newPassword && confirmPassword && newPassword === confirmPassword;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in">
          <CheckCircle className="w-6 h-6" />
          <div>
            <p className="font-semibold">Password cambiata con successo!</p>
            <p className="text-sm opacity-90">La modifica è stata registrata.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <svg viewBox="0 0 24 24" className="instagram-logo">
              <defs>
                <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#feda75" />
                  <stop offset="25%" stopColor="#fa7e1e" />
                  <stop offset="50%" stopColor="#d62976" />
                  <stop offset="75%" stopColor="#962fbf" />
                  <stop offset="100%" stopColor="#4f5bd5" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="6" ry="6" fill="none" stroke="url(#instagram-gradient)" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4.5" fill="none" stroke="url(#instagram-gradient)" strokeWidth="2"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="url(#instagram-gradient)"/>
            </svg>
            <span className="logo-text">Instagram</span>
          </div>
          <div className="header-actions">
            <button className="btn-login">Log In</button>
            <button className="btn-signup">Sign Up</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="password-card">
          {/* Icon */}
          <div className="icon-container">
            <div className="lock-icon">
              <Lock className="w-8 h-8" />
            </div>
          </div>

          {/* Title */}
          <h1 className="title">Cambia la tua password</h1>

          {/* Description */}
          <p className="description">
            Per motivi di sicurezza, inserisci la tua password attuale e poi scegli una nuova password. 
            La nuova password deve contenere almeno 6 caratteri e includere una combinazione di numeri, 
            lettere e caratteri speciali (!$@%).
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="form">
            {/* Current Password */}
            <div className="input-group">
              <div className="input-wrapper">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Password attuale"
                  className="password-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="input-group">
              <div className="input-wrapper">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nuova password"
                  className="password-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="input-group">
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ripeti nuova password"
                  className="password-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="error-text">Le password non coincidono</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? 'Cambio in corso...' : 'Cambia password'}
            </button>
          </form>

          {/* Back Link */}
          <div className="back-link">
            <a href="#">Torna al login</a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#">Meta</a>
          <a href="#">Informazioni</a>
          <a href="#">Blog</a>
          <a href="#">Lavora con noi</a>
          <a href="#">Aiuto</a>
          <a href="#">API</a>
          <a href="#">Privacy</a>
          <a href="#">Condizioni</a>
          <a href="#">Luoghi</a>
          <a href="#">Instagram Lite</a>
          <a href="#">Threads</a>
        </div>
        <div className="footer-bottom">
          <div className="language-selector">
            <span>Italiano</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <span className="copyright">© 2026 Instagram from Meta</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
