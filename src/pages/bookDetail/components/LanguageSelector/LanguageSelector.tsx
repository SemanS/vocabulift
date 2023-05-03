import React, { useEffect, useState } from "react";
import { Popover, Input, Typography } from "antd";
import Flag from "react-world-flags";
import styles from "./index.module.less";
import { useRecoilState } from "recoil";
import { Option } from "@/models/utils.interface";
import ISO6391 from "iso-639-1";
import { updateUser } from "@/services/userService";
import { User, UserEntity } from "@/models/user";
import { userState } from "@/stores/user";

interface LanguageSelectorProps {
  languageProp: keyof User;
  disabledLanguage?: string;
  useRecoil?: boolean;
  onLanguageChange?: (language: string) => void;
  options?: Option[];
  text?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = (props) => {
  const {
    languageProp,
    disabledLanguage,
    useRecoil = false,
    onLanguageChange,
    options,
    text,
  } = props;

  const initCountriesList = options
    ? options.map(({ label, value }) => ({ name: label, code: value }))
    : [
        { name: "English", code: "en" },
        { name: "Germany", code: "de" },
        { name: "Slovakia", code: "sk" },
        { name: "French", code: "fr" },
      ];

  const [visible, setVisible] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [countriesList, setCountriesList] = useState(initCountriesList);
  const [filteredCountries, setFilteredCountries] = useState(countriesList);
  const [selectedLanguage, setSelectedLanguage] = useState(user[languageProp]);

  useEffect(() => {
    if (options) {
      setCountriesList(
        options.map(({ value }) => ({
          name: ISO6391.getName(value),
          code: value,
        }))
      );
    }
  }, [options]);

  const getFlagCode = (code: string) => (code === "en" ? "gb" : code);

  const handleCountrySelection = async (
    country: any,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Move this line outside the conditional block
    if (country.code === disabledLanguage) return;
    setSelectedLanguage(country.code);
    if (!useRecoil && onLanguageChange) onLanguageChange(country.code);
    setVisible(false);

    try {
      const updatedUserEntity: Partial<User> = {
        [languageProp]: country.code,
      };
      await updateUser(updatedUserEntity as UserEntity);

      setUser((prevUser: User) => ({
        ...prevUser,
        [languageProp]: country.code,
      }));
    } catch (error) {
      console.error("Error updating user entity:", error);
    }
  };

  const handleSearch = ({
    target: { value },
  }: {
    target: { value: string };
  }) => {
    const searchText = value.toLowerCase();
    const filtered = countriesList.filter((country) =>
      country.name.toLowerCase().includes(searchText)
    );
    setFilteredCountries(filtered);
  };

  const selectedCountry = filteredCountries.find(
    (country) => country.code === selectedLanguage
  );

  const handleClick = () => setVisible((prevVisible) => !prevVisible);

  return (
    <div className={styles.languageSelectorBox} {...{ onClick: handleClick }}>
      <Typography.Text style={{ fontSize: "16px" }}>{text}</Typography.Text>
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
                  onClick={(event) => {
                    handleCountrySelection(country, event);
                  }}
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
                    code={getFlagCode(country.code)}
                    height={"16"}
                    width={"24"}
                    onClick={handleClick}
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
              code={getFlagCode(selectedCountry.code)}
              height="32"
              width="48"
            />
          )}
          {selectedCountry ? (
            <span style={{ fontSize: "16px" }}>{selectedCountry.name}</span>
          ) : (
            "Click here to search"
          )}
        </span>
      </Popover>
    </div>
  );
};

export default LanguageSelector;
