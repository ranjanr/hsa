export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }
  
  let sessionId = localStorage.getItem("hsa_session_id");
  if (!sessionId) {
    sessionId = "session_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("hsa_session_id", sessionId);
  }
  
  return sessionId;
}
