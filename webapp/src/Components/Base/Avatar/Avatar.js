import "./Avatar.scss";

function getInitials(name) {
  const [first, second] = name.split(" ");
  return `${first.charAt(0)}${second ? second.charAt(0) : ""}`;
}

export const Avatar = function ({ name }) {
  return <p className="Avatar">{getInitials(name)}</p>;
};
