import { Text } from "react-native";

export const BodyText = (props) => (
  <Text {...props} style={{ ...props.style, fontSize: 16 }}>
    {props.children}
  </Text>
);

export const Header = (props) => (
  <Text {...props} style={{ ...props.style, fontSize: 24, fontWeight: "bold" }}>
    {props.children}
  </Text>
);

export const LegalText = (props) => (
  <Text {...props} style={{ ...props.style, fontSize: 12 }}>
    {props.children}
  </Text>
);
