"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Maximize2, Wifi, WifiOff, Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const initialCameras = [];

function statusClasses(status) {
  if (status === "online") return "bg-emerald-500 text-emerald-50";
  if (status === "offline") return "bg-red-500 text-red-50";
  return "bg-amber-500 text-amber-50";
}

function statusIcon(status) {
  if (status === "offline") return <WifiOff className="h-3.5 w-3.5" />;
  return <Wifi className="h-3.5 w-3.5" />;
}

function CameraCard({ camera, focus, onFocus, onEdit, onDelete }) {
  const isOffline = camera.status === "offline";

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
      <Card className="overflow-hidden rounded-2xl border-slate-800 bg-slate-950 shadow-xl shadow-black/20">
        <div className="relative aspect-video bg-slate-900">
          {isOffline ? (
            <div className="flex h-full items-center justify-center bg-slate-900 text-slate-400">
              <div className="text-center">
                <WifiOff className="mx-auto mb-2 h-8 w-8" />
                <p className="text-sm font-medium">Camera Offline</p>
              </div>
            </div>
          ) : (
            <video className="h-full w-full object-cover opacity-90" src={camera.feed} autoPlay muted loop playsInline />
          )}

          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
            <Camera className="h-3.5 w-3.5" />
            {camera.name}
          </div>

          <div className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses(camera.status)}`}>
            {statusIcon(camera.status)}
            {camera.status}
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Button onClick={() => onEdit(camera)} size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-black/60 text-white hover:bg-black">
              <Pencil className="h-4 w-4" />
            </Button>

            <Button onClick={() => onDelete(camera.id)} size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-red-500/90 text-white hover:bg-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>

            <Button onClick={() => onFocus(camera)} size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-white/90 text-slate-950 hover:bg-white">
            <Maximize2 className="h-4 w-4" />
          </Button>
          </div>
        </div>

        {!focus && (
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-semibold text-slate-100">{camera.name}</p>
              <p className="text-sm text-slate-400">Live Feed</p>
            </div>
            <div className="rounded-full border border-slate-800 px-3 py-1 text-xs text-slate-300">Live</div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

export default function CameraWallPrototype() {
  const [focusedCamera, setFocusedCamera] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);
  const [cameraName, setCameraName] = useState("");
  const [cameraFeed, setCameraFeed] = useState("");
  const [cameraList, setCameraList] = useState(() => {
    if (typeof window === "undefined") return initialCameras;

    const savedCameras = localStorage.getItem("camera-wall-cameras");
    return savedCameras ? JSON.parse(savedCameras) : initialCameras;
  });

  useEffect(() => {
    localStorage.setItem("camera-wall-cameras", JSON.stringify(cameraList));
  }, [cameraList]);

  const FREE_CAMERA_LIMIT = 8;

  const layout = cameraList.length <= 3 ? "row" : "grid";

  const reachedFreeLimit = cameraList.length >= FREE_CAMERA_LIMIT;

  const handleAddCamera = () => {
    if (!cameraName || !cameraFeed) return;

    if (editingCamera) {
      setCameraList((prev) =>
        prev.map((cam) =>
          cam.id === editingCamera.id
            ? { ...cam, name: cameraName, feed: cameraFeed }
            : cam
        )
      );
    } else {
      const newCamera = {
        id: Date.now().toString(),
        name: cameraName,
        status: "online",
        feed: cameraFeed,
      };

      setCameraList((prev) => [...prev, newCamera]);
    }

    setCameraName("");
    setCameraFeed("");
    setEditingCamera(null);
    setShowAddModal(false);
  };

  const handleEditCamera = (camera) => {
    setEditingCamera(camera);
    setCameraName(camera.name);
    setCameraFeed(camera.feed);
    setShowAddModal(true);
  };

  const handleDeleteCamera = (id) => {
    setCameraList((prev) => prev.filter((cam) => cam.id !== id));
  };

  

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      

      <main>
        <header className="border-b border-slate-900 bg-slate-950/90 px-5 py-5 backdrop-blur md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Camera Wall</h1>
              <p className="mt-2 text-sm text-slate-400">All your cameras in one clean place.</p>
            </div>

            <Button disabled={reachedFreeLimit} onClick={() => setShowAddModal(true)} className="rounded-2xl bg-white px-5 text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50">
              <Plus className="mr-2 h-4 w-4" />
              Add Camera
            </Button>
          </div>
        </header>

        

        

        <section className="px-5 py-4 md:px-8">
          <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
            Your cameras are automatically saved locally on this device.
          </div>

          <section className="px-0 py-2">
            {cameraList.length === 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setShowAddModal(true)}
                    className="group aspect-video rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 transition hover:border-slate-500 hover:bg-slate-900"
                  >
                    <div className="flex h-full flex-col items-center justify-center text-slate-500 transition group-hover:text-slate-300">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-slate-700 bg-slate-950">
                        <Plus className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium">Add Camera</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className={layout === "grid" ? "grid gap-5 md:grid-cols-2 xl:grid-cols-4" : "flex gap-5 overflow-x-auto pb-2"}>
                {cameraList.map((camera) => (
                  <div key={camera.id} className={layout === "row" ? "min-w-[340px] md:min-w-[460px]" : ""}>
                    <CameraCard
                      camera={camera}
                      onFocus={setFocusedCamera}
                      onEdit={handleEditCamera}
                      onDelete={handleDeleteCamera}
                    />
                  </div>
                ))}
              </div>

                {reachedFreeLimit && (
                  <div className="mt-8 space-y-4">
                    <details className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40">
                      <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 text-sm text-slate-200 marker:hidden">
                        <div>
                          <p className="font-semibold text-white">Bronze — 12 Cameras</p>
                          <p className="mt-1 text-slate-400">Unlock 4 additional camera slots with Bronze.</p>
                        </div>
                        <span className="text-slate-500 transition group-open:rotate-180">⌄</span>
                      </summary>

                      <div className="grid gap-5 border-t border-slate-800 p-5 md:grid-cols-2">
                        {[1, 2, 3, 4].map((slot) => (
                          <div
                            key={slot}
                            className="group aspect-video rounded-3xl border border-dashed border-slate-700 bg-slate-950/40"
                          >
                            <div className="flex h-full flex-col items-center justify-center text-slate-600 transition group-hover:text-slate-400">
                              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-slate-700 bg-slate-950">
                                <Plus className="h-6 w-6" />
                              </div>
                              <p className="text-sm font-medium">Locked Slot</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>

                    <details className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/30">
                      <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 text-sm text-slate-200 marker:hidden">
                        <div>
                          <p className="font-semibold text-white">Silver — 16 Cameras</p>
                          <p className="mt-1 text-slate-400">Unlock 8 additional camera slots with Silver.</p>
                        </div>
                        <span className="text-slate-500 transition group-open:rotate-180">⌄</span>
                      </summary>
                    </details>

                    <details className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/20">
                      <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 text-sm text-slate-200 marker:hidden">
                        <div>
                          <p className="font-semibold text-white">Gold — 24 Cameras</p>
                          <p className="mt-1 text-slate-400">Unlock 16 additional camera slots with Gold.</p>
                        </div>
                        <span className="text-slate-500 transition group-open:rotate-180">⌄</span>
                      </summary>
                    </details>
                  </div>
                )}
              </>
            )}
          </section>
        </section>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-white">
                {editingCamera ? "Edit Camera" : "Add Camera"}
              </h2>
              <p className="mt-1 text-sm text-slate-400">Add a camera feed to your wall.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Camera Name</label>
                <input
                  value={cameraName}
                  onChange={(e) => setCameraName(e.target.value)}
                  placeholder="Front Door"
                  className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 text-white outline-none placeholder:text-slate-500 focus:border-slate-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Feed URL</label>
                <input
                  value={cameraFeed}
                  onChange={(e) => setCameraFeed(e.target.value)}
                  placeholder="https://example-feed.mp4"
                  className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 text-white outline-none placeholder:text-slate-500 focus:border-slate-600"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowAddModal(false)} className="rounded-2xl text-slate-300 hover:bg-slate-900 hover:text-white">
                Cancel
              </Button>
              <Button onClick={handleAddCamera} className="rounded-2xl bg-white text-slate-950 hover:bg-slate-200">
                {editingCamera ? "Save Changes" : "Add Camera"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {focusedCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" onClick={() => setFocusedCamera(null)}>
          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{focusedCamera.name}</p>
                <p className="text-sm text-slate-400">Focus mode</p>
              </div>
              <Button onClick={() => setFocusedCamera(null)} variant="secondary" className="rounded-xl">Close</Button>
            </div>
            <CameraCard
              camera={focusedCamera}
              focus
              onFocus={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
