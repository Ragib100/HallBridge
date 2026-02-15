import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5E6E0] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex min-h-150">
        {/* Left Panel - Green Section */}
        <div className="hidden md:flex w-2/5 bg-[#2D6A4F] flex-col items-center justify-between p-8 relative overflow-hidden">
          {/* Logo */}
          <div className="w-full">
            <Image
              src="/logos/vector/default-monochrome-white2.svg"
              alt="HallBridge"
              width={180}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          {/* Tagline */}
          <div className="text-center z-10">
            <p className="text-[#7CB9A8] text-xl font-medium">Connecting halls</p>
            <p className="text-white text-lg">and people seamlessly</p>
          </div>

          {/* Decorative Shapes */}
          <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none">
            {/* Large Circle */}
            <div className="absolute bottom-20 left-4 w-24 h-24 rounded-full border-2 border-[#4A8B7C] opacity-50" />
            
            {/* Triangle */}
            <div className="absolute bottom-32 left-16">
              <svg width="60" height="52" viewBox="0 0 60 52" fill="none">
                <path d="M30 0 L60 52 L0 52 Z" fill="#4A8B7C" opacity="0.5" />
              </svg>
            </div>

            {/* Small Circle */}
            <div className="absolute bottom-8 right-8 w-16 h-16 rounded-full border-2 border-[#4A8B7C] opacity-40" />
            
            {/* Small Triangle */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <svg width="40" height="35" viewBox="0 0 40 35" fill="none">
                <path d="M20 0 L40 35 L0 35 Z" fill="#3D7A65" opacity="0.6" />
              </svg>
            </div>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-10 w-32 h-32 rounded-full border border-white" />
          </div>
        </div>

        {/* Right Panel - Form Section */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
