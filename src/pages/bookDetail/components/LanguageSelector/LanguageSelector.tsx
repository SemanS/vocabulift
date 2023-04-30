import React, { useEffect, useState } from "react";
import { Popover, Input } from "antd";
import Flag from "react-world-flags";
import styles from "./index.module.less";
import { useRecoilState } from "recoil";
import { sourceLanguageState, targetLanguageState } from "@/stores/language";
import { Option } from "@/models/utils.interface";

interface LanguageSelectorProps {
  atom?: typeof targetLanguageState | typeof sourceLanguageState;
  disabledLanguage?: string;
  useRecoil?: boolean;
  onLanguageChange?: (language: string) => void;
  initialLanguage?: string;
  options?: Option[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  atom,
  disabledLanguage,
  useRecoil = false,
  onLanguageChange,
  initialLanguage,
  options,
}) => {
  const [countries, setCountries] = useState(() => {
    if (options) {
      return options.map((option) => ({
        name: option.label,
        code: option.value,
      }));
    }
    return [
      { name: "English", code: "EN" },
      { name: "Germany", code: "DE" },
      { name: "Slovakia", code: "sk" },
    ];
  });
  const [visible, setVisible] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [selectedLanguage, setSelectedLanguage] = useRecoil
    ? useRecoilState(atom!)
    : useState(initialLanguage);

  useEffect(() => {
    console.log("options" + JSON.stringify(options, null, 2));
    if (options) {
      const mappedOptions = options.map((option) => ({
        name: option.value,
        code: option.value,
      }));
      console.log("mappedOptions" + JSON.stringify(mappedOptions, null, 2));
      setCountries(mappedOptions);
    }
  }, [options]);

  const getFlagCode = (code: string) => {
    if (code === "EN") {
      return "GB";
    }
    return code;
  };

  const handleCountrySelection = (country: any) => {
    if (country.code === disabledLanguage) {
      return;
    }
    setSelectedLanguage(country.code);
    if (!useRecoil && onLanguageChange) {
      onLanguageChange(country.code);
    }
    setVisible(false);
  };

  const handleSearch = (event) => {
    if (options) {
      setFilteredCountries(countries);
    } else {
      const searchText = event.target.value.toLowerCase();
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(searchText)
      );
      setFilteredCountries(filtered);
    }
  };

  const selectedCountry = countries.find(
    (country) => country.code === selectedLanguage
  );

  return (
    <div className={styles.languageSelectorBox}>
      <Popover
        content={
          <div className={styles.customPopover}>
            {!options && (
              <Input
                size="large"
                placeholder="Type to search"
                onChange={handleSearch}
              />
            )}
            <div className={styles.itemsList}>
              {filteredCountries.map((country, index) => (
                <div
                  key={index}
                  className={styles.item}
                  onClick={() => handleCountrySelection(country)}
                  style={{
                    cursor:
                      country.code === disabledLanguage
                        ? "not-allowed"
                        : "pointer",
                    opacity: country.code === disabledLanguage ? 0.5 : 1,
                  }}
                >
                  <Flag
                    className={styles.flag}
                    code={getFlagCode(country.code.toUpperCase())}
                    height="16"
                    width="24"
                  />
                  {country.name}
                </div>
              ))}
            </div>
          </div>
        }
        trigger="click"
        open={visible}
        onOpenChange={(isVisible) => setVisible(isVisible)}
      >
        <span
          style={{
            cursor: "pointer",
            opacity: selectedCountry?.code === disabledLanguage ? 0.5 : 1,
          }}
        >
          {selectedCountry && (
            <Flag
              className={styles.flag}
              code={getFlagCode(selectedCountry.code.toUpperCase())}
              height="16"
              width="24"
            />
          )}
          {selectedCountry ? selectedCountry.name : "Click here to search"}
        </span>
      </Popover>
    </div>
  );
};

export default LanguageSelector;
