import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const SignIn = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>Sign Up</Text>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 rounded bg-white p-4 text-primary shadow-xl"
      >
        Sign In
      </Link>
    </SafeAreaView>
  );
};

export default SignIn;
