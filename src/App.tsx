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
      <main>
        <h1>Zoom Meeting SDK Sample React</h1>
        <button onClick={getSignature}>Join Meeting</button>
      </main>
    </div>
  );
}

export default App;
