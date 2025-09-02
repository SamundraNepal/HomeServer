export default function U_Button({ b_name, b_function, red , buttonType ="submit" }) {
  return (
    <button
     type={buttonType}
      className={`bg-slate-100 w-40 rounded ${
        !red ? 'hover:bg-amber-900' : 'hover:bg-red-500'
      } hover:text-white p-2 text-black font-bold`}
      onClick={b_function}
    >
      {b_name}
    </button>
  );
}
