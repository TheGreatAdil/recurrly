import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="h-full items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link
        href="/onboarding"
        className="mt-4 rounded bg-white p-4 text-primary shadow-xl"
      >
        Go To Onboarding
      </Link>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 rounded bg-white p-4 text-primary shadow-xl"
      >
        Sign In
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 rounded bg-white p-4 text-primary shadow-xl"
      >
        Sign Up
      </Link>

      <Link
        href="/subscriptions/spotify"
        className="mt-4 rounded bg-white p-4 text-primary shadow-xl"
      >
        View Spotify Subscription
      </Link>
      <Link
        href="/subscriptions/claude"
        className="mt-4 rounded bg-white p-4 text-primary shadow-xl"
      >
        Claude Subscription
      </Link>
    </SafeAreaView>
  );
}
