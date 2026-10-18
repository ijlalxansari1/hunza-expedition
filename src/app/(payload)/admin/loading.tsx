export default function AdminLoading() {
  return (
    <main className="min-h-screen animate-pulse bg-[#f5f7f5] px-4 py-7 sm:px-6 lg:px-9" aria-busy="true">
      <span className="sr-only">Loading admin data</span>
      <div className="mx-auto max-w-[1440px] space-y-7">
        <div className="space-y-3 border-b border-[#d9e1df] pb-6">
          <div className="h-3 w-28 bg-[#d9e1df]" />
          <div className="h-8 w-64 max-w-full bg-[#d9e1df]" />
          <div className="h-4 w-96 max-w-full bg-[#e4eae7]" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-32 border border-[#d9e1df] bg-white" />
          ))}
        </div>
        <div className="grid gap-7 xl:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.8fr)]">
          <div className="h-72 border border-[#d9e1df] bg-white" />
          <div className="h-56 border border-[#d9e1df] bg-white" />
        </div>
      </div>
    </main>
  );
}