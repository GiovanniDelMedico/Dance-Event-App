// src/ui/Avatar.tsx
import { useState } from "react";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: number; // default 40px
}

export default function Avatar({ src, alt = "", size = 40 }: AvatarProps) {
  const [error, setError] = useState(false);

  const showFallback = !src || error;

  return (
    <div
      className="rounded-full overflow-hidden bg-zinc-100 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {showFallback ? (
        <User
          size={size * 0.6}
          strokeWidth={2}
          className="text-purple-600"
        />
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
