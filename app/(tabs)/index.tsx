import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-5xl font-sans-bold">Home</Text>

      <Link
        href="/onboarding"
        className="mt-4 p-4 font-sans-bold rounded bg-primary text-white"
      >
        Go To Onboarding
      </Link>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 p-4 font-sans-bold rounded bg-primary text-white"
      >
        Sign In
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 p-4 font-sans-bold rounded bg-primary text-white"
      >
        Sign Up
      </Link>
    </SafeAreaView>
  );
}
