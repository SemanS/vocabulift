import React, { useState } from "react";
import { Popover, Input } from "antd";
import Flag from "react-world-flags";
import styles from "./index.module.less";
import { useRecoilState } from "recoil";
import { sourceLanguageState, targetLanguageState } from "@/stores/language";

interface LanguageSelectorProps {
  atom: typeof targetLanguageState | typeof sourceLanguageState;
  disabledLanguage?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  atom,
  disabledLanguage,
}) => {
  const countries = [
    { name: "United States", code: "en" },
    { name: "United Kingdom", code: "GB" },
    { name: "Germany", code: "DE" },
    { name: "Slovakia", code: "sk" },
  ];
  const [visible, setVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useRecoilState(atom);
  const [filteredCountries, setFilteredCountries] = useState(countries);

  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(searchText)
    );
    setFilteredCountries(filtered);
  };

  const handleCountrySelection = (country) => {
    if (country.code === disabledLanguage) {
      return;
    }
    setSelectedLanguage(country.code);
    setVisible(false);
  };

  const selectedCountry = countries.find(
    (country) => country.code === selectedLanguage
  );

  return (
    <div className={styles.languageSelectorBox}>
      <Popover
        content={
          <div className={styles.customPopover}>
            <Input
              size="large"
              placeholder="Type to search"
              onChange={handleSearch}
            />
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
                    code={country.code}
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
              code={selectedCountry.code}
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
