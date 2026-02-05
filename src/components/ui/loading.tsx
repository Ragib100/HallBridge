import { Spinner } from "@/components/ui/spinner";

export function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
            <Spinner className="w-8 h-8" />
            <p className="text-gray-600">Loading...</p>
        </div>
    );
}