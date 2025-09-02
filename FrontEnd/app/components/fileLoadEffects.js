
export default function FileLoadingEffects({instances}){

    return <div className="flex flex-row flex-wrap gap-4 items-center justify-center  animate-pulse">
        {Array.from({length:instances}).map((_ , index) => {
      return <div
      key={index}
      className={`w-40 h-40  rounded-md shadow-md ${
        index % 3 === 0
          ? 'bg-slate-400/60'
          : index % 3 === 1
          ? 'bg-slate-400/50'
          : 'bg-slate-400/30'
      }`}
    />        })}
  </div>
}