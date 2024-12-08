const SuspenseFallback = () => {
  return (
    <>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C6.48 0 2 4.48 2 10h2zm2 5.29A7.97 7.97 0 014 12H2c0 2.5 1 4.75 2.69 6.29l1.41-1.41z"
            ></path>
          </svg>
          <h2 className="text-lg font-medium text-gray-700">Loading Chat...</h2>
        </div>
      </div>
    </>
  );
};

export default SuspenseFallback;
