export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-slate-900/40 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-indigo-400 mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          Last updated: August 31, 2026
        </p>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          AgencyOS values your privacy. We only access and store the information
          necessary to perform file management integration actions via Google
          Drive.
        </p>
        <h2 className="text-lg font-semibold text-slate-200 mt-6 mb-2">
          Information We Collect
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          Our application accesses metadata for uploaded files (names, sizes,
          types, and folder paths) solely to reference them in database records.
          We do not download, sell, or utilize your files outside the scope of
          project coordination.
        </p>
      </div>
    </div>
  );
}
