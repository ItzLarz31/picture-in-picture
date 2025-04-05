import { useRef, useState } from "react";
import "./VideoPlayer.css";

function VideoPlayer() {
  const [disabled, setDisabled] = useState(true);
  const videoRef = useRef(null);

  const displayMediaOptions = {
    video: {
      displaySurface: "browser",
    },
    audio: {
      suppressLocalAudioPlayback: false,
    },
    preferCurrentTab: false,
    selfBrowserSurface: "exclude",
    systemAudio: "include",
    surfaceSwitching: "include",
    monitorTypeSurfaces: "include",
  };

  async function startCapture(displayMediaOptions) {
    let captureStream = null;

    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      );
      videoRef.current.srcObject = captureStream;
      setDisabled(false);
    } catch (err) {
      console.error(`Error: ${err}`);
    }
    return captureStream;
  }

  async function handlePlayPicture() {
    await videoRef.current.requestPictureInPicture();
  }

  async function handleStopSharing() {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    }

    if (videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }

    videoRef.current.srcObject = null;
    setDisabled(true);
  }

  return (
    <section>
      <div className="video__buttons">
        <button
          onClick={() => {
            startCapture();
          }}
          className="video__button"
        >
          Source
        </button>
        <button
          onClick={() => {
            handlePlayPicture();
          }}
          className={`video__button ${
            disabled ? "disabled" : "video__button-start"
          }`}
          disabled={disabled}
        >
          Start
        </button>
        <button
          onClick={() => {
            handleStopSharing();
          }}
        >
          Stop Sharing
        </button>
      </div>
      <div className="video__container">
        <video
          ref={videoRef}
          className="video"
          controls
          height={360}
          width={640}
          autoPlay
          hidden
        ></video>
      </div>
    </section>
  );
}

export default VideoPlayer;
