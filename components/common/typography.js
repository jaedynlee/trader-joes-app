import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
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

const ButtonBase = (props) => (
  <Pressable
    {...props}
    style={[
      {
        ...props.style,
        alignContent: "center",
        alignItems: "center",
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        padding: 10,
      },
      props.disabled && props.disabledProps,
    ]}
  >
    {props.icon ? (
      <FontAwesomeIcon
        icon={props.icon}
        style={{ ...props.iconProps, marginRight: 8 }}
      />
    ) : null}
    <BodyText
      style={{
        ...props.labelProps,
        ...(props.disabled ? props.disabledLabelProps : {}),
      }}
    >
      {props.name}
    </BodyText>
  </Pressable>
);

export const SecondaryButton = (props) => (
  <ButtonBase
    {...props}
    disabledLabelProps={{ color: colors.DARK_GRAY }}
    disabledProps={{ borderColor: colors.DARK_GRAY }}
    iconProps={{ color: colors.RED }}
    labelProps={{ textAlign: "center", color: colors.RED, fontWeight: "bold" }}
    style={{
      ...props.style,
      backgroundColor: colors.WHITE,
      borderColor: colors.RED,
      borderWidth: 2,
    }}
  />
);

export const PrimaryButton = (props) => (
  <ButtonBase
    {...props}
    disabledProps={{ backgroundColor: colors.DARK_GRAY }}
    iconProps={{ color: colors.WHITE }}
    labelProps={{
      textAlign: "center",
      color: colors.WHITE,
      fontWeight: "bold",
    }}
    style={{
      ...props.style,
      backgroundColor: colors.RED,
    }}
  />
);
