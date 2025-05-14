import React from "react";

interface ButtonProps {
  content: React.ReactNode;
  active?: boolean;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({
  content,
  active = false,
  style = {},
  onClick = () => {},
}) => {
  // Ensure default styles are applied if not provided
  const updatedStyle: React.CSSProperties = {
    ...style,
    paddingBlock: style.paddingBlock ?? "5px",
    fontSize: style.fontSize ?? "clamp(10px, 3vw, 15px)",
    textAlign: style.textAlign ?? "center",
    backgroundColor:
      style.backgroundColor ?? (active ? "rgb(25,45,35)" : "rgb(32, 53, 42)"),
    border: style.border ?? (active ? "1px inset black" : "1px outset black"),
    display: style.display ?? "flex",
    flexDirection: style.flexDirection ?? "column",
    justifyContent: style.justifyContent ?? "center",
    alignItems: style.alignItems ?? "center",
  };

  return (
    <button style={updatedStyle} onClick={onClick}>
      {content}
    </button>
  );
};

export default Button;
