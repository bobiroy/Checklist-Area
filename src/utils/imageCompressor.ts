/**
 * Utility to compress images (camera captures & uploads) using HTML5 Canvas.
 * Resizes large camera images (often 3MB - 12MB) down to a max width/height
 * and compresses JPEG quality to ~70%, resulting in ~70KB - 150KB base64 strings.
 * This prevents localStorage QuotaExceededError and ensures smooth rendering.
 */
export const compressImageFile = (
  file: File,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If file is not an image, fallback to standard read
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => {
        // Fallback to original data URL if image decoding fails
        resolve(event.target?.result as string);
      };
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaling preserving aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Draw image resized
        ctx.drawImage(img, 0, 0, width, height);

        // Output compressed JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};
