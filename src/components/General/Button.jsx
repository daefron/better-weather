export default function Button({
  content = "",
  active = false,
  style = {},
  onClick = () => {},
}) {
  !style.paddingBlock ? (style.paddingBlock = "5px") : null;
  !style.fontSize ? (style.fontSize = "clamp(10px, 3vw, 15px)") : null;
  !style.textAlign ? (style.textAlign = "center") : null;
  !style.backgroundColor
    ? (style.backgroundColor = active ? "rgb(25,45,35)" : "rgb(32, 53, 42)")
    : null;
  !style.border
    ? (style.border = active ? "1px inset black" : "1px outset black")
    : null;
  !style.display ? (style.display = "flex") : null;
  !style.flexDirection ? (style.flexDirection = "column") : null;
  !style.justifyContent ? (style.justifyContent = "center") : null;
  !style.alignItems ? (style.alignItems = "center") : null;
  return (
    <button style={style} onClick={onClick}>
      {content}
    </button>
  );
}
