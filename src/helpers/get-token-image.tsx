import SbImg from "../assets/tokens/bash.png";
import sBASHImg from "../assets/tokens/sBASH.png";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "bash") {
        return toUrl(SbImg);
    }

    if (name === "sbash") {
        return toUrl(sBASHImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
