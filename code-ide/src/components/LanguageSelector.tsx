interface LanguageSelectorProps {
  language: string;
  onChange: (language: string) => void;
}

const LanguageSelector = ({ language, onChange }: LanguageSelectorProps) => {
  const languages = ['Python', 'JavaScript', 'Java'];

  return (
    <div className="language-selector">
      <select
        value={language}
        onChange={(e) => onChange(e.target.value)}
        className="select"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector; 