import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useSaveUserProfile } from "../hooks/useQueries";

interface ProfileSetupProps {
  open: boolean;
}

export default function ProfileSetup({ open }: ProfileSetupProps) {
  const [name, setName] = useState("");
  const { mutate, isPending } = useSaveUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutate({ name: name.trim() });
  };

  return (
    <Dialog open={open}>
      <DialogContent data-ocid="profile.dialog" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Welcome to Style Your Cabin
          </DialogTitle>
          <DialogDescription>What should we call you?</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Your Name</Label>
            <Input
              id="profile-name"
              data-ocid="profile.input"
              placeholder="e.g. Alex Carter"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <Button
            type="submit"
            data-ocid="profile.submit_button"
            disabled={isPending || !name.trim()}
            className="w-full bg-foreground text-primary-foreground"
          >
            {isPending ? "Saving..." : "Get Started"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
