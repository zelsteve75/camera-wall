export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="text-sm text-slate-500 hover:text-slate-300">
          ← Back to Event Wall
        </a>

        <h1 className="mt-8 text-4xl font-bold text-white">
          About Event Wall
        </h1>

        <p className="mt-6 text-slate-300">
          Event Wall is a simple multiview utility that lets you watch up to 4
          YouTube videos in one clean view.
        </p>

        <p className="mt-4 text-slate-400">
          It was built for people who are tired of juggling multiple tabs while
          watching sports, news, podcasts, livestreams, study videos, finance
          coverage, and more.
        </p>

        <p className="mt-4 text-slate-400">
          Event Wall does not host videos. It simply displays YouTube videos
          using standard YouTube embeds.
        </p>

        <p className="mt-8 text-xs text-slate-600">
          Event Wall is not affiliated with or endorsed by YouTube.
        </p>
      </div>
    </main>
  );
}