export default function UploadFilesNotifications({ progress }) {
  return (
    <>
      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full mt-4">
          <div
            className="bg-green-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none"
            style={{ width: `${progress}%` }}
          >
            {progress.toFixed(0)}%
          </div>
          <div className=" absolute flex flex-col justify-content text-center w-full ">
          <p className="text-white animate-pulse text-xl font-bold">{progress > 90 && 'Optimizing files'}</p>
          </div>
        </div>
      )}
    </>
  );
}
