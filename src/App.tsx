import "./App.css";
import { ZoomMtg } from "@zoom/meetingsdk";

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

function App() {
  const authEndpoint = import.meta.env.VITE_AUTH_ENDPOINT || "https://zoom-meeting-sdk-auth-sample-rn55.onrender.com";
  const sdkKey = import.meta.env.VITE_SDK_KEY || "";
  const meetingNumber = import.meta.env.VITE_MEETING_NUMBER || "";
  const passWord = import.meta.env.VITE_PASSWORD || "";
  const role = 0;
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

  function startMeeting(signature: string) {
    document.getElementById("zmmtg-root")!.style.display = "block";

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      patchJsMedia: true,
      leaveOnPageUnload: true,
      success: (success: unknown) => {
        console.log(success);
        // can this be async?
        ZoomMtg.join({
          signature: signature,
          meetingNumber: meetingNumber,
          passWord: passWord,
          userName: userName,
          userEmail: userEmail,
          tk: registrantToken,
          zak: zakToken,
          success: (success: unknown) => {
            console.log(success);
          },
          error: (error: unknown) => {
            console.log(error);
          },
        });
      },
      error: (error: unknown) => {
        console.log(error);
      },
    });
  }

return (
  <div className="App">
    <div className="hero">
      <div className="logo-container">
        <div className="zoom-logo">
          <div className="logo-icon">📹</div>
          <span>Zoom Meeting</span>
        </div>
      </div>
      <h1>Join Your Virtual Meeting</h1>
      <p>Connect with your team from anywhere. High-quality video, crystal clear audio, and seamless screen sharing.</p>
    </div>

    <div className="meeting-card">
      <div className="meeting-info">
        <div className="info-item">
          <div className="info-icon">🎥</div>
          <div className="info-label">Video Quality</div>
          <div className="info-value">HD 1080p</div>
        </div>
        <div className="info-item">
          <div className="info-icon">🔒</div>
          <div className="info-label">Security</div>
          <div className="info-value">End-to-End</div>
        </div>
        <div className="info-item">
          <div className="info-icon">👥</div>
          <div className="info-label">Participants</div>
          <div className="info-value">Up to 1000</div>
        </div>
        <div className="info-item">
          <div className="info-icon">⏱️</div>
          <div className="info-label">Duration</div>
          <div className="info-value">Unlimited</div>
        </div>
      </div>

      <div className="join-section">
        <h2>Ready to Join?</h2>
        <p>Click below to enter your meeting room</p>
        <button className="join-button" onClick={getSignature}>
          Join Meeting Now
        </button>
      </div>

      <div className="features">
        <div className="feature">
          <div className="feature-icon">💬</div>
          <div className="feature-text">Live Chat</div>
        </div>
        <div className="feature">
          <div className="feature-icon">🖥️</div>
          <div className="feature-text">Screen Share</div>
        </div>
        <div className="feature">
          <div className="feature-icon">🎙️</div>
          <div className="feature-text">Audio Controls</div>
        </div>
        <div className="feature">
          <div className="feature-icon">📊</div>
          <div className="feature-text">Presentations</div>
        </div>
      </div>
    </div>

    <div id="meetingSDKElement">
      {/* Zoom Meeting SDK Component View Rendered Here */}
    </div>
  </div>
);
}

export default App;
