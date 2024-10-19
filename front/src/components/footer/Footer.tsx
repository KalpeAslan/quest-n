import { useMemo } from "react";
import { Box } from "@mui/material";
import { DateTime } from "luxon";

import { IMenuLink } from "@models";
import { Icon } from "@components/UI/icon";
import {
  FooterStylesWrapper,
} from "./footer.styles";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {Link} from "@components/UI/link";
import {useRouter} from "next/router";

const Footer = () => {


  const TG_LINKS: IMenuLink[] = [
    {
      id: 10,
      path: '/explore',
      title: 'Learn & Earn',
      disabled: false,
      type: 'self',
      icon: 'wallet-main',
    },
    {
      id: 11,
      path: '/profile/security',
      title: 'Profile',
      disabled: false,
      type: 'self',
      icon: 'account-user'
    },
    {
      id: 13,
      path: '/profile/rewards',
      title: 'Rewards',
      disabled: false,
      type: 'self',
      icon: 'rewards'
    }
  ]


  const currentYear = useMemo(() => {
    return DateTime.now().year;
  }, []);

  const { pathname } = useRouter();

  return (
    <FooterStylesWrapper>
      <Box display={"flex"} alignItems={"center"} justifyContent={"space-around"}>
        {
          TG_LINKS.map(({ path, title, icon, id}) => {
            const isSelected = pathname === path;
            return <Link key={id} underline={"none"} href={path}>
              <Box gap={1} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} py={2}>
                <Icon color={isSelected ? 'var(--text-link-color)' : 'var(--color-w1)'} name={icon} size={'24'} />
                <p className={"c-font-14-14 c-font-color"}>{title}</p>
              </Box>
            </Link>
          })
        }
      </Box>
    </FooterStylesWrapper>
  );
};

export default Footer;
