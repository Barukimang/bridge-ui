import React, { useState } from "react";
// import Link from 'next/link'
import { withRouter, useRouter } from "next/router";
import { Button, IconEthereum, LoadingRing } from "@aragon/ui";
// import Spinner from "react-svg-spinner"
import { ChainUnsupportedError, useWallet, Wallet } from "use-wallet";
import styled, { CSSProperties, useTheme } from "styled-components";

import TokenCard from "../components/token-card";
import { featuredTokens } from "../lib/tokens";
import { INVALID_CHAIN_ID, METAMASK_IS_NOT_AVAILABLE } from "../lib/errors";
import { usePool } from "@vocdoni/react-hooks";
import { useTokens } from "../lib/hooks/tokens";
import { FALLBACK_TOKEN_ICON } from "../lib/constants";
import { useMessageAlert } from "../lib/hooks/message-alert";
import { ExternalLink } from "../components/external-link";
import { theme } from "../theme";

const Head = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Title = styled.h1`
    margin-bottom: 5px;
    text-align: center;
`;

const Subtitle = styled.h4`
    margin-top: 5px;
    font-size: 20px;
    text-align: center;
    max-width: 300px;
    color: ${({ theme }) => theme.accent1};
`;

const Row = styled.div`
    display: flex;
    align-items: ${({ alignItems }: CSSProperties) => alignItems};
    justify-content: ${({ justifyContent }) => justifyContent};
`;

const LeftSection = styled.div`
    max-width: ${({ maxWidth }: CSSProperties) => maxWidth};
    width: ${({ width }) => width};
`;

const RightSection = styled.div`
    width: ${({ width }: CSSProperties) => width};
    text-align: ${({ textAlign }) => textAlign};
    max-width: ${({ maxWidth }) => maxWidth};
`;

const ConnectButton = styled(Button)`
    max-width: 300px;
    margin: auto;
`;

const Description = styled.h4`
    font-size: 20px;
    margin-bottom: 10px;
`;

const ColorText = styled.span`
    color: ${({ theme }) => theme.accent1};
`;

const GreyCircle = styled.div`
    background-color: #ccc;
    border-radius: 50%;
    height: 140px;
    width: 140px;
`;

const TokenList = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 -1em;
`;

const ShowMoreButton = styled(Button)`
    min-width: 200px;
`;

interface HandleConnectorProps {
    poolLoading: boolean;
    wallet: Wallet<unknown>;
    connecting: boolean;
    onSignIn: () => void;
    isConnected: boolean;
}

const HandleConnector = ({
    poolLoading,
    wallet,
    connecting,
    onSignIn,
    isConnected,
}: HandleConnectorProps) => {
    const theme = useTheme();

    if (poolLoading || connecting) {
        const connectingToVocdoni = "Conneting to Vocdoni";
        const connectingToWeb3 = "Connecting to " + wallet.networkName;
        const label = poolLoading ? connectingToVocdoni : connectingToWeb3;
        return (
            <ConnectButton
                label={label}
                icon={<LoadingRing />}
                wide
                onClick={wallet.reset}
            />
        );
    }

    return (
        <ConnectButton
            label={isConnected ? "Show dashboard" : "Connect with MetaMask"}
            icon={<IconEthereum />}
            mode="strong"
            wide
            onClick={onSignIn}
        />
    );
};

// MAIN COMPONENT
const IndexPage = () => {
    const { setAlertMessage } = useMessageAlert();
    const [connecting, setConnecting] = useState(false);
    const router = useRouter();
    const {
        pool,
        loading: poolLoading,
        error: poolError,
        refresh: poolRefresh,
    } = usePool();
    const wallet = useWallet();
    const tokenInfos = useTokens(featuredTokens);

    const isConnected = wallet.status == "connected";

    // CALLBACKS

    function onSignIn() {
        if (pool && wallet.status == "connected") {
            return router.push("/dashboard");
        }

        setConnecting(true);

        return wallet
            .connect("injected")
            .then(() => {
                if (!wallet.connectors.injected)
                    throw new Error(METAMASK_IS_NOT_AVAILABLE);
                router.push("/dashboard");
            })
            .catch((err) => {
                setConnecting(false);

                if (
                    (err && err.message == INVALID_CHAIN_ID) ||
                    err instanceof ChainUnsupportedError
                ) {
                    const msg = "Please, switch to the {{NAME}} network".replace(
                        "{{NAME}}",
                        process.env.ETH_NETWORK_ID
                    );
                    return setAlertMessage(msg);
                } else if (err && err.message == METAMASK_IS_NOT_AVAILABLE) {
                    return setAlertMessage(
                        "Please, install Metamask or a Web3 compatible wallet"
                    );
                }
                console.error(err);
                setAlertMessage(
                    "Could not access Metamask or connect to the network"
                );
            });
    }

    return (
        <div>
            <Head>
                <Title>Bridge</Title>
                <Subtitle>Trustless governance for Token holders</Subtitle>
            </Head>

            <Row alignItems={"center"}>
                <LeftSection maxWidth={"60%"}>
                    <Description>
                        Submit proposals for <ColorText>ERC20</ColorText> tokens
                        and vote on them using a decentralized end-to-end
                        verifiable <ColorText>layer 2</ColorText> blockchain.{" "}
                    </Description>
                    <p>
                        <small>
                            <ExternalLink
                                color={theme.accent1}
                                link="https://ethereum.org/en/developers/docs/standards/tokens/erc-20/"
                            >
                                What is an ERC20 Token?
                            </ExternalLink>
                        </small>
                    </p>
                </LeftSection>
                <RightSection width={"100%"} textAlign={"center"}>
                    {/** Not sure if we want this props drill... */}
                    <HandleConnector
                        poolLoading={poolLoading}
                        wallet={wallet}
                        connecting={connecting}
                        onSignIn={onSignIn}
                        isConnected={isConnected}
                    />
                </RightSection>
            </Row>

            <br />
            <br />

            <Row alignItems="center" justifyContent="space-around">
                <LeftSection width="150px">
                    <GreyCircle />
                </LeftSection>
                <RightSection maxWidth="60%">
                    <h2>Speak up</h2>
                    <h4>
                        Find your token on the list and vote on the decisions
                        that will make it grow. Be the first one to register it
                        if it doesn’t exist and create your first proposal.
                    </h4>
                    <p>
                        <small>
                            <ExternalLink
                                color={theme.accent1}
                                link="https://ethereum.org/en/developers/docs/standards/tokens/erc-20/"
                            >
                                Learn more
                            </ExternalLink>
                        </small>
                    </p>
                </RightSection>
            </Row>

            <br />
            <br />

            <h2>Top Tokens</h2>
            <p>
                Below is a list of some of the most relevant tokens on the
                platform
            </p>

            <TokenList>
                {featuredTokens.map((tokenAddr) => (
                    <TokenCard
                        key={tokenAddr}
                        name={tokenInfos.get(tokenAddr)?.symbol}
                        icon={FALLBACK_TOKEN_ICON}
                        rightText=""
                        href={tokenAddr ? "/tokens/info#/" + tokenAddr : ""}
                    >
                        <p>{tokenInfos.get(tokenAddr)?.name || "(loading)"}</p>
                    </TokenCard>
                ))}
            </TokenList>

            <br />
            <br />

            <Row justifyContent={"space-around"}>
                <ShowMoreButton href="/tokens">Show more</ShowMoreButton>
            </Row>
        </div>
    );
};

export default withRouter(IndexPage);
