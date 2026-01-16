import "./App.css";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";
import { useState } from "react";

function App() {
  const client = ZoomMtgEmbedded.createClient();
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);

  const authEndpoint = import.meta.env.VITE_AUTH_ENDPOINT || "https://zoom-meeting-sdk-auth-sample-rn55.onrender.com";
  const sdkKey = import.meta.env.VITE_SDK_KEY || "E52XdEmTmOcssZXj9lIpg";
  const meetingNumber = import.meta.env.VITE_MEETING_NUMBER || "9083285683";
  const passWord = import.meta.env.VITE_PASSWORD || "280443";
  const role = 1;
  const userName = import.meta.env.VITE_USER_NAME || "Zoom Web React";
  const userEmail = "";
  const registrantToken = "";
  const zakToken = "";
  const leaveUrl = import.meta.env.VITE_LEAVE_URL || "https://bstef.github.io/thanks.html";

  const getSignature = async () => {
    try {
      const req = await fetch(authEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingNumber: meetingNumber,
          role: role,
          videoWebRtcMode: 1,
        }),
      });
      const res = await req.json();
      const signature = res.signature as string;
      startMeeting(signature);
    } catch (e) {
      console.log(e);
    }
  };

  async function startMeeting(signature: string) {
    const meetingSDKElement = document.getElementById("meetingSDKElement")!;
    setIsMeetingStarted(true);
    
    try {
      await client.init({
        zoomAppRoot: meetingSDKElement,
        language: "en-US",
        patchJsMedia: true,
        leaveOnPageUnload: true,
      });
      await client.join({
        signature: signature,
        meetingNumber: meetingNumber,
        password: passWord,
        userName: userName,
        userEmail: userEmail,
        tk: registrantToken,
        zak: zakToken,
      });
      console.log("joined successfully");
    } catch (error) {
      console.log(error);
      setIsMeetingStarted(false);
    }
  }

  return (
    <div className="App">
      {!isMeetingStarted && (
        <div className="landing-page">
          <div className="header-box">
            <div className="zoom-icon">📹</div>
            <h1>Zoom Meeting on AWS</h1>
          </div>

          <div className="hero-section">
            <p className="hero-subtitle">
              Connect instantly with HD video and crystal-clear audio. Your secure meeting is ready.
            </p>
          </div>

          <div className="meeting-card">
            <div className="card-header">
              <h2>Your Meeting Details</h2>
            </div>

            <div className="meeting-info-grid">
              <div className="info-card">
                <div className="info-icon">🔢</div>
                <div className="info-content">
                  <span className="info-label">Meeting ID</span>
                  <span className="info-value">{meetingNumber}</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">👤</div>
                <div className="info-content">
                  <span className="info-label">Username</span>
                  <span className="info-value">{userName}</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">🔒</div>
                <div className="info-content">
                  <span className="info-label">Security</span>
                  <span className="info-value">Encrypted</span>
                </div>
              </div>
            </div>

            <div className="join-container">
              <button className="join-btn" onClick={getSignature}>
                <span className="btn-icon">▶</span>
                Join Virtual Meeting
              </button>
              <p className="join-note">Click to enter your meeting room</p>
            </div>

            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">🎥</span>
                <span className="feature-label">HD Video</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎤</span>
                <span className="feature-label">Clear Audio</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💬</span>
                <span className="feature-label">Live Chat</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <span className="feature-label">Screen Share</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div id="meetingSDKElement" className={isMeetingStarted ? "meeting-active" : ""}></div>
    </div>
  );
}

export default App;
