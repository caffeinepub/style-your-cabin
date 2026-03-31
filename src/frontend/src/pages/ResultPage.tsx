import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Download,
  RefreshCw,
  Share2,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Header from "../components/Header";

const STYLE_PROMPTS: Record<string, string> = {
  modern:
    "modern style interior room, clean lines, neutral palette, beautiful furniture, realistic lighting, 4k quality",
  minimalist:
    "minimalist interior room, minimal clutter, white walls, simple elegant furniture, natural light, 4k quality",
  luxury:
    "luxury interior room, rich textures, gold accents, elegant decor, warm lighting, premium furniture, 4k quality",
  scandinavian:
    "scandinavian interior room, light wood furniture, cozy textiles, neutral colors, bright natural lighting, 4k quality",
  indianTraditional:
    "Indian traditional interior room, vibrant colors, ornate patterns, rich fabrics, warm lighting, 4k quality",
};

const UNSPLASH_FALLBACKS: Record<string, string> = {
  modern:
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1024&h=576&fit=crop",
  minimalist:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1024&h=576&fit=crop",
  luxury:
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1024&h=576&fit=crop",
  scandinavian:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1024&h=576&fit=crop",
  indianTraditional:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1024&h=576&fit=crop",
  default:
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1024&h=576&fit=crop",
};

const AI_MODELS = ["flux", "turbo", "flux-realism"];

function buildPollinationsUrl(
  style: string,
  model: string,
  seed: number,
): string {
  const prompt =
    STYLE_PROMPTS[style] ??
    `${style} style interior room with beautiful furniture and realistic lighting, 4k quality`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=576&nologo=true&model=${model}&seed=${seed}`;
}

function tryLoadImage(url: string, timeoutMs: number): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => {
      img.src = "";
      reject(new Error("timeout"));
    }, timeoutMs);
    img.onload = () => {
      clearTimeout(timer);
      resolve(url);
    };
    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error("load error"));
    };
    img.crossOrigin = "anonymous";
    img.src = url;
  });
}

async function generateImage(
  style: string,
): Promise<{ url: string; isFallback: boolean }> {
  const seed = Date.now();

  // Try all Pollinations models with increasing timeouts
  for (let i = 0; i < AI_MODELS.length; i++) {
    const model = AI_MODELS[i];
    const url = buildPollinationsUrl(style, model, seed + i * 9973);
    try {
      const result = await tryLoadImage(url, 40000);
      return { url: result, isFallback: false };
    } catch {
      // brief back-off
      if (i < AI_MODELS.length - 1) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }

  // Second round: retry flux with a fresh seed
  try {
    const retryUrl = buildPollinationsUrl(style, "flux", seed + 99991);
    const result = await tryLoadImage(retryUrl, 35000);
    return { url: result, isFallback: false };
  } catch {
    // ignore
  }

  // Fallback to Unsplash curated interior image (always works)
  const fallbackUrl = UNSPLASH_FALLBACKS[style] ?? UNSPLASH_FALLBACKS.default;
  try {
    const result = await tryLoadImage(fallbackUrl, 10000);
    return { url: result, isFallback: true };
  } catch {
    // Unsplash also failed — use URL directly anyway
    return { url: fallbackUrl, isFallback: true };
  }
}

export default function ResultPage() {
  const { jobId } = useParams({ from: "/result/$jobId" });
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [styleLabel, setStyleLabel] = useState("");
  const [isFallback, setIsFallback] = useState(false);
  const [attemptKey, setAttemptKey] = useState(0);
  const generationRef = useRef(false);

  useEffect(() => {
    if (generationRef.current) return;
    generationRef.current = true;
    startGeneration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startGeneration() {
    setStatus("loading");
    setIsFallback(false);

    const raw = localStorage.getItem("designData");
    if (!raw) {
      setStatus("error");
      return;
    }

    let data: {
      imageBase64: string;
      selectedStyle: string;
      selectedDecor: string[];
    };
    try {
      data = JSON.parse(raw);
    } catch {
      setStatus("error");
      return;
    }

    setOriginalImage(data.imageBase64);
    setStyleLabel(data.selectedStyle);

    generateImage(data.selectedStyle)
      .then(({ url, isFallback: fb }) => {
        setGeneratedImage(url);
        setIsFallback(fb);
        setStatus("done");
      })
      .catch(() => {
        setStatus("error");
      });
  }

  const handleRetry = () => {
    generationRef.current = false;
    setAttemptKey((n) => n + 1);
    startGeneration();
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `style-your-cabin-${jobId}.png`;
    link.click();
    toast.success("Design downloaded!");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleRegenerate = () => {
    navigate({ to: "/design" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/design" })}
            data-ocid="result.secondary_button"
            className="font-sans"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Design
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {/* Loading State */}
          {status === "loading" && (
            <motion.div
              key={`loading-${attemptKey}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              data-ocid="result.loading_state"
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-foreground/8 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-foreground animate-pulse" />
              </div>
              <h2 className="font-serif text-3xl font-bold mb-3">
                AI is Designing Your Space
              </h2>
              <p className="font-sans text-muted-foreground mb-8 max-w-md mx-auto">
                Generating a unique{" "}
                <span className="font-semibold capitalize">{styleLabel}</span>{" "}
                room design. Trying multiple AI models — please wait up to 60
                seconds.
              </p>
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
              </div>
              <p className="font-sans text-xs text-muted-foreground/60">
                Attempting flux → turbo → flux-realism models automatically
              </p>
            </motion.div>
          )}

          {/* Error State */}
          {status === "error" && (
            <motion.div
              key={`error-${attemptKey}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              data-ocid="result.error_state"
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              <h2 className="font-serif text-2xl font-bold mb-3">
                Unable to Load Design Data
              </h2>
              <p className="font-sans text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
                Please go back to the design page and try generating again.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleRetry}
                  className="bg-foreground text-primary-foreground font-sans"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRegenerate}
                  className="font-sans"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Design
                </Button>
              </div>
            </motion.div>
          )}

          {/* Result State */}
          {status === "done" && generatedImage && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              data-ocid="result.success_state"
            >
              {isFallback && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    The AI service is currently under heavy load. Showing a
                    curated interior design instead.{" "}
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="underline font-medium hover:opacity-80"
                    >
                      Try AI generation again
                    </button>
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="font-serif text-3xl font-bold mb-1">
                    Your Design is Ready!
                  </h2>
                  <p className="font-sans text-muted-foreground">
                    {isFallback ? "Curated" : "AI-generated"}{" "}
                    <span className="font-semibold capitalize">
                      {styleLabel}
                    </span>{" "}
                    room design.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    data-ocid="result.secondary_button"
                    className="font-sans"
                  >
                    <Share2 className="w-4 h-4 mr-1.5" /> Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    data-ocid="result.secondary_button"
                    className="font-sans"
                  >
                    <Download className="w-4 h-4 mr-1.5" /> Download
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRegenerate}
                    data-ocid="result.primary_button"
                    className="bg-foreground text-primary-foreground font-sans"
                  >
                    <RefreshCw className="w-4 h-4 mr-1.5" /> Redesign
                  </Button>
                </div>
              </div>

              {/* Side by side: original vs generated */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="rounded-2xl overflow-hidden border border-border">
                  <div className="px-4 py-2 bg-muted border-b border-border">
                    <p className="font-sans text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Original
                    </p>
                  </div>
                  <img
                    src={originalImage ?? ""}
                    alt="Original room"
                    className="w-full aspect-video object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-border">
                  <div className="px-4 py-2 bg-foreground border-b border-foreground">
                    <p className="font-sans text-xs font-medium text-primary-foreground uppercase tracking-wider">
                      {isFallback ? "Curated Design" : "AI Redesigned"}
                    </p>
                  </div>
                  <img
                    src={generatedImage}
                    alt="Redesigned room"
                    className="w-full aspect-video object-cover"
                  />
                </div>
              </div>

              {/* Design Details */}
              <div className="mt-6 bg-card border border-border rounded-xl p-6">
                <h3 className="font-sans font-semibold text-sm mb-4">
                  Design Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm font-sans">
                  <div>
                    <span className="text-muted-foreground">Style Applied</span>
                    <p className="font-medium mt-0.5 capitalize">
                      {styleLabel}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Source</span>
                    <p className="font-medium mt-0.5">
                      {isFallback ? "Curated (AI busy)" : "AI Generated"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
