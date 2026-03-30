import { Facebook, Home, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                <Home className="w-4 h-4" />
              </div>
              <span className="font-sans font-semibold text-xs tracking-[0.2em] uppercase">
                STYLE YOUR CABIN
              </span>
            </div>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">
              Transform any room with AI-powered interior design. Your dream
              space, realized in seconds.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase mb-4 text-primary-foreground/80">
              Links
            </h4>
            <ul className="space-y-2">
              {["Home", "Design Studio", "My Projects", "Pricing"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="/"
                      className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase mb-4 text-primary-foreground/80">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li>hello@styleyourcabin.ai</li>
              <li>+1 (555) 234-5678</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase mb-4 text-primary-foreground/80">
              Social
            </h4>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Facebook, label: "Facebook" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="/"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-primary-foreground/40">
            © {year} Style Your Cabin. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/40">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary-foreground/60 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
