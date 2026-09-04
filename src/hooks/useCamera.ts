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
  isUploadedVideo: boolean;
  startCamera: () => Promise<boolean>;
  stopCamera: () => void;
  toggleCamera: () => Promise<boolean>;
  loadVideoFile: (file: File) => Promise<boolean>;
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
  const [isUploadedVideo, setIsUploadedVideo] = useState<boolean>(false);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      if (videoRef.current.src) {
        URL.revokeObjectURL(videoRef.current.src);
        videoRef.current.removeAttribute('src');
      }
    }
    setIsStreaming(false);
    setIsUploadedVideo(false);
  }, [stream]);

  const loadVideoFile = useCallback(async (file: File): Promise<boolean> => {
    // Stop any active camera stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraError(null);

    try {
      const url = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
        videoRef.current.loop = true;
        videoRef.current.muted = true;
        await videoRef.current.play();
        setIsStreaming(true);
        setIsUploadedVideo(true);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Failed to play uploaded video file:', err);
      setCameraError('Unable to play video file. Please check video format (MP4/WebM).');
      setIsStreaming(false);
      setIsUploadedVideo(false);
      return false;
    }
  }, [stream]);

  const startCamera = useCallback(async (): Promise<boolean> => {
    // Stop any existing stream before starting a new one
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    setCameraError(null);
    setIsUploadedVideo(false);

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
    isUploadedVideo,
    startCamera,
    stopCamera,
    toggleCamera,
    loadVideoFile,
  };
}
