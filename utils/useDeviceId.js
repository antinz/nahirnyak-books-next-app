import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function useDeviceId() {
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    let id = localStorage.getItem("device-udid");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("device-udid", id);
    }
    setDeviceId(id);
  }, []);

  return deviceId;
}
