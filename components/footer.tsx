import React from "react";
import styled, { useTheme } from "styled-components";
import Link from "next/link";

import { LINKS } from "./header";
import { ConnectButton } from "./connect-button";
import { useIsMobile } from "../lib/hooks/useWindowSize";

const Container = styled.div`
  padding: 30px 0 30px;
  font-size: 13px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Logo = styled.div`
  background: url('media/footer_logo.svg');
  position: absolute;
  display: flex;
  width: 155px;
  height: 40px;
  left: 150px;
`;

const Section = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 40px 40px 0;
  color: ${({ color }) => color};
`;

const ClickableText = styled.a`
  display: flex;
  padding: 25px 20px;
  text-decoration: none;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.blackAndWhite.b1};
  &:hover {
    color: ${({ theme }) => theme.primary.p1};
    );
`;

const MobileFooter = styled.div`
  background-color: ${({ theme }) => theme.blackAndWhite.w1};
  box-sizing: border-box;
  width: 100%;
  padding: 16px;
  min-height: 100px;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
`;

export const Footer = () => {
  const theme = useTheme();
  const isMobile = useIsMobile();

  const FOOTER_LINKS = LINKS.filter((l) => l.footer);

  return isMobile ? (
    <MobileFooter>
      <ConnectButton />
    </MobileFooter>
  ) : (
    <Container>
      <Section>
        <Logo></Logo>
      </Section>
      <Section>
        {FOOTER_LINKS.map(({ url, name }, i) => (
            <div key={name}>
              <Link href={url} passHref>
                <ClickableText target="_blank">{name}</ClickableText>
              </Link>
            </div>
          ))}
      </Section>
    </Container>
  );
};
