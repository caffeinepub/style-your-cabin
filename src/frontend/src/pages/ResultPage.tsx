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
    "A modern style interior room with beautiful furniture, clean lines, neutral palette, realistic lighting, 4k quality",
  minimalist:
    "A minimalist style interior room with minimal clutter, white walls, simple elegant furniture, natural light, 4k quality",
  luxury:
    "A luxury style interior room with rich textures, gold accents, elegant decor, warm lighting, premium furniture, 4k quality",
  scandinavian:
    "A scandinavian style interior room with light wood furniture, cozy textiles, neutral colors, bright natural lighting, 4k quality",
  indianTraditional:
    "An Indian traditional style interior room with vibrant colors, ornate patterns, rich fabrics, warm lighting, 4k quality",
};

function buildUrl(style: string, seed: number): string {
  const prompt =
    STYLE_PROMPTS[style] ??
    `A ${style} style interior room with beautiful furniture and realistic lighting`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=576&nologo=true&model=flux&seed=${seed}`;
}

async function loadImageWithRetry(
  style: string,
  maxRetries = 4,
  timeoutMs = 45000,
): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const url = buildUrl(style, Date.now() + attempt * 7919);
    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        const timer = setTimeout(() => {
          img.src = "";
          reject(new Error("timeout"));
        }, timeoutMs);
        img.onload = () => {
          clearTimeout(timer);
          resolve();
        };
        img.onerror = () => {
          clearTimeout(timer);
          reject(new Error("load error"));
        };
        img.src = url;
      });
      return url;
    } catch {
      if (attempt < maxRetries - 1) {
        // brief back-off before next attempt
        await new Promise((r) => setTimeout(r, 2000 + attempt * 1000));
      }
    }
  }
  throw new Error(
    "The AI service is currently busy. Please wait a moment and try again.",
  );
}

export default function ResultPage() {
  const { jobId } = useParams({ from: "/result/$jobId" });
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [styleLabel, setStyleLabel] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;
    startGeneration();
  }, []);

  function startGeneration() {
    setStatus("loading");
    setErrorMsg("");

    const raw = localStorage.getItem("designData");
    if (!raw) {
      setErrorMsg("No design data found. Please start from the design page.");
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
      setErrorMsg("Invalid design data. Please try again.");
      setStatus("error");
      return;
    }

    setOriginalImage(data.imageBase64);
    setStyleLabel(data.selectedStyle);

    loadImageWithRetry(data.selectedStyle)
      .then((url) => {
        setGeneratedImage(url);
        setStatus("done");
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMsg(msg);
        setStatus("error");
      });
  }

  const handleRetry = () => {
    hasFired.current = false;
    setAttemptCount((n) => n + 1);
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
              key="loading"
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
                room design. This may take up to 45 seconds — please wait.
              </p>
              <div className="flex justify-center">
                <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {status === "error" && (
            <motion.div
              key={`error-${attemptCount}`}
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
                Generation Failed
              </h2>
              <p className="font-sans text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
                {errorMsg}
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="font-serif text-3xl font-bold mb-1">
                    Your Design is Ready!
                  </h2>
                  <p className="font-sans text-muted-foreground">
                    AI-generated{" "}
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
                      AI Redesigned
                    </p>
                  </div>
                  <img
                    src={generatedImage}
                    alt="AI redesigned room"
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
                    <span className="text-muted-foreground">Status</span>
                    <p className="font-medium mt-0.5">Completed</p>
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
