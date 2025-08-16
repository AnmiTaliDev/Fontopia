import React, { useState } from 'react';
import { generateLorem, getPresetTexts, LoremOptions } from '../utils/loremGenerator';

// Material UI Icons
import CreateIcon from '@mui/icons-material/Create';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ArticleIcon from '@mui/icons-material/Article';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import AbcIcon from '@mui/icons-material/Abc';
import LanguageIcon from '@mui/icons-material/Language';
import PublicIcon from '@mui/icons-material/Public';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TargetIcon from '@mui/icons-material/GpsFixed';

interface LoremGeneratorProps {
  onTextGenerated: (text: string) => void;
}

const LoremGenerator: React.FC<LoremGeneratorProps> = ({ onTextGenerated }) => {
  const [options, setOptions] = useState<LoremOptions>({
    type: 'sentences',
    count: 3,
    language: 'latin',
    startWithLorem: true
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const presetTexts = getPresetTexts();

  const handleGenerate = () => {
    const generatedText = generateLorem(options);
    onTextGenerated(generatedText);
  };

  const handlePresetSelect = (preset: string) => {
    let text = '';
    switch (preset) {
      case 'typography-en':
        text = presetTexts.typography.en;
        break;
      case 'typography-ru':
        text = presetTexts.typography.ru;
        break;
      case 'typography-mixed':
        text = presetTexts.typography.mixed;
        break;
      case 'sample-en':
        text = presetTexts.sample.en;
        break;
      case 'sample-ru':
        text = presetTexts.sample.ru;
        break;
      case 'sample-mixed':
        text = presetTexts.sample.mixed;
        break;
    }
    onTextGenerated(text);
    setIsOpen(false);
  };

  return (
    <div className="lorem-generator">
      <button 
        className="lorem-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CreateIcon />
        {isOpen ? (
          <>
            Скрыть генератор
            <ExpandLessIcon />
          </>
        ) : (
          <>
            Генератор текста
            <ExpandMoreIcon />
          </>
        )}
      </button>
      
      {isOpen && (
        <div className="lorem-panel">
          <div className="lorem-controls">
            <div className="lorem-control-group">
              <label>Тип генерации</label>
              <select 
                value={options.type} 
                onChange={(e) => setOptions({...options, type: e.target.value as LoremOptions['type']})}
              >
                <option value="words">Слова</option>
                <option value="sentences">Предложения</option>
                <option value="paragraphs">Абзацы</option>
                <option value="pangram">Панграмма</option>
              </select>
            </div>

            {options.type !== 'pangram' && (
              <div className="lorem-control-group">
                <label>Количество</label>
                <input 
                  type="number" 
                  min="1" 
                  max="20" 
                  value={options.count}
                  onChange={(e) => setOptions({...options, count: parseInt(e.target.value) || 1})}
                />
              </div>
            )}

            <div className="lorem-control-group">
              <label>Язык</label>
              <select 
                value={options.language} 
                onChange={(e) => setOptions({...options, language: e.target.value as LoremOptions['language']})}
              >
                <option value="latin">Латинский</option>
                <option value="russian">Русский</option>
                <option value="mixed">Смешанный</option>
              </select>
            </div>

            {options.language !== 'russian' && options.type === 'words' && (
              <div className="lorem-control-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={options.startWithLorem}
                    onChange={(e) => setOptions({...options, startWithLorem: e.target.checked})}
                    style={{ marginRight: '8px' }}
                  />
                  Начать с "Lorem ipsum"
                </label>
              </div>
            )}

            <button className="lorem-generate-btn" onClick={handleGenerate}>
              <AutoFixHighIcon />
              Сгенерировать текст
            </button>
          </div>

          <div className="lorem-presets">
            <h4>
              <TargetIcon fontSize="small" />
              Готовые шаблоны
            </h4>
            <div className="preset-buttons">
              <button onClick={() => handlePresetSelect('typography-en')}>
                <AbcIcon fontSize="small" />
                Типографика (EN)
              </button>
              <button onClick={() => handlePresetSelect('typography-ru')}>
                <AbcIcon fontSize="small" />
                Типографика (RU)
              </button>
              <button onClick={() => handlePresetSelect('typography-mixed')}>
                <AbcIcon fontSize="small" />
                Типографика (Mix)
              </button>
              <button onClick={() => handlePresetSelect('sample-en')}>
                <ArticleIcon fontSize="small" />
                Образец (EN)
              </button>
              <button onClick={() => handlePresetSelect('sample-ru')}>
                <ArticleIcon fontSize="small" />
                Образец (RU)
              </button>
              <button onClick={() => handlePresetSelect('sample-mixed')}>
                <ArticleIcon fontSize="small" />
                Образец (Mix)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoremGenerator;