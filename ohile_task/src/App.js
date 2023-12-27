import React, { useState, useEffect } from "react";
import "./index.css";
import Logo from "./asset/logo.png";
import close from "./asset/close.png";

const AudioChatApp = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [showRecordingList, setShowRecordingList] = useState(false);
  const mediaRecorderRef = React.useRef(null);
  const audioRef = React.createRef();

  useEffect(() => {
    if (audioBlob) {
      setRecordings((prevRecordings) => [...prevRecordings, audioBlob]);
      setShowRecordingList(true);
    }
  }, [audioBlob]);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            setAudioBlob(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        mediaRecorderRef.current = mediaRecorder;
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = (blob) => {
    const audioUrl = URL.createObjectURL(blob);
    audioRef.current.src = audioUrl;
    audioRef.current.play();
  };

  const closeRecordingList = () => {
    setShowRecordingList(false);
  };

  return (
    <>
      <div className="header">
        <h1>Audio Chat Application</h1>
      </div>
      <div className="main-body">
        {showRecordingList && (
          <div className="recordings-list">
            <div
              onClick={closeRecordingList}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                margin: "0 20px",
                cursor: "pointer",
              }}
            >
              <img className="close-icon" src={close} alt="img" />
            </div>

            <ul>
              {recordings.map((recording, index) => (
                <li className="list" key={index}>
                  <img
                    src={Logo}
                    className="play-icon"
                    onClick={() => playAudio(recording)}
                  ></img>
                  <span>Recording {index + 1}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          className="start-rec"
          onClick={startRecording}
          disabled={isRecording}
        >
          <span className="inner-circle"></span>
        </button>
        Start
        <button
          className="stop-rec"
          onClick={stopRecording}
          disabled={!isRecording}
        >
          <span className="triangle"></span>
        </button>
        Stop
        <button
          className="play-rec"
          onClick={() => playAudio(audioBlob)}
          disabled={!audioBlob}
        >
          <span className="solid-rec"></span>
        </button>
        Play
        <audio className="sound-play" ref={audioRef} controls />
      </div>
    </>
  );
};

export default AudioChatApp;
