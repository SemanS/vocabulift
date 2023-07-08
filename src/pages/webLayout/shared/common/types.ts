export interface IContainerProps {
  border?: boolean;
  children: React.ReactNode;
}

export interface IButtonProps {
  color?: string;
  fixedWidth?: boolean;
  name?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface ISvgIconProps {
  src: string;
  width: string;
  height: string;
}

export interface IInputProps {
  name: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}

export interface IValidateProps {
  name: string;
  message: string;
  email: string;
}
