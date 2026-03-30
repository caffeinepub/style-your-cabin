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
import Footer from "../components/Footer";
import Header from "../components/Header";

const STYLE_IDS = [
  "modern",
  "minimalist",
  "luxury",
  "scandinavian",
  "indianTraditional",
] as const;
type StyleId = (typeof STYLE_IDS)[number];

const STYLES: { id: StyleId; label: string; desc: string; img: string }[] = [
  {
    id: "modern",
    label: "Modern",
    desc: "Clean lines, neutral palette",
    img: "/assets/generated/style-modern.dim_400x300.jpg",
  },
  {
    id: "minimalist",
    label: "Minimalist",
    desc: "White space, zero clutter",
    img: "/assets/generated/style-minimalist.dim_400x300.jpg",
  },
  {
    id: "luxury",
    label: "Luxury",
    desc: "Rich textures, gold accents",
    img: "/assets/generated/style-luxury.dim_400x300.jpg",
  },
  {
    id: "scandinavian",
    label: "Scandinavian",
    desc: "Light wood, cozy textiles",
    img: "/assets/generated/style-scandinavian.dim_400x300.jpg",
  },
  {
    id: "indianTraditional",
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
  const [isGenerating, setIsGenerating] = useState(false);

  const [step, setStep] = useState(0);
  const [roomFile, setRoomFile] = useState<File | null>(null);
  const [roomPreview, setRoomPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<StyleId | null>(null);
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
    if (!roomFile || !selectedStyle || selectedDecor.size === 0) {
      toast.error("Please complete all steps first");
      return;
    }
    setIsGenerating(true);
    // Simulate a brief processing delay before navigating
    await new Promise((res) => setTimeout(res, 300));
    const mockJobId = `${selectedStyle}-${Date.now()}`;
    navigate({ to: `/result/${mockJobId}` });
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
                  className={`font-sans text-xs ${
                    i === step
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          <Progress value={((step + 1) / STEPS.length) * 100} className="h-1" />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Upload */}
          {step === 0 && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-serif text-2xl font-bold mb-2">
                Upload Your Room
              </h2>
              <p className="font-sans text-muted-foreground text-sm mb-6">
                Drag & drop a photo or click to browse.
              </p>

              {!roomPreview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  data-ocid="design.dropzone"
                  className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center h-64 cursor-pointer transition-colors ${
                    isDragOver
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-foreground/40"
                  }`}
                  onClick={() =>
                    document.getElementById("room-file-input")?.click()
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    document.getElementById("room-file-input")?.click()
                  }
                >
                  <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                  <p className="font-sans text-sm text-muted-foreground">
                    Drop your image here or{" "}
                    <span className="underline font-medium">browse</span>
                  </p>
                  <p className="font-sans text-xs text-muted-foreground/60 mt-1">
                    JPG, PNG, WEBP up to 20MB
                  </p>
                  <input
                    id="room-file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInput}
                    data-ocid="design.upload_button"
                  />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-border">
                  <img
                    src={roomPreview}
                    alt="Room preview"
                    className="w-full object-cover max-h-80"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setRoomFile(null);
                      setRoomPreview(null);
                    }}
                    data-ocid="design.delete_button"
                    className="absolute top-3 right-3 bg-foreground text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center hover:bg-foreground/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 1: Style */}
          {step === 1 && (
            <motion.div
              key="style"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-serif text-2xl font-bold mb-2">
                Choose Your Style
              </h2>
              <p className="font-sans text-muted-foreground text-sm mb-6">
                Pick the aesthetic you want for your redesigned room.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {STYLES.map((style, i) => (
                  <motion.button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    data-ocid={`design.item.${i + 1}`}
                    className={`relative rounded-xl overflow-hidden border-2 text-left transition-all ${
                      selectedStyle === style.id
                        ? "border-foreground"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    {selectedStyle === style.id && (
                      <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                    )}
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={style.img}
                        alt={style.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 bg-card">
                      <p className="font-sans font-semibold text-sm">
                        {style.label}
                      </p>
                      <p className="font-sans text-xs text-muted-foreground">
                        {style.desc}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Decor */}
          {step === 2 && (
            <motion.div
              key="decor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif text-2xl font-bold mb-2">
                  Pick Your Decor
                </h2>
                <p className="font-sans text-muted-foreground text-sm">
                  Select the items you'd like placed in your room.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
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
                        className={`font-sans text-xs font-medium ${
                          isSelected
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
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
              disabled={isGenerating || !canProceed.every(Boolean)}
              data-ocid="design.submit_button"
              className="bg-foreground text-primary-foreground hover:bg-foreground/90 font-sans px-8"
            >
              {isGenerating ? (
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
