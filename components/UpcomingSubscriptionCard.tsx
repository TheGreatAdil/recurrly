import { formatCurrency } from "@/lib/utils";
import { Image, Text, View } from "react-native";

const UpcomingSubscriptionCard = ({
  data: { name, price, daysLeft, icon, currency },
}: {
  data: UpcomingSubscription;
}) => {
  return (
    <View className="upcoming-card">
      <View className="upcoming-row">
        <Image source={icon} className="upcoming-icon" />

        <View>
          <Text className="upcoming-price">
            {formatCurrency(price, currency)}
          </Text>
          <Text className="upcoming-meta" numberOfLines={1}>
            <Text className="upcoming-meta" numberOfLines={1}>
              {daysLeft === 0
                ? "Today"
                : daysLeft === 1
                  ? "1 day left"
                  : `${daysLeft} days left`}
            </Text>
          </Text>
        </View>
      </View>

      <Text className="upcoming-name" numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};

export default UpcomingSubscriptionCard;
