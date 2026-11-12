// Change this to true to lock, and false to unlock
const SYSTEM_LOCKED = true;

if (SYSTEM_LOCKED) {
  document.body.innerHTML = `
    <div style="text-align:center; padding:100px; font-family:sans-serif; background:#f8f8f8; height:100vh;">
      <h1 style="font-size:50px;">⚠️</h1>
      <h2>This Service Is Currently Unavailable</h2>
      <p>Service Unavailable - Please Try Again Later</p>
      <p style="color:gray; font-size:13px;">Error Code: 503</p>
    </div>
  `;
  throw new Error("System Locked");
}
