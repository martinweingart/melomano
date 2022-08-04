import "./Dropdown.scss";

export function Dropdown({ options, value, onChange }) {
  return (
    <select
      className="Dropdown"
      onChange={(e) => onChange(e.target.value)}
      value={value}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
