/**
 * Utility for handling file downloads and previews from Base64 Data URLs or web URLs
 */

export const triggerFileDownload = (fileUrl: string, defaultName = 'download'): void => {
  try {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = defaultName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Failed to trigger download', err);
  }
};

export const openFileInNewTab = (fileUrl: string): void => {
  try {
    if (fileUrl.startsWith('data:')) {
      // Convert base64 dataUrl to Blob for cleaner browser tab viewing
      const arr = fileUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } else {
      window.open(fileUrl, '_blank');
    }
  } catch (err) {
    console.error('Failed to open file in new tab', err);
    // Fallback to trigger download
    triggerFileDownload(fileUrl, 'notice-document');
  }
};
