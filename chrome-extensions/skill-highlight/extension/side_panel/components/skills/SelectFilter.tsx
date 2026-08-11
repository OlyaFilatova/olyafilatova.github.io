export default function SelectFilter({ label, currentValue, options, onChange }: {
  label: string;
  options: Array<
    {
      value: string;
      text: string;
    }
  >;
  currentValue: string | undefined;
  onChange?: React.ChangeEventHandler<HTMLSelectElement, HTMLSelectElement>;
}) {
  return (
    <label>
      <span>{label}</span>
      <select onChange={onChange} value={currentValue}>
        {
          options.map(({ value, text}) => <option value={value}>{text}</option>)
        }
      </select>
    </label>
  )
}
