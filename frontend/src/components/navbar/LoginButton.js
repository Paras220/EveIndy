import {

  useColorMode,
  Link,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import ssoLoginBlackLarge from "../../assets/eve-sso-login-black-large.png";
import ssoLoginBlackSmall from "../../assets/eve-sso-login-black-small.png";
import ssoLoginWhiteLarge from "../../assets/eve-sso-login-white-large.png";
import ssoLoginWhiteSmall from "../../assets/eve-sso-login-white-small.png";

export default function LoginButton(props) {
  const { colorMode, _ } = useColorMode();
  let ssoButtonLarge =
    colorMode === "light" ? ssoLoginWhiteLarge : ssoLoginBlackLarge;
  let ssoButtonSmall =
    colorMode === "light" ? ssoLoginWhiteSmall : ssoLoginBlackSmall;
  const loginButton = useBreakpointValue({
    base: ssoButtonSmall,
    md: ssoButtonLarge,
  });

  return (
    <Link href="/api/login">
      <Image mt={{ base: 0.5, md: 0 }} src={loginButton} />
    </Link>
  );
}
