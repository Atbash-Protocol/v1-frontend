import "./notfound.scss";

import { useTranslation } from "react-i18next";

const NotFound = () => {
    const { t } = useTranslation();

    return (
        <div className="not-found-page">
            <p>{t("PageNotFound")}</p>
        </div>
    );
};

export default NotFound;
