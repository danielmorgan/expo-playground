import { PairingProvider } from "@/ctx/PairingContext";
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <PairingProvider>
      <Slot/>
    </PairingProvider>
  );
}
