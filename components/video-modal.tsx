"use client";

import { useState, useEffect } from "react";
import { RefreshCcw, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function VideoModalContent({ exerciseName }: { exerciseName: string }) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch(`/api/video-search?q=${encodeURIComponent(exerciseName)}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setVideoId(data.videoId);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchVideo();
  }, [exerciseName]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center absolute inset-0">
        <RefreshCcw className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-white font-medium">Finding best tutorial...</p>
      </div>
    );
  }

  if (error || !videoId) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center mt-8 sm:mt-0 relative z-10">
        <PlayCircle className="h-12 w-12 text-red-500 mb-4 opacity-80" />
        <h3 className="font-bold text-lg mb-2 text-white">Find {exerciseName} Tutorials</h3>
        <p className="text-sm text-gray-400 mb-6 max-w-sm">
          We couldn't automatically load the video. Click below to view the best demonstrations directly on YouTube.
        </p>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-bold px-8">
          <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exerciseName + " tutorial")}`} target="_blank" rel="noopener noreferrer">
            Search on YouTube
          </a>
        </Button>
      </div>
    );
  }

  return (
    <iframe
      className="absolute inset-0 w-full h-full pt-8 sm:pt-0"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
      title={`${exerciseName} Demonstration`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
}

export function VideoModal({ exerciseName, trigger }: { exerciseName: string, trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20 font-bold h-10 text-sm">
            <PlayCircle className="mr-2 h-4 w-4" />
            Watch Video Demonstration
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black border-none">
        <DialogHeader className="p-4 pb-0 bg-background absolute top-0 left-0 right-0 z-10 hidden">
          <DialogTitle>{exerciseName} Demonstration</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full bg-black relative flex items-center justify-center border-b border-primary/10">
          <VideoModalContent exerciseName={exerciseName} />
        </div>
        <div className="p-4 bg-background border-t border-primary/20 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm">{exerciseName}</h3>
            <p className="text-xs text-muted-foreground">Video Demonstration</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(exerciseName + " tutorial")}`} target="_blank" rel="noopener noreferrer">
              Open in YouTube
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
