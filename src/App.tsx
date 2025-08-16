import React, { useState, useRef, useCallback } from 'react';
import './App.css';
import LoremGenerator from './components/LoremGenerator';

// Material UI Icons
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ErrorIcon from '@mui/icons-material/Error';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import WaterIcon from '@mui/icons-material/Water';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import PaletteIcon from '@mui/icons-material/Palette';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface FontData {
  id: string;
  url: string;
  fontFamily: string;
  name: string;
  isLoading: boolean;
  hasError: boolean;
}

type BackgroundTheme = 'light' | 'dark' | 'sepia' | 'blue' | 'green';

const App: React.FC = () => {
  const [sampleText, setSampleText] = useState(`The quick brown fox jumps over the lazy dog
Съешь же ещё этих мягких французских булок да выпей чаю
1234567890 !@#$%^&*()`);
  
  const [fonts, setFonts] = useState<FontData[]>([]);
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>('light');
  const [loadedFonts] = useState(new Map<string, string>());
  
  const maxFonts = 5;

  const addFont = useCallback(() => {
    if (fonts.length < maxFonts) {
      const newFont: FontData = {
        id: Math.random().toString(36).substr(2, 9),
        url: '',
        fontFamily: '',
        name: 'Введите URL шрифта',
        isLoading: false,
        hasError: false
      };
      setFonts(prev => [...prev, newFont]);
    }
  }, [fonts.length]);

  const removeFont = useCallback((id: string) => {
    setFonts(prev => prev.filter(font => font.id !== id));
  }, []);

  const extractFontFamily = (url: string): string => {
    const match = url.match(/family=([^&:]+)/);
    if (match) {
      return decodeURIComponent(match[1]).replace(/\+/g, ' ');
    }
    return 'Unknown Font';
  };

  const loadGoogleFont = useCallback((url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (loadedFonts.has(url)) {
        resolve(loadedFonts.get(url)!);
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;

      link.onload = () => {
        try {
          const fontFamily = extractFontFamily(url);
          loadedFonts.set(url, fontFamily);
          resolve(fontFamily);
        } catch (error) {
          reject(error);
        }
      };

      link.onerror = () => reject(new Error('Не удалось загрузить шрифт'));

      document.head.appendChild(link);
    });
  }, [loadedFonts]);

  const handleFontUrlChange = useCallback((id: string, url: string) => {
    setFonts(prev => prev.map(font => {
      if (font.id === id) {
        if (!url.trim()) {
          return {
            ...font,
            url,
            name: 'Введите URL шрифта',
            fontFamily: '',
            isLoading: false,
            hasError: false
          };
        }

        if (url.includes('fonts.googleapis.com')) {
          const updatedFont = {
            ...font,
            url,
            name: 'Загружается...',
            isLoading: true,
            hasError: false
          };

          loadGoogleFont(url)
            .then(fontFamily => {
              setFonts(current => current.map(f => 
                f.id === id 
                  ? { ...f, fontFamily, name: fontFamily || 'Google Font', isLoading: false }
                  : f
              ));
            })
            .catch(() => {
              setFonts(current => current.map(f => 
                f.id === id 
                  ? { ...f, name: 'Ошибка загрузки', isLoading: false, hasError: true }
                  : f
              ));
            });

          return updatedFont;
        } else {
          return {
            ...font,
            url,
            name: 'Неверный URL',
            hasError: true,
            isLoading: false
          };
        }
      }
      return font;
    }));
  }, [loadGoogleFont]);

  const handleFileUpload = useCallback((id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const fontData = e.target?.result;
      if (!fontData) return;

      const fontName = file.name.replace(/\.[^/.]+$/, "");

      const fontFace = new FontFace(fontName, fontData as ArrayBuffer);
      fontFace.load().then(function(loadedFace) {
        document.fonts.add(loadedFace);
        setFonts(prev => prev.map(font => 
          font.id === id 
            ? { ...font, url: fontName, fontFamily: fontName, name: fontName, isLoading: false, hasError: false }
            : font
        ));
      }).catch(function(error) {
        console.error('Ошибка загрузки шрифта:', error);
        setFonts(prev => prev.map(font => 
          font.id === id 
            ? { ...font, name: 'Ошибка загрузки файла', hasError: true, isLoading: false }
            : font
        ));
      });
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleBackgroundChange = useCallback((theme: BackgroundTheme) => {
    setBackgroundTheme(theme);
    if (theme === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, []);

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="logo">Fontopia</div>
          <div className="subtitle">Профессиональный инструмент для сравнения и выбора шрифтов</div>
        </header>

        <div className="controls-panel">
          <div className="controls-header">
            <SettingsIcon className="controls-icon" />
            <h2 className="controls-title">Настройки</h2>
          </div>

          <div className="control-section">
            <label className="control-label">Текст для предварительного просмотра</label>
            <textarea
              className="text-input"
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              placeholder="Введите текст для тестирования шрифтов..."
            />
          </div>

          <div className="control-section font-section">
            <label className="control-label">Управление шрифтами</label>
            <div className="font-inputs">
              {fonts.map(font => (
                <FontInput
                  key={font.id}
                  font={font}
                  onUrlChange={(url) => handleFontUrlChange(font.id, url)}
                  onFileUpload={(file) => handleFileUpload(font.id, file)}
                  onRemove={() => removeFont(font.id)}
                />
              ))}
            </div>
            <button
              className={`btn btn-primary btn-lg ${fonts.length >= maxFonts ? '' : ''}`}
              onClick={addFont}
              disabled={fonts.length >= maxFonts}
            >
              <AddIcon />
              {fonts.length >= maxFonts ? 'Максимум 5 шрифтов' : 'Добавить шрифт'}
            </button>
            
            <LoremGenerator onTextGenerated={setSampleText} />
          </div>

          <div className="control-section">
            <label className="control-label">Цветовая схема</label>
            <div className="theme-selector">
              {[
                { key: 'light', label: 'Светлая', icon: <LightModeIcon /> },
                { key: 'dark', label: 'Тёмная', icon: <DarkModeIcon /> },
                { key: 'sepia', label: 'Сепия', icon: <AutoStoriesIcon /> },
                { key: 'blue', label: 'Голубая', icon: <WaterIcon /> },
                { key: 'green', label: 'Зелёная', icon: <LocalFloristIcon /> }
              ].map(({ key, label, icon }) => (
                <div
                  key={key}
                  className={`theme-option ${backgroundTheme === key ? 'active' : ''}`}
                  onClick={() => handleBackgroundChange(key as BackgroundTheme)}
                >
                  <div className="theme-icon">{icon}</div>
                  <div className="theme-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="preview-panel">
          <div className="preview-header">
            <h2 className="preview-title">
              <PreviewIcon className="preview-icon" />
              Предварительный просмотр
            </h2>
            <div className="preview-controls">
              <span className="btn btn-secondary btn-sm">{fonts.length + 1} шрифтов</span>
            </div>
          </div>

          <div className="font-preview">
            <div className="font-name">
              Системный шрифт
              <span className="font-status status-success">
                <CheckCircleIcon fontSize="small" />
                Активен
              </span>
            </div>
            <div 
              className="font-sample" 
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              {sampleText}
            </div>
          </div>
          
          {fonts.map(font => (
            <div key={font.id} className="font-preview">
              <div className="font-name">
                {font.name}
                <span className={`font-status ${
                  font.isLoading ? 'status-loading' : 
                  font.hasError ? 'status-error' : 
                  'status-success'
                }`}>
                  {font.isLoading ? (
                    <>
                      <HourglassEmptyIcon fontSize="small" />
                      Загрузка
                    </>
                  ) : font.hasError ? (
                    <>
                      <ErrorIcon fontSize="small" />
                      Ошибка
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon fontSize="small" />
                      Готов
                    </>
                  )}
                </span>
              </div>
              <div
                className="font-sample"
                style={{ fontFamily: font.fontFamily || undefined }}
              >
                {sampleText}
              </div>
            </div>
          ))}
        </div>

        <footer className="footer">
          <p>
            <PaletteIcon className="footer-icon" />
            <strong>Fontopia</strong> © 2025 | Open Source под лицензией{' '}
            <a href="LICENSE">AGPL-3.0</a>
          </p>
          <p>
            Создано с <FavoriteIcon className="heart-icon" fontSize="small" /> для типографических энтузиастов
          </p>
        </footer>
      </div>
    </div>
  );
};

interface FontInputProps {
  font: FontData;
  onUrlChange: (url: string) => void;
  onFileUpload: (file: File) => void;
  onRemove: () => void;
}

const FontInput: React.FC<FontInputProps> = ({ font, onUrlChange, onFileUpload, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="font-input-row">
      <div className="font-url-input">
        <input
          type="text"
          value={font.url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://fonts.googleapis.com/css2?family=..."
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".otf,.ttf,.woff,.woff2"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
      <button
        className="btn btn-secondary btn-icon upload-btn"
        onClick={() => fileInputRef.current?.click()}
        title="Загрузить локальный шрифт"
      >
        <FolderOpenIcon />
      </button>
      <button 
        className="btn btn-danger btn-icon remove-btn" 
        onClick={onRemove}
        title="Удалить шрифт"
      >
        <DeleteIcon />
      </button>
    </div>
  );
};

export default App;