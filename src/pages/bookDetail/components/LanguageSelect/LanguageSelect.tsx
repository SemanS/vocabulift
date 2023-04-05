import React, { FC } from "react";
import { Select } from "antd";

interface LanguageSelectProps {
  id: string;
  defaultValue?: "en" | "sk" | "cz";
  onChange?: (value: "en" | "sk" | "cz") => void;
  options: { value: string; label: string }[];
  disabledValue?: string;
}

const LanguageSelect: FC<LanguageSelectProps> = ({
  id,
  defaultValue,
  onChange,
  options,
  disabledValue,
}) => {
  return (
    <Select
      defaultValue={defaultValue}
      style={{ width: 120 }}
      onChange={onChange}
      options={options.map((option) => ({
        ...option,
        disabled: option.value === disabledValue,
      }))}
    />
  );
};

export default LanguageSelect;
