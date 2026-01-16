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
    const zmmtgRoot = document.getElementById("zmmtg-root")!;
    zmmtgRoot.style.display = "block";

    // Force center positioning after SDK loads
    const forceCenter = () => {
      const root = document.getElementById("zmmtg-root");
      if (root) {
        root.style.position = "fixed";
        root.style.top = "0";
        root.style.left = "0";
        root.style.right = "0";
        root.style.bottom = "0";
        root.style.width = "100vw";
        root.style.height = "100vh";
        root.style.transform = "none";
        root.style.margin = "0";
        
        // Also fix any child divs
        const children = root.querySelectorAll("div");
        children.forEach((child: Element) => {
          const htmlChild = child as HTMLElement;
          if (htmlChild.style.position === "absolute") {
            htmlChild.style.left = "0";
            htmlChild.style.right = "0";
            htmlChild.style.margin = "0 auto";
          }
        });
      }
    };

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      patchJsMedia: true,
      leaveOnPageUnload: true,
      success: (success: unknown) => {
        console.log(success);
        
        // Force center immediately and repeatedly
        forceCenter();
        setInterval(forceCenter, 100);
        
        ZoomMtg.join({
          signature: signature,
          meetingNumber: meetingNumber,
          userName: userName,
          sdkKey: sdkKey,
          userEmail: userEmail,
          passWord: passWord,
          tk: registrantToken,
          zak: zakToken,
          success: (success: unknown) => {
            console.log(success);
            forceCenter();
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
            <span>Zoom Meeting on AWS</span>
          </div>
        </div>
        <h1>Join Your Virtual Meeting</h1>
        <p>Connect instantly with HD video and crystal-clear audio. Your secure meeting is ready.</p>
      </div>

      <div className="meeting-card">
        <div className="meeting-info">
          <div className="info-item">
            <div className="info-icon">🔢</div>
            <div className="info-label">Meeting ID</div>
            <div className="info-value">{meetingNumber || "Not Set"}</div>
          </div>
          <div className="info-item">
            <div className="info-icon">👤</div>
            <div className="info-label">Joining as</div>
            <div className="info-value">{userName}</div>
          </div>
          <div className="info-item">
            <div className="info-icon">🔒</div>
            <div className="info-label">Security</div>
            <div className="info-value">Encrypted</div>
          </div>
        </div>

        <div className="join-section">
          <h2>Ready to Join?</h2>
          <p>Click the button below to enter your meeting room</p>
          <button className="join-button" onClick={getSignature}>
            Join Meeting
          </button>
        </div>

        <div className="features">
          <div className="feature">
            <div className="feature-icon">🎥</div>
            <div className="feature-text">HD Video</div>
          </div>
          <div className="feature">
            <div className="feature-icon">🎤</div>
            <div className="feature-text">Clear Audio</div>
          </div>
          <div className="feature">
            <div className="feature-icon">💬</div>
            <div className="feature-text">Live Chat</div>
          </div>
          <div className="feature">
            <div className="feature-icon">📱</div>
            <div className="feature-text">Screen Share</div>
          </div>
        </div>
      </div>

      <div id="meetingSDKElement"></div>
    </div>
  );
}

export default App;
