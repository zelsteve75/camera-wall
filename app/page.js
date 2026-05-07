"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Pencil, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "event-wall-videos";
const FREE_VIDEO_LIMIT = 4;

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

export default function EventWall() {
  const [focusedVideo, setFocusedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoList, setVideoList] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

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

  const emptyFreeSlots = Math.max(
    FREE_VIDEO_LIMIT - videoList.length,
    0
  );

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
    setVideoList((prev) =>
      prev.filter((video) => video.id !== id)
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-slate-100">
      <main className="flex h-full flex-col">
        <header className="shrink-0 border-b border-slate-900 bg-slate-950/90 px-4 py-4 backdrop-blur md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

            <Button
              disabled={reachedFreeLimit}
              onClick={openAddVideoModal}
              className="rounded-xl bg-white px-4 text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Video
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Sports",
              "News",
              "Podcasts",
              "Study",
              "Finance",
              "Livestreams",
            ].map((item) => (
              <div
                key={item}
                className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-400"
              >
                {item}
              </div>
            ))}
          </div>
        </header>

        <section className="shrink-0 px-4 py-3 md:px-6">
          <div className="flex h-[90px] items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-sm text-slate-500">
            Advertisement
          </div>
        </section>

        <section className="min-h-0 flex-1 px-4 pb-4 md:px-6">
          <div className="grid h-full gap-2 md:grid-cols-2 md:grid-rows-2">
            {videoList.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onFocus={setFocusedVideo}
                onEdit={openEditVideoModal}
                onDelete={handleDeleteVideo}
              />
            ))}

            {Array.from({
              length: emptyFreeSlots,
            }).map((_, index) => (
              <EmptyVideoSlot
                key={`empty-${index}`}
                onClick={openAddVideoModal}
              />
            ))}
          </div>
        </section>
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
                onChange={(event) =>
                  setVideoUrl(event.target.value)
                }
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
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mb-3 flex shrink-0 items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  Focus Mode
                </p>

                <p className="text-sm text-slate-400">
                  Expanded view
                </p>
              </div>

              <Button
                onClick={() =>
                  setFocusedVideo(null)
                }
                variant="secondary"
                className="rounded-xl"
              >
                Close
              </Button>
            </div>

            <div className="min-h-0 flex-1">
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
    </div>
  );
}