import { Button, Pressable, Text } from "react-native";
import { colors } from "../../style";

export const BodyText = (props) => (
  <Text {...props} style={{ ...props.style, fontSize: 16 }}>
    {props.children}
  </Text>
);

export const SmallHeader = (props) => (
  <Text {...props} style={{ ...props.style, fontSize: 16, fontWeight: "bold" }}>
    {props.children}
  </Text>
);

export const Header = (props) => (
  <Text {...props} style={{ ...props.style, fontSize: 20, fontWeight: "bold" }}>
    {props.children}
  </Text>
);

export const LegalText = (props) => (
  <Text {...props} style={{ ...props.style, fontSize: 12 }}>
    {props.children}
  </Text>
);

export const TertiaryButton = (props) => (
  <Button {...props} style={{ ...props.style }} color={colors.RED}>
    {props.children}
  </Button>
);

export const PrimaryButton = (props) => (
  <Pressable
    {...props}
    style={[
      {
        ...props.style,
        backgroundColor: colors.RED,
        borderRadius: 10,
        alignContent: "center",
        justifyContent: "center",
      },
      props.disabled && { backgroundColor: colors.DARK_GRAY },
    ]}
  >
    <BodyText
      style={{ textAlign: "center", color: colors.WHITE, fontWeight: "bold" }}
    >
      {props.name}
    </BodyText>
  </Pressable>
);
