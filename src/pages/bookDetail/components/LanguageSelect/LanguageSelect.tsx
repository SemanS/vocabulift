import React, { FC } from "react";
import { Select } from "antd";
import { RecoilState, useRecoilState } from "recoil";

interface LanguageSelectProps {
  id: string;
  atom: RecoilState<"en" | "sk" | "cz">;
  options: { value: string; label: string }[];
  disabledValue?: string;
}

const LanguageSelect: FC<LanguageSelectProps> = ({
  id,
  atom,
  options,
  disabledValue,
}) => {
  const [language, setLanguage] = useRecoilState(atom);

  return (
    <Select
      value={language}
      style={{ width: 120 }}
      onChange={(value) => setLanguage(value as "en" | "sk" | "cz")}
      options={options.map((option) => ({
        ...option,
        disabled: option.value === disabledValue,
      }))}
    />
  );
};

export default LanguageSelect;
