"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "event-wall-videos";
const FREE_VIDEO_LIMIT = 4;

const initialVideos = [];

const tiers = [
  {
    name: "Bronze",
    videos: 6,
    extraSlots: 2,
    description: "Unlock 2 additional video slots with Bronze.",
    background: "bg-slate-900/40",
    slotBackground: "bg-slate-950/40",
  },
  {
    name: "Silver",
    videos: 8,
    extraSlots: 4,
    description: "Unlock 4 additional video slots with Silver.",
    background: "bg-slate-900/30",
    slotBackground: "bg-slate-950/30",
  },
  {
    name: "Gold",
    videos: 12,
    extraSlots: 8,
    description: "Unlock 8 additional video slots with Gold.",
    background: "bg-slate-900/20",
    slotBackground: "bg-slate-950/20",
  },
];

function getSavedVideos() {
  if (typeof window === "undefined") return initialVideos;

  try {
    const savedVideos = localStorage.getItem(STORAGE_KEY);
    return savedVideos ? JSON.parse(savedVideos) : initialVideos;
  } catch {
    return initialVideos;
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
      className="group aspect-video rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 transition hover:border-slate-500 hover:bg-slate-900"
    >
      <div className="flex h-full flex-col items-center justify-center text-slate-500 transition group-hover:text-slate-300">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-slate-700 bg-slate-950">
          <Plus className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium">Add Video</p>
      </div>
    </button>
  );
}

function LockedSlot({ background }) {
  return (
    <div
      className={`group aspect-video rounded-3xl border border-dashed border-slate-700 ${background}`}
    >
      <div className="flex h-full flex-col items-center justify-center text-slate-600 transition group-hover:text-slate-400">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-slate-700 bg-slate-950">
          <Plus className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium">Locked Slot</p>
      </div>
    </div>
  );
}

function VideoCard({ video, focus = false, onFocus, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      <Card className="overflow-hidden rounded-2xl border-slate-800 bg-slate-950 shadow-xl shadow-black/20">
        <div className="relative aspect-video bg-black">
          <iframe
            className="h-full w-full"
            src={video.embedUrl}
            title={video.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <div className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
            {video.name}
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            {!focus && (
              <Button
                onClick={() => onDelete(video.id)}
                size="icon"
                variant="secondary"
                className="h-9 w-9 rounded-full bg-red-500/90 text-white hover:bg-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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

        {!focus && (
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-semibold text-slate-100">{video.name}</p>
              <p className="text-sm text-slate-400">YouTube Video</p>
            </div>
            <div className="rounded-full border border-slate-800 px-3 py-1 text-xs text-slate-300">
              Loaded
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

function UpgradeTier({ tier }) {
  return (
    <details
      className={`group overflow-hidden rounded-3xl border border-slate-800 ${tier.background}`}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 text-sm text-slate-200 marker:hidden">
        <div>
          <p className="font-semibold text-white">
            {tier.name} — {tier.videos} Videos
          </p>
          <p className="mt-1 text-slate-400">{tier.description}</p>
        </div>
        <span className="text-slate-500 transition group-open:rotate-180">
          ⌄
        </span>
      </summary>

      <div className="grid gap-5 border-t border-slate-800 p-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: tier.extraSlots }).map((_, index) => (
          <LockedSlot
            key={`${tier.name}-${index}`}
            background={tier.slotBackground}
          />
        ))}
      </div>
    </details>
  );
}

export default function EventWall() {
  const [focusedVideo, setFocusedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoName, setVideoName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoList, setVideoList] = useState(getSavedVideos);

  const reachedFreeLimit = videoList.length >= FREE_VIDEO_LIMIT;
  const emptyFreeSlots = Math.max(FREE_VIDEO_LIMIT - videoList.length, 0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videoList));
  }, [videoList]);

  const resetVideoForm = () => {
    setVideoName("");
    setVideoUrl("");
    setShowVideoModal(false);
  };

  const openAddVideoModal = () => {
    if (reachedFreeLimit) return;

    setVideoName("");
    setVideoUrl("");
    setShowVideoModal(true);
  };

  const handleSaveVideo = () => {
    const cleanName = videoName.trim() || `Video ${videoList.length + 1}`;
    const cleanUrl = videoUrl.trim();

    if (!cleanUrl) return;

    const videoId = getYouTubeId(cleanUrl);

    if (!videoId) {
      alert("Please enter a valid YouTube URL.");
      return;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    const newVideo = {
      id: Date.now().toString(),
      name: cleanName,
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
      <main>
        <header className="border-b border-slate-900 bg-slate-950/90 px-5 py-5 backdrop-blur md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Event Wall
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Watch multiple YouTube videos at once.
              </p>
            </div>

            <Button
              disabled={reachedFreeLimit}
              onClick={openAddVideoModal}
              className="rounded-2xl bg-white px-5 text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Video
            </Button>
          </div>
        </header>

        <section className="px-5 py-4 md:px-8">
          <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            Paste any YouTube link. Your wall is saved locally on this device.
          </div>

          <section className="px-0 py-2">
            <div className="grid gap-5 md:grid-cols-2">
              {videoList.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onFocus={setFocusedVideo}
                  onDelete={handleDeleteVideo}
                />
              ))}

              {Array.from({ length: emptyFreeSlots }).map((_, index) => (
                <EmptyVideoSlot
                  key={`empty-${index}`}
                  onClick={openAddVideoModal}
                />
              ))}
            </div>

            <div className="mt-8 space-y-4">
              {tiers.map((tier) => (
                <UpgradeTier key={tier.name} tier={tier} />
              ))}
            </div>
          </section>
        </section>
      </main>

      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-white">Add Video</h2>
              <p className="mt-1 text-sm text-slate-400">
                Paste a YouTube link into your wall.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Video Name
                </label>
                <input
                  value={videoName}
                  onChange={(event) => setVideoName(event.target.value)}
                  placeholder="Optional"
                  className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 text-white outline-none placeholder:text-slate-500 focus:border-slate-600"
                />
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
                Add Video
              </Button>
            </div>
          </div>
        </div>
      )}

      {focusedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setFocusedVideo(null)}
        >
          <div
            className="w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {focusedVideo.name}
                </p>
                <p className="text-sm text-slate-400">Focus mode</p>
              </div>

              <Button
                onClick={() => setFocusedVideo(null)}
                variant="secondary"
                className="rounded-xl"
              >
                Close
              </Button>
            </div>

            <VideoCard
              video={focusedVideo}
              focus
              onFocus={() => {}}
              onDelete={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}