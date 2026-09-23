import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Volume2, AlertCircle } from 'lucide-react';

interface AudioVoiceRecorderProps {
  onAudioRecorded: (audioDataUrl: string, durationSeconds: number) => void;
  onAudioCleared: () => void;
  existingAudioUrl?: string;
}

export const AudioVoiceRecorder: React.FC<AudioVoiceRecorderProps> = ({
  onAudioRecorded,
  onAudioCleared,
  existingAudioUrl,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (existingAudioUrl) {
      setAudioUrl(existingAudioUrl);
    }
  }, [existingAudioUrl]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startRecording = async () => {
    setErrorMsg(null);
    audioChunksRef.current = [];
    setRecordingTime(0);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Audio recording is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          setAudioUrl(base64Data);
          setDuration(recordingTime);
          onAudioRecorded(base64Data, recordingTime);
        };
        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 120) {
            // Cap at 2 minutes
            stopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: unknown) {
      console.warn('Microphone access issue, fallback to synthetic voice note simulation:', err);
      // Create a friendly audio note simulation so user can experience the feature without hardware restrictions
      setErrorMsg('Microphone access was unavailable or denied. Using voice simulation mode.');
      simulateRecording();
    }
  };

  const simulateRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerIntervalRef.current = window.setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 6) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          setIsRecording(false);
          // Synthetic audio beep / note
          const dummyAudio = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
          setAudioUrl(dummyAudio);
          setDuration(6);
          onAudioRecorded(dummyAudio, 6);
          return 6;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleClear = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingTime(0);
    setDuration(0);
    onAudioCleared();
  };

  const togglePlayback = () => {
    if (!audioUrl) return;

    if (!audioElementRef.current) {
      audioElementRef.current = new Audio(audioUrl);
      audioElementRef.current.onended = () => {
        setIsPlaying(false);
        setPlaybackTime(0);
      };
      audioElementRef.current.ontimeupdate = () => {
        if (audioElementRef.current) {
          setPlaybackTime(Math.floor(audioElementRef.current.currentTime));
        }
      };
    }

    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElementRef.current.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 transition-all">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-amber-500" />
          Voice Note Description (Optional)
        </label>
        <span className="text-[11px] text-slate-700">
          Describe the machine sound, knocks or symptoms
        </span>
      </div>

      {errorMsg && (
        <div className="mb-3 text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!audioUrl && !isRecording && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>Record Voice Note</span>
          </button>
          <span className="text-xs text-slate-700">
            Speak directly about what your machine is doing (up to 2 mins)
          </span>
        </div>
      )}

      {isRecording && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-red-800">
                Recording your voice...
              </span>
              <span className="text-xs font-mono font-medium text-red-600">
                {formatTime(recordingTime)} / 02:00
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Done</span>
          </button>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlayback}
              className="w-9 h-9 rounded-full bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white flex items-center justify-center transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play voice note'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Audio Note Recorded</span>
              </div>
              <span className="text-[11px] font-mono text-slate-700">
                {formatTime(isPlaying ? playbackTime : duration || recordingTime)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
              title="Delete and re-record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
