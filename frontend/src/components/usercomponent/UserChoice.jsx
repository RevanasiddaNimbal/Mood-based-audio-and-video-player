import { useLocation } from "react-router-dom";

export default function UserChoice() {
  const location = useLocation();
  const mood = location.state?.mood || "unknown";
  return (
    <div>
      <p>User mood is:{mood}</p>
    </div>
  );
}
