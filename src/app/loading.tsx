// app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
      <div className="text-center">
        {/* Animasyonlu Çiçek */}
        <div className="relative">
          <div className="text-8xl animate-bounce">
            🌸
          </div>
          <div className="absolute inset-0 text-8xl animate-ping opacity-50">
            🌸
          </div>
        </div>

        {/* Loading Text */}
        <p className="mt-8 text-xl text-gray-600 animate-pulse">
          Yükleniyor...
        </p>

        {/* Loading Bar */}
        <div className="mt-4 w-64 mx-auto">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-pink-600 animate-loading-bar" />
          </div>
        </div>
      </div>
    </div>
  )
}