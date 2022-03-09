import { useTranslation } from "react-i18next";
import { useWeb3Context, useAddress } from "src/hooks";

export default function Home() {
    const { t } = useTranslation();
    const { connect, provider, hasCachedProvider, chainID, connected } = useWeb3Context();
    const address = useAddress();

    return (
        <div className="home">
            <div className="Forecast-card-wallet-notification">
                <div className="Forecast-card-wallet-connect-btn" onClick={connect}>
                    <p>{t("ConnectWallet")}</p>
                </div>
            </div>
        </div>
    );
}
