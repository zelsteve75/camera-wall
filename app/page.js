"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "event-wall-videos";
const FREE_VIDEO_LIMIT = 4;

const useCases = {
  Sports: {
    title: "Sports Multiview",
    description:
      "Watch multiple games, fights, highlights, or sports commentary streams without constantly switching tabs.",
    examples: [
      "Follow multiple games at once",
      "Track fantasy sports matchups",
      "Watch boxing, MMA, and post-fight coverage together",
    ],
  },
  News: {
    title: "News Monitoring",
    description:
      "Keep several news feeds, live updates, or commentary videos visible in one clean view.",
    examples: [
      "Monitor breaking news coverage",
      "Compare different live reports",
      "Follow local, national, and financial news together",
    ],
  },
  Podcasts: {
    title: "Podcast Workspace",
    description:
      "Queue up interviews, longform conversations, or commentary videos and manage them from one screen.",
    examples: [
      "Compare different podcast episodes",
      "Keep interviews ready while working",
      "Monitor several creator conversations",
    ],
  },
  Study: {
    title: "Study & Research",
    description:
      "Use Event Wall as a lightweight learning dashboard for tutorials, lectures, walkthroughs, or explanations.",
    examples: [
      "Compare coding tutorials",
      "Watch multiple lectures side-by-side",
      "Use language learning videos together",
    ],
  },
  Finance: {
    title: "Finance & Market Watching",
    description:
      "Monitor finance videos, market commentary, earnings coverage, and trading discussions in one place.",
    examples: [
      "Watch market coverage and commentary",
      "Track crypto or stock livestreams",
      "Follow earnings or economic updates",
    ],
  },
  Livestreams: {
    title: "Livestream Control Room",
    description:
      "Build a simple live-event dashboard for ongoing streams, events, webcams, or real-time coverage.",
    examples: [
      "Watch several live events at once",
      "Monitor creator livestreams",
      "Follow weather, launch, or event streams",
    ],
  },
  Recipes: {
  title: "Recipe & Meal Planning",
  description:
    "Follow multiple cooking videos at once, compare recipes, or keep breakfast, lunch, dinner, and dessert ideas visible while planning meals.",
  examples: [
    "Compare different recipe videos",
    "Plan breakfast, lunch, dinner, and dessert",
    "Follow cooking tutorials side-by-side",
  ],
},
}

function getSavedVideos() {
  if (typeof window === "undefined") return [];

  try {
    const savedVideos = localStorage.getItem(STORAGE_KEY);
    return savedVideos ? JSON.parse(savedVideos) : [];
  } catch {
    return [];
  }
}

function getYouTubeId(url) {
  try {
    const parsed = new URL(url.trim());

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.split("/").filter(Boolean)[0] || null;
    }

    const watchId = parsed.searchParams.get("v");
    if (watchId) return watchId;

    const parts = parsed.pathname.split("/").filter(Boolean);

    if (["embed", "live", "shorts"].includes(parts[0]) && parts[1]) {
      return parts[1];
    }

    return null;
  } catch {
    return null;
  }
}

function EmptyVideoSlot({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="group h-full min-h-[220px] rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 transition hover:border-slate-500 hover:bg-slate-900"
    >
      <div className="flex h-full flex-col items-center justify-center text-slate-500 transition group-hover:text-slate-300">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-950">
          <Plus className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium">Add Video</p>
      </div>
    </button>
  );
}

function VideoCard({ video, focus = false, onFocus, onEdit, onDelete }) {
  return (
    <motion.div
      layout
      className="h-full min-h-[220px]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      <Card className="h-full overflow-hidden rounded-2xl border-slate-800 bg-black shadow-xl shadow-black/20">
        <div className="relative h-full bg-black">
          <iframe
            className="h-full w-full"
            src={video.embedUrl}
            title={`YouTube Video ${video.id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            {!focus && (
              <>
                <Button
                  onClick={() => onEdit(video)}
                  size="icon"
                  variant="secondary"
                  className="h-9 w-9 rounded-full bg-black/70 text-white hover:bg-black"
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  onClick={() => onDelete(video.id)}
                  size="icon"
                  variant="secondary"
                  className="h-9 w-9 rounded-full bg-red-500/90 text-white hover:bg-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}

            <Button
              onClick={() => onFocus(video)}
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full bg-white/90 text-slate-950 hover:bg-white"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function InfoModal({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">{title}</h2>

          <Button
            onClick={onClose}
            variant="secondary"
            size="icon"
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-2 text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function EventWall() {
  const [focusedVideo, setFocusedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoList, setVideoList] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedUseCase, setSelectedUseCase] = useState("Sports");
  const [activeInfoModal, setActiveInfoModal] = useState(null);

  useEffect(() => {
    setVideoList(getSavedVideos());
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(videoList));
    }
  }, [videoList, hasLoaded]);

  const reachedFreeLimit = videoList.length >= FREE_VIDEO_LIMIT;
  const emptyFreeSlots = Math.max(FREE_VIDEO_LIMIT - videoList.length, 0);
  const currentUseCase = useCases[selectedUseCase];

  const resetVideoForm = () => {
    setVideoUrl("");
    setEditingVideo(null);
    setShowVideoModal(false);
  };

  const openAddVideoModal = () => {
    if (reachedFreeLimit) return;
    setVideoUrl("");
    setEditingVideo(null);
    setShowVideoModal(true);
  };

  const openEditVideoModal = (video) => {
    setEditingVideo(video);
    setVideoUrl(video.url || "");
    setShowVideoModal(true);
  };

  const handleSaveVideo = () => {
    const cleanUrl = videoUrl.trim();
    if (!cleanUrl) return;

    const videoId = getYouTubeId(cleanUrl);

    if (!videoId) {
      alert("Please enter a valid YouTube URL.");
      return;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    if (editingVideo) {
      setVideoList((prev) =>
        prev.map((video) =>
          video.id === editingVideo.id
            ? {
                ...video,
                url: cleanUrl,
                embedUrl,
              }
            : video
        )
      );

      resetVideoForm();
      return;
    }

    const newVideo = {
      id: crypto.randomUUID(),
      url: cleanUrl,
      embedUrl,
    };

    setVideoList((prev) => [...prev, newVideo]);
    resetVideoForm();
  };

  const handleDeleteVideo = (id) => {
    setVideoList((prev) => prev.filter((video) => video.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="flex min-h-screen flex-col">
        <header className="border-b border-slate-900 bg-slate-950/90 px-4 py-5 backdrop-blur md:px-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Event Wall
            </h1>

            <p className="mt-2 text-sm text-slate-300 md:text-base">
              Tired of juggling multiple YouTube tabs?
            </p>

            <p className="mt-1 text-xs text-slate-500 md:text-sm">
              Watch up to 4 videos in one clean view.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {Object.keys(useCases).map((item) => {
              const isActive = selectedUseCase === item;

              return (
                <button
                  key={item}
                  onClick={() => setSelectedUseCase(item)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    isActive
                      ? "border-white bg-white text-slate-950"
                      : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </header>

        <section className="px-4 py-3 md:px-6">
          <div className="grid gap-3 md:grid-cols-[1fr_728px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
              <p className="text-sm font-semibold text-white">
                {currentUseCase.title}
              </p>

              <p className="mt-1 text-xs leading-relaxed text-slate-400 md:text-sm">
                {currentUseCase.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {currentUseCase.examples.map((example) => (
                  <span
                    key={example}
                    className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[11px] text-slate-400"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex h-[90px] items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-sm text-slate-500">
              728x90 Advertisement
            </div>
          </div>
        </section>

        <section className="flex-1 px-4 pb-4 md:px-6">
          <div className="grid min-h-[700px] gap-2 md:grid-cols-2 md:grid-rows-2">
            {videoList.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onFocus={setFocusedVideo}
                onEdit={openEditVideoModal}
                onDelete={handleDeleteVideo}
              />
            ))}

            {Array.from({ length: emptyFreeSlots }).map((_, index) => (
              <EmptyVideoSlot key={`empty-${index}`} onClick={openAddVideoModal} />
            ))}
          </div>
        </section>

        <section className="px-4 pb-6 md:px-6">
          <div className="flex h-[90px] items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-sm text-slate-500">
            Bottom Advertisement
          </div>
        </section>

        <footer className="border-t border-slate-900 px-4 py-6 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <a
  href="/about"
  className="transition hover:text-slate-300"
>
  About
</a>

              <a href="/faq" className="transition hover:text-slate-300">
  FAQ
</a>

              <a href="/privacy" className="transition hover:text-slate-300">
  Privacy
</a>
            </div>

            <p className="text-xs text-slate-600">
              Event Wall is not affiliated with or endorsed by YouTube.
            </p>
          </div>
        </footer>
      </main>

      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-white">
                {editingVideo ? "Edit Video" : "Add Video"}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {editingVideo
                  ? "Update the YouTube link for this slot."
                  : "Paste a YouTube link into your wall."}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                YouTube Link
              </label>

              <input
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 text-white outline-none placeholder:text-slate-500 focus:border-slate-600"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                onClick={resetVideoForm}
                className="rounded-2xl text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSaveVideo}
                className="rounded-2xl bg-white text-slate-950 hover:bg-slate-200"
              >
                {editingVideo ? "Save Changes" : "Add Video"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {focusedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setFocusedVideo(null)}
        >
          <div
            className="flex h-full w-full max-w-7xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">Focus Mode</p>
                <p className="text-sm text-slate-400">Expanded view</p>
              </div>

              <Button
                onClick={() => setFocusedVideo(null)}
                variant="secondary"
                className="rounded-xl"
              >
                Close
              </Button>
            </div>

            <div className="flex-1">
              <VideoCard
                video={focusedVideo}
                focus
                onFocus={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          </div>
        </div>
      )}

      {activeInfoModal === "about" && (
        <InfoModal
          title="About Event Wall"
          onClose={() => setActiveInfoModal(null)}
        >
          <p>
            Event Wall is a lightweight multiview utility that lets you watch up
            to 4 YouTube videos in one clean view.
          </p>

          <p className="mt-4">
            It was built for people tired of juggling multiple tabs while
            watching sports, news, podcasts, livestreams, study videos, and
            finance coverage.
          </p>

          <p className="mt-4">
            Event Wall does not host videos. It simply displays publicly
            embeddable YouTube videos.
          </p>
        </InfoModal>
      )}

      {activeInfoModal === "faq" && (
        <InfoModal title="FAQ" onClose={() => setActiveInfoModal(null)}>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-white">What is Event Wall?</h3>
              <p className="mt-2 text-slate-400">
                Event Wall lets you watch up to 4 YouTube videos at once in one
                clean multiview layout.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Does it work with livestreams?
              </h3>
              <p className="mt-2 text-slate-400">
                Yes. If the stream supports embedding, it should work.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Are my videos saved?
              </h3>
              <p className="mt-2 text-slate-400">
                Yes. Your wall is saved locally on your device.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Why won’t some videos play?
              </h3>
              <p className="mt-2 text-slate-400">
                Some creators disable embedding on YouTube.
              </p>
            </div>
          </div>
        </InfoModal>
      )}

      {activeInfoModal === "privacy" && (
        <InfoModal
          title="Privacy Policy"
          onClose={() => setActiveInfoModal(null)}
        >
          <p>Event Wall is designed to be lightweight and simple.</p>

          <p className="mt-4">
            Video links are saved locally in your browser using local storage so
            your wall persists between visits.
          </p>

          <p className="mt-4">
            Event Wall does not require user accounts to use the core
            functionality.
          </p>

          <p className="mt-4">
            Videos are displayed using YouTube embeds, which may collect data
            according to YouTube’s own policies.
          </p>

          <p className="mt-4">
            Advertising partners may use cookies or related technologies
            according to their own privacy policies.
          </p>
        </InfoModal>
      )}
      <a
  href="/terms"
  className="transition hover:text-slate-300"
>
  Terms
</a>
    </div>
  );
}