import { CgSearch } from 'react-icons/cg';

export default function SearchBar({ placeholder,searchDate , setSearchDate , handleFunction }) {
  return (
    <div className="relative flex items-center w-5/6 md:w-1/6 ">
      <input
        className="w-full h-8 pl-10 pr-3 rounded-full border-none outline-none focus:ring focus:ring-green-500 transition-all"
        type="text"
        placeholder={placeholder}
        value={searchDate}
        onChange={e => setSearchDate(e.target.value)}
        required
      />
      <button className="absolute rounded-full p-2 flex justify-center items-center" onClick={ handleFunction}>
        <CgSearch className="text-xl" />
      </button>
    </div>
  );
}
