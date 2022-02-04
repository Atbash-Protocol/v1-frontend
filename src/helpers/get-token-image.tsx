import SbImg from "../assets/tokens/SB.png";
import SsbImg from "../assets/tokens/SSB.png";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "BASH") {
        return toUrl(SbImg);
    }

    if (name === "sBASH") {
        return toUrl(SsbImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
