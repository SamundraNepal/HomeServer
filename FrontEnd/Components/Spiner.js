export default function Sppiner({ Size = 'p-60 ', width = 'w-full' }) {
  return (
    <div
      className={`flex flex-col  shadow-sm rounded-xl h-full ${width} max-sm:w-full`}
    >
      <div className="flex flex-auto flex-col justify-center items-center p-64 max-sm:p-5">
        <div className="flex flex-col items-center justify-center">
          <div
            className={`animate-spin inline-block size-6 border-[20px] border-current border-t-transparent rounded-full ${Size} max-sm:p-40`}
            role="status"
            aria-label="loading"
          ></div>
          <h1 className="font-bold">Loading</h1>
        </div>
      </div>
    </div>
  );
}
