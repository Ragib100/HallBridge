'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white rounded-xl shadow-md p-6 max-w-md text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Something went wrong
                </h2>
                <p className="text-gray-500 mb-4">
                    {error.message || 'An unexpected error occurred.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        onClick={reset}
                        className="px-4 py-2 rounded-lg bg-[#2D6A4F] text-white hover:bg-[#245a42] cursor-pointer"
                    >
                        Try again
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                    >
                        Refresh page
                    </button>
                </div>
            </div>
        </div>
    );
}
