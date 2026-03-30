import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Coffee,
  Image,
  Lamp,
  Layers,
  Leaf,
  Sofa,
  Table2,
  Upload,
  Wind,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { Style } from "../backend";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateJob } from "../hooks/useQueries";

const STYLES = [
  {
    id: Style.modern,
    label: "Modern",
    desc: "Clean lines, neutral palette",
    img: "/assets/generated/style-modern.dim_400x300.jpg",
  },
  {
    id: Style.minimalist,
    label: "Minimalist",
    desc: "White space, zero clutter",
    img: "/assets/generated/style-minimalist.dim_400x300.jpg",
  },
  {
    id: Style.luxury,
    label: "Luxury",
    desc: "Rich textures, gold accents",
    img: "/assets/generated/style-luxury.dim_400x300.jpg",
  },
  {
    id: Style.scandinavian,
    label: "Scandinavian",
    desc: "Light wood, cozy textiles",
    img: "/assets/generated/style-scandinavian.dim_400x300.jpg",
  },
  {
    id: Style.indianTraditional,
    label: "Indian Traditional",
    desc: "Vibrant colors, ornate patterns",
    img: "/assets/generated/style-indian.dim_400x300.jpg",
  },
];

const DECOR_ITEMS = [
  { id: "sofa", label: "Sofa", icon: Sofa },
  { id: "lamp", label: "Lamp", icon: Lamp },
  { id: "dining-table", label: "Table", icon: Table2 },
  { id: "plant", label: "Plant", icon: Leaf },
  { id: "bookshelf", label: "Bookshelf", icon: BookOpen },
  { id: "rug", label: "Rug", icon: Layers },
  { id: "curtains", label: "Curtains", icon: Wind },
  { id: "artwork", label: "Artwork", icon: Image },
  { id: "mirror", label: "Mirror", icon: Circle },
  { id: "coffee-table", label: "Coffee Table", icon: Coffee },
];

const STEPS = ["Upload Room", "Choose Style", "Pick Decor"];

export default function DesignPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { mutate: createJob, isPending } = useCreateJob();

  const [step, setStep] = useState(0);
  const [roomFile, setRoomFile] = useState<File | null>(null);
  const [roomPreview, setRoomPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [selectedDecor, setSelectedDecor] = useState<Set<string>>(new Set());

  const handleFileDrop = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setRoomFile(file);
    const url = URL.createObjectURL(file);
    setRoomPreview(url);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileDrop(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileDrop(file);
  };

  const toggleDecor = (id: string) => {
    setSelectedDecor((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canProceed = [!!roomFile, !!selectedStyle, selectedDecor.size > 0];

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to generate a design");
      await login();
      return;
    }
    if (!roomFile || !selectedStyle || selectedDecor.size === 0) {
      toast.error("Please complete all steps first");
      return;
    }

    const bytes = new Uint8Array(await roomFile.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes);

    createJob(
      {
        roomImageBlob: blob,
        style: selectedStyle,
        decorItems: Array.from(selectedDecor),
      },
      {
        onSuccess: (result) => {
          navigate({ to: `/result/${result.jobId.toString()}` });
        },
        onError: (err) => {
          toast.error(`Failed to create design job: ${(err as Error).message}`);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1 flex flex-col items-center">
                <div
                  data-ocid={"design.tab"}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-sans font-medium mb-2 transition-colors ${
                    i < step
                      ? "bg-foreground text-primary-foreground"
                      : i === step
                        ? "bg-foreground text-primary-foreground ring-4 ring-foreground/20"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={`font-sans text-xs ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          <Progress
            value={((step + 1) / STEPS.length) * 100}
            className="h-1"
            data-ocid="design.loading_state"
          />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Upload */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-serif text-3xl font-bold mb-2">
                Upload Your Room
              </h2>
              <p className="font-sans text-muted-foreground mb-8">
                Drag & drop or click to upload a photo of the room you'd like to
                redesign.
              </p>

              {roomPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-border aspect-video">
                  <img
                    src={roomPreview}
                    alt="Room preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setRoomFile(null);
                      setRoomPreview(null);
                    }}
                    data-ocid="design.close_button"
                    className="absolute top-3 right-3 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full font-sans">
                    {roomFile?.name}
                  </div>
                </div>
              ) : (
                <label
                  data-ocid="design.dropzone"
                  className={`block border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                    isDragOver
                      ? "border-foreground bg-accent"
                      : "border-border hover:border-foreground/40 hover:bg-accent/50"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileInput}
                    data-ocid="design.upload_button"
                  />
                  <div
                    className={`w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 ${isDragOver ? "pulse-ring" : ""}`}
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="font-sans font-medium text-foreground mb-1">
                    Drop your room photo here
                  </p>
                  <p className="font-sans text-sm text-muted-foreground">
                    or click to browse — JPG, PNG, WEBP up to 10MB
                  </p>
                </label>
              )}
            </motion.div>
          )}

          {/* Step 1: Style */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-serif text-3xl font-bold mb-2">
                Choose Your Style
              </h2>
              <p className="font-sans text-muted-foreground mb-8">
                Pick the design aesthetic you'd like AI to apply to your room.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {STYLES.map((style) => (
                  <motion.button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    whileHover={{ y: -2 }}
                    data-ocid="design.tab"
                    className={`text-left rounded-xl overflow-hidden border-2 transition-all ${
                      selectedStyle === style.id
                        ? "border-foreground shadow-premium"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={style.img}
                        alt={style.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 bg-card flex items-center justify-between">
                      <div>
                        <p className="font-sans font-semibold text-sm">
                          {style.label}
                        </p>
                        <p className="font-sans text-xs text-muted-foreground">
                          {style.desc}
                        </p>
                      </div>
                      {selectedStyle === style.id && (
                        <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Decor */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-serif text-3xl font-bold mb-2">
                Pick Decor Items
              </h2>
              <p className="font-sans text-muted-foreground mb-8">
                Select items you'd like AI to place in your redesigned room.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
                {DECOR_ITEMS.map((item, i) => {
                  const isSelected = selectedDecor.has(item.id);
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => toggleDecor(item.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      data-ocid={`design.item.${i + 1}`}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-foreground bg-foreground/5"
                          : "border-border hover:border-foreground/30 bg-card"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-foreground flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                      <item.icon
                        className={`w-6 h-6 ${isSelected ? "text-foreground" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`font-sans text-xs font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              {selectedDecor.size > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Array.from(selectedDecor).map((id) => (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="font-sans text-xs"
                    >
                      {DECOR_ITEMS.find((d) => d.id === id)?.label}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            data-ocid="design.secondary_button"
            className="font-sans"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed[step]}
              data-ocid="design.primary_button"
              className="bg-foreground text-primary-foreground hover:bg-foreground/90 font-sans"
            >
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={isPending || !canProceed.every(Boolean)}
              data-ocid="design.submit_button"
              className="bg-foreground text-primary-foreground hover:bg-foreground/90 font-sans px-8"
            >
              {isPending ? (
                <>
                  <span className="loading-dots flex gap-1 mr-2">
                    <span className="loading-dot w-1.5 h-1.5 bg-primary-foreground rounded-full inline-block" />
                    <span className="loading-dot w-1.5 h-1.5 bg-primary-foreground rounded-full inline-block" />
                    <span className="loading-dot w-1.5 h-1.5 bg-primary-foreground rounded-full inline-block" />
                  </span>
                  Generating...
                </>
              ) : (
                <>
                  Generate Design <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
