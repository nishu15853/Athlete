import { useEffect, useRef, useState, useCallback } from 'react';

interface UseCameraOptions {
  width?: number;
  height?: number;
  facingMode?: 'user' | 'environment';
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  isStreaming: boolean;
  cameraError: string | null;
  startCamera: () => Promise<boolean>;
  stopCamera: () => void;
  toggleCamera: () => Promise<boolean>;
}

export function useCamera({
  width = 640,
  height = 480,
  facingMode = 'user',
}: UseCameraOptions = {}): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, [stream]);

  const startCamera = useCallback(async (): Promise<boolean> => {
    // Stop any existing stream before starting a new one
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported in this browser environment.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode,
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setStream(mediaStream);
      setIsStreaming(true);
      return true;
    } catch (err: any) {
      console.warn('Camera stream request failed:', err);
      const message =
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access or use Demo Mode.'
          : err.name === 'NotFoundError'
          ? 'No camera found on this device.'
          : 'Unable to access camera. You can test with Simulated Demo Mode.';
      setCameraError(message);
      setIsStreaming(false);
      return false;
    }
  }, [width, height, facingMode, stream]);

  const toggleCamera = useCallback(async (): Promise<boolean> => {
    if (isStreaming) {
      stopCamera();
      return false;
    } else {
      return await startCamera();
    }
  }, [isStreaming, startCamera, stopCamera]);

  // Clean up media tracks when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return {
    videoRef,
    stream,
    isStreaming,
    cameraError,
    startCamera,
    stopCamera,
    toggleCamera,
  };
}
