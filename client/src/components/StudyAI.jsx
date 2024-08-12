import {
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useState, useRef } from "react";
import TalkingAnimation, { ListeningAnimation } from "./TalkingAnimation";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";

const StudyAI = () => {
  const [recording, setRecording] = useState(false);
  const [audioRecording, setAudioRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioMediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const recordedAudioChunks = useRef([]);
  const [voice, setVoice] = useState(null);
  const { supported, speak, speaking, cancel, voices } = useSpeechSynthesis();

  const handleStartRecording = async () => {
    setVideoUrl("");
    recordedChunks.current = [];

    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    videoRef.current.srcObject = stream;

    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp9",
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(recordedChunks.current, {
        type: "video/webm",
      });
      setVideoUrl(URL.createObjectURL(blob));
      const formData = new FormData();
      formData.append("video", blob, "video.webm");

      try {
        const response = await fetch("http://localhost:3000/study-ai", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        console.log("Server response:", result.text);
        if (result.text) {
          speak({ voice, text: result.text });
        }
      } catch (error) {
        alert("Error uploading video, is the server running?:", error);
      }

      recordedChunks.current = [];
    };

    mediaRecorderRef.current.start();
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setRecording(false);
  };

  const handleStartAudioRecording = async () => {
    // Reset audioUrl before starting a new recording
    setAudioUrl("");
    recordedAudioChunks.current = [];

    setAudioRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioRef.current.srcObject = stream;

    audioMediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "audio/webm",
    });

    audioMediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedAudioChunks.current.push(event.data);
      }
    };

    audioMediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(recordedAudioChunks.current, {
        type: "audio/webm",
      });
      setAudioUrl(URL.createObjectURL(blob));
      const formData = new FormData();
      formData.append("audio", blob, "audio.webm");

      try {
        const response = await fetch("http://localhost:3000/study-ai/audio", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        console.log("Server response:", result);
        if (result.text) {
          speak({ voice, text: result.text });
        }
      } catch (error) {
        console.log(error);
        alert("Error uploading audio, is the server running?:", error);
      }

      recordedAudioChunks.current = [];
    };

    audioMediaRecorderRef.current.start();
  };

  const handleStopAudioRecording = () => {
    setAudioRecording(false);
    audioMediaRecorderRef.current.stop();
    const stream = audioRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setAudioRecording(false);
  };

  const handleChange = (event) => {
    setVoice(event.target.value);
  };

  return (
    <div className="study-ai-container">
      <div className="study-ai-bar">
        <p className="study-ai-topic">
          Chat with Gemini{" "}
          <img src="/images/gemini-logo.png" alt="gemini logo" />
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          {!recording ? (
            <Button
              size="small"
              variant="outlined"
              onClick={handleStartRecording}
              className="ai-video-controls-btn"
            >
              <i className="fa-regular fa-circle-play"></i>&nbsp;Start Video
            </Button>
          ) : (
            <Button
              className="ai-video-controls-btn"
              size="small"
              variant="outlined"
              onClick={handleStopRecording}
            >
              <i className="fa-regular fa-circle-stop"></i>&nbsp;Stop Video
            </Button>
          )}

          {!audioRecording ? (
            <Button
              size="small"
              variant="outlined"
              onClick={handleStartAudioRecording}
              className="ai-video-controls-btn"
            >
              <i className="fa-solid fa-microphone-lines"></i>&nbsp;Start Audio
            </Button>
          ) : (
            <Button
              className="ai-video-controls-btn"
              size="small"
              variant="outlined"
              onClick={handleStopAudioRecording}
            >
              <i className="fa-solid fa-microphone-lines-slash"></i>&nbsp;Stop
              Audio
            </Button>
          )}
        </div>
      </div>
      <div className="study-ai-wrapper">
        <Grid container>
          <Grid item md={4}>
            <div className="ai-avatar-box">
              {speaking ? <TalkingAnimation /> : <ListeningAnimation />}
            </div>
            <div className="voices">
              <FormControl
                variant="filled"
                sx={{ m: 1, minWidth: 150, fontFamily: "Poppins, sans-serif" }}
              >
                <InputLabel
                  id="voice-label"
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Select voice
                </InputLabel>
                <Select
                  labelId="voice-label"
                  id="voice"
                  value={voice}
                  onChange={handleChange}
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {voices &&
                    voices.map((v, idx) => (
                      <MenuItem
                        value={v}
                        key={idx}
                        sx={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {`${v.name} - ${v.lang}`}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          </Grid>
          <Grid item md={8}>
            <VideoRecorder
              recording={recording}
              audioRecording={audioRecording}
              videoUrl={videoUrl}
              videoRef={videoRef}
            />

            <audio
              ref={audioRef}
              controls
              src={audioUrl}
              style={{ marginTop: "10px", visibility: "hidden" }}
            >
              Your browser does not support the audio element.
            </audio>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

const VideoRecorder = ({ recording, videoRef, videoUrl, audioRecording }) => {
  return (
    <div className="video-recorder">
      {recording ? (
        <video ref={videoRef} autoPlay muted />
      ) : videoUrl ? (
        <video src={videoUrl} controls />
      ) : (
        <div className="not-recording">
          {audioRecording ? (
            <div class="recording-container">
              <div class="recording-circle"></div>
              <div class="recording-text">Recording</div>
            </div>
          ) : (
            <i className="fa-solid fa-video-slash"></i>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyAI;
