import React, { useEffect, useState } from "react";
import { Popover, Input } from "antd";
import Flag from "react-world-flags";
import styles from "./index.module.less";
import { useRecoilState } from "recoil";
import { sourceLanguageState, targetLanguageState } from "@/stores/language";
import { Option } from "@/models/utils.interface";
import ISO6391 from "iso-639-1";

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
  const initialCountriesList = options
    ? options.map((option) => ({
        name: option.label,
        code: option.value,
      }))
    : [
        { name: "English", code: "EN" },
        { name: "Germany", code: "DE" },
        { name: "Slovakia", code: "sk" },
      ];

  const [visible, setVisible] = useState(false);
  const [countriesList, setCountriesList] = useState(initialCountriesList);
  const [filteredCountries, setFilteredCountries] = useState(countriesList);
  const [selectedLanguage, setSelectedLanguage] = useRecoil
    ? useRecoilState(atom!)
    : useState(initialLanguage);

  useEffect(() => {
    if (options) {
      setCountriesList(
        options.map((option) => ({
          name: ISO6391.getName(option.value),
          code: option.value,
        }))
      );
    }
  }, [options]);

  const getFlagCode = (code: string) => (code === "EN" ? "GB" : code);

  const handleCountrySelection = (country: any) => {
    if (country.code === disabledLanguage) return;
    setSelectedLanguage(country.code);
    if (!useRecoil && onLanguageChange) onLanguageChange(country.code);
    setVisible(false);
  };

  const handleSearch = (event: { target: { value: string } }) => {
    const searchText = event.target.value.toLowerCase();
    const filtered = countriesList.filter((country) =>
      country.name.toLowerCase().includes(searchText)
    );
    setFilteredCountries(filtered);
  };

  const selectedCountry = filteredCountries.find(
    (country) => country.code === selectedLanguage
  );

  return (
    <div
      className={styles.languageSelectorBox}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setVisible((prevVisible) => !prevVisible);
        }
      }}
    >
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
                    height={"16"}
                    width={"24"}
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
