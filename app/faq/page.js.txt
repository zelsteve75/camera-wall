export default function FAQPage() {
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
          FAQ
        </h1>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white">
              What is Event Wall?
            </h2>

            <p className="mt-2 text-slate-400">
              Event Wall lets you watch up to 4 YouTube videos at once
              in one clean multiview layout.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              Does it work with livestreams?
            </h2>

            <p className="mt-2 text-slate-400">
              Yes. If the livestream supports embedding, it should work
              inside Event Wall.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              Are my videos saved?
            </h2>

            <p className="mt-2 text-slate-400">
              Yes. Your wall is saved locally on your device using your
              browser’s local storage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              Does Event Wall host videos?
            </h2>

            <p className="mt-2 text-slate-400">
              No. Event Wall does not host or upload videos. It uses
              standard YouTube embeds.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              Why won’t some videos play?
            </h2>

            <p className="mt-2 text-slate-400">
              Some YouTube videos have embedding disabled by the creator.
              If that happens, try another video link.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}