export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-3xl">
        <a
          href="/"
          className="text-sm text-slate-500 hover:text-slate-300"
        >
          ← Back to Event Wall
        </a>

        <h1 className="mt-8 text-4xl font-bold text-white">
          Privacy Policy
        </h1>

        <p className="mt-6 text-slate-400">
          Event Wall is designed to be simple, lightweight, and easy to
          use.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">
            Local Storage
          </h2>

          <p className="mt-2 text-slate-400">
            When you add YouTube links to your wall, they are saved
            locally in your browser using local storage. This allows
            your wall to remain available when you refresh or revisit
            the site from the same device.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">
            No Account Required
          </h2>

          <p className="mt-2 text-slate-400">
            Event Wall does not require an account to use the core
            utility.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">
            Third-Party Content
          </h2>

          <p className="mt-2 text-slate-400">
            Videos displayed on Event Wall are provided through YouTube
            embeds. YouTube may collect data according to its own
            privacy policies and terms.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">
            Advertising
          </h2>

          <p className="mt-2 text-slate-400">
            Event Wall may display advertisements in the future.
            Advertising providers may use cookies or related
            technologies according to their own privacy policies.
          </p>
        </section>

        <p className="mt-12 text-xs text-slate-600">
          Event Wall is not affiliated with or endorsed by YouTube.
        </p>
      </div>
    </main>
  );
}