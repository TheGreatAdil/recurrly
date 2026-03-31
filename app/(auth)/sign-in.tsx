import { Link } from "expo-router";
import { Text, View } from "react-native";

const SignIn = () => {
  return (
    <View>
      <Text>Sign In</Text>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 rounded bg-white p-4 text-primary shadow-xl"
      >
        Create Account
      </Link>
    </View>
  );
};

export default SignIn;
