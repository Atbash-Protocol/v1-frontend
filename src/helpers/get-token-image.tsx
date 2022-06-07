import SbImg from "../assets/tokens/bash.png";
import sBASHImg from "../assets/tokens/sBASH.png";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "BASH") {
        return toUrl(SbImg);
    }

    if (name === "sBASH") {
        return toUrl(sBASHImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
