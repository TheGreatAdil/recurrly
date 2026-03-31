import { Link } from "expo-router";
import { Text, View } from "react-native";

const SignIn = () => {
  return (
    <View>
      <Text>Sign Up</Text>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 rounded bg-white p-4 text-primary shadow-xl"
      >
        Sign In
      </Link>
    </View>
  );
};

export default SignIn;
