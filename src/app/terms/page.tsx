export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-slate-900/40 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-indigo-400 mb-4">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          Last updated: August 31, 2026
        </p>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          By utilizing AgencyOS file assets tools, you authorize the application
          to authenticate and transfer file listings on your behalf to secure
          folders in Google Drive.
        </p>
        <h2 className="text-lg font-semibold text-slate-200 mt-6 mb-2">
          Usage Agreement
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          You agree not to upload any compromised, malicious, or illegal
          content. AgencyOS reserves the right to revoke access token
          associations at any point due to security infractions.
        </p>
      </div>
    </div>
  );
}
