import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { LIGHTNING_ICON, WARNING_ICON } from "../../lib/constants";
import { ConnectWalletLink } from "../connect-button";
import { GrayRectangleTall } from "../gray-rectangle";

const GreyInfo = styled.p`
  max-width: 98%;
  text-align: center;
  font-size: 18px;
  @media ${({ theme }) => theme.screens.tablet} {
    font-size: 16px;
    width: 100%;
    height: 100%;
    text-align: center;
  }
`;

const LightningBolt = styled.div`
  margin: 15px auto;
  background: url(${LIGHTNING_ICON});
  background-repeat: no-repeat;
  width: 52px;
  height: 54px;
`;

// TODO replace background
const ExclamationMark = styled.div`
  margin: 15px auto;
  background: url(${WARNING_ICON});
  background-repeat: no-repeat;
  width: 55px;
  height: 52px;
`;

export const NotConnected = ({ connectMessage = "" }: { connectMessage?: string }) => {
  return (
    <GrayRectangleTall>
      <LightningBolt />
      <GreyInfo>{connectMessage}</GreyInfo>
      <Link href="/tokens/add">
        <ConnectWalletLink />
      </Link>
    </GrayRectangleTall>
  );
};

export const NoTokens = () => {
  return (
    <GrayRectangleTall>
      <ExclamationMark />
      <GreyInfo>You are not a token holder</GreyInfo>
      {/* TODO add a link that motivates user to buy tokens [VR 21-05-2021] */}
      {/* <Link href="/tokens/add">
        <ConnectWalletLink />
      </Link> */}
    </GrayRectangleTall>
  );
};