export default function U_input({
  PlaceHolder,
  name,
  Value,
  OnChange,
  Type,
  Size,
  accept = '',
}) {
  return (
    <input
      required
      type={Type}
      placeholder={PlaceHolder}
      name={name}
      value={Value}
      onChange={OnChange}
      accept={accept}
      multiple
      className={`p-2 rounded text-black bg-slate-200 ${Size} border-none outline-none focus:ring focus:ring-green-50 max-sm:w-full`}
    />
  );
}
