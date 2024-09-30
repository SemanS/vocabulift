import React, { useEffect, useState } from "react";
import { Popover, Input, Typography } from "antd";
import styles from "./index.module.less";
import { useRecoilState } from "recoil";
import { Option } from "@/models/utils.interface";
import ISO6391 from "iso-639-1";
import { updateUser } from "@/services/userService";
import { User } from "@/models/user";
import { userState } from "@/stores/user";
import { getFlagCode } from "@/utils/utilMethods";
import { SvgIcon } from "@/pages/webLayout/shared/common/SvgIcon";
import { useIntl } from "react-intl";
import { languages } from "@/utils/languages";

interface LanguageSelectorProps {
  languageProp?: keyof User;
  disabledLanguage?: string;
  useRecoil?: boolean;
  onLanguageChange?: (language: string) => void;
  options?: Option[];
  text?: string;
  style?: React.CSSProperties;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = (props) => {
  const {
    languageProp,
    disabledLanguage,
    useRecoil = false,
    onLanguageChange,
    options,
    text,
    style,
  } = props;

  const initCountriesList = options
    ? options.map(({ label, value }) => ({ name: label, code: value }))
    : languages;

  const [visible, setVisible] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [countriesList, setCountriesList] = useState(initCountriesList);
  const [filteredCountries, setFilteredCountries] = useState(countriesList);
  const [selectedLanguage, setSelectedLanguage] = useState(user[languageProp!]);

  const intl = useIntl();

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

  useEffect(() => {
    if (languageProp) setSelectedLanguage(user[languageProp]);
  }, [user]);

  const handleCountrySelection = async (
    country: any,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    if (country.code === disabledLanguage) {
      const previousSourceLanguage = user.sourceLanguage;

      const updatedUserEntity: Partial<User> = {
        sourceLanguage: user.targetLanguage,
        targetLanguage: user.sourceLanguage,
      };

      await updateUser(updatedUserEntity);

      /* setUser((prevUser) => ({
        ...prevUser,
        sourceLanguage: user.targetLanguage,
        targetLanguage: previousSourceLanguage,
      })); */
    }
    setSelectedLanguage(country.code);
    if (!useRecoil && onLanguageChange) onLanguageChange(country.code);
    setVisible(false);

    if (languageProp && useRecoil)
      try {
        const updatedUserEntity: Partial<User> = {
          [languageProp]: country.code,
        };
        await updateUser(updatedUserEntity);

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
    <div
      className={styles.languageSelectorBox}
      onClick={() => setVisible(true)}
      style={{ ...style, borderRadius: "15px" }}
    >
      <Typography.Text
        style={{ fontSize: "16px" }}
        {...{ onClick: handleClick }}
      >
        {text}
      </Typography.Text>
      <Popover
        content={
          <div className={styles.customPopover}>
            {!options && (
              <Input
                size="large"
                placeholder={intl.formatMessage({
                  id: "language.search",
                })}
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
                    cursor: "pointer",
                    /*  country.code === disabledLanguage
                        ? "not-allowed"
                        : "pointer", */
                    /* opacity:
                      country.code === disabledLanguage && useRecoil ? 0.5 : 1, */
                  }}
                >
                  <SvgIcon
                    className={styles.flag}
                    code={getFlagCode(country.code)}
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
        /* style={{
            cursor: "pointer",
            opacity:
              selectedCountry?.code === disabledLanguage && useRecoil ? 0.5 : 1,
          }} */
        >
          {selectedCountry && (
            <SvgIcon
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
