import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@device_unique_code";
const ALLOWED_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ";
const CODE_LENGTH = 6;

const generateCode = (): string => {
  let result = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * ALLOWED_CHARS.length);
    result += ALLOWED_CHARS[randomIndex];
  }
  return result;
};

export const useDeviceCode = () => {
  const [deviceCode, setDeviceCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeDeviceCode = async () => {
      try {
        // Try to get existing code
        let code = await AsyncStorage.getItem(STORAGE_KEY);

        // If no code exists, generate and store a new one
        if (!code) {
          code = generateCode();
          await AsyncStorage.setItem(STORAGE_KEY, code);
        }

        setDeviceCode(code);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to initialize device code")
        );
        setIsLoading(false);
      }
    };

    initializeDeviceCode();
  }, []);

  return {
    deviceCode,
    isLoading,
    error,
  };
};
