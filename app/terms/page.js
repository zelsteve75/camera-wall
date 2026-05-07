export default function TermsPage() {
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
          Terms of Service
        </h1>

        <p className="mt-6 text-slate-400">
          By using Event Wall, you agree to use the service responsibly
          and in accordance with applicable laws and platform policies.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">
            Embedded Content
          </h2>

          <p className="mt-2 text-slate-400">
            Event Wall does not host videos or media content. Videos are
            displayed using publicly available YouTube embeds.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">
            Availability
          </h2>

          <p className="mt-2 text-slate-400">
            Event Wall is provided on an “as is” basis without guarantees
            of uninterrupted availability or functionality.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">
            Third-Party Services
          </h2>

          <p className="mt-2 text-slate-400">
            Third-party platforms such as YouTube may change their
            policies, embedding permissions, or services at any time.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">
            Limitation of Liability
          </h2>

          <p className="mt-2 text-slate-400">
            Event Wall is intended as a lightweight viewing utility. Use
            of the site is at your own discretion and risk.
          </p>
        </section>

        <p className="mt-12 text-xs text-slate-600">
          Event Wall is not affiliated with or endorsed by YouTube.
        </p>
      </div>
    </main>
  );
}