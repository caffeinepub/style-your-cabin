import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  RefreshCw,
  Share2,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import BeforeAfterSlider from "../components/BeforeAfterSlider";
import Footer from "../components/Footer";
import Header from "../components/Header";

const PROCESSING_STEPS = [
  "Detecting room layout",
  "Analyzing object spacing",
  "Placing decor items",
  "Applying style palette",
  "Adjusting lighting & shadows",
  "Finalizing design",
];

// Total loading duration in ms — always completes after this time
const LOADING_DURATION_MS = 5000;

export default function ResultPage() {
  const { jobId } = useParams({ from: "/result/$jobId" });
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);
  const [done, setDone] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / LOADING_DURATION_MS) * 100, 100);
      setProgress(pct);

      // Advance step based on progress
      const stepIndex = Math.min(
        Math.floor((pct / 100) * PROCESSING_STEPS.length),
        PROCESSING_STEPS.length - 1,
      );
      setProcessingStep(stepIndex);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Small delay after reaching 100 before showing results
        setTimeout(() => setDone(true), 400);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/assets/generated/room-after-luxury.dim_800x500.jpg";
    link.download = `style-your-cabin-${jobId}.jpg`;
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
          <Badge variant="outline" className="font-sans text-xs">
            Job #{jobId}
          </Badge>
        </div>

        <AnimatePresence mode="wait">
          {/* Loading State */}
          {!done && (
            <motion.div
              key="processing"
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
                Our AI is analyzing your room and applying your selected style
                with precision.
              </p>

              <div className="max-w-sm mx-auto mb-8">
                <Progress value={progress} className="h-2 mb-3" />
                <p className="font-sans text-sm text-muted-foreground">
                  {Math.round(progress)}% complete
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-3">
                {PROCESSING_STEPS.map((step, i) => (
                  <div
                    key={step}
                    className={`flex items-center gap-3 transition-opacity ${
                      i <= processingStep ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        i < processingStep
                          ? "bg-foreground"
                          : i === processingStep
                            ? "border-2 border-foreground"
                            : "border-2 border-border"
                      }`}
                    >
                      {i < processingStep && (
                        <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <span
                      className={`font-sans text-sm text-left ${
                        i === processingStep
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Result State */}
          {done && (
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
                    Drag the slider to compare before and after.
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
                    <RefreshCw className="w-4 h-4 mr-1.5" /> Regenerate
                  </Button>
                </div>
              </div>

              {/* Before/After Slider */}
              <div className="rounded-2xl overflow-hidden shadow-premium aspect-video mb-8">
                <BeforeAfterSlider
                  beforeSrc="/assets/generated/room-before.dim_800x500.jpg"
                  afterSrc="/assets/generated/room-after-luxury.dim_800x500.jpg"
                  beforeLabel="Original"
                  afterLabel="AI Redesigned"
                  className="w-full h-full"
                />
              </div>

              {/* Design Details */}
              <div className="mt-6 bg-card border border-border rounded-xl p-6">
                <h3 className="font-sans font-semibold text-sm mb-4">
                  Design Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm font-sans">
                  <div>
                    <span className="text-muted-foreground">Style Applied</span>
                    <p className="font-medium mt-0.5">Luxury</p>
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
