import ReactDOM from "react-dom";
import { NotFound } from "views";
import { act } from "react-dom/test-utils";

describe("NotFound", () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    it("renders", () => {
        act(() => {
            ReactDOM.render(<NotFound />, container);
        });

        expect(container).toMatchSnapshot();
        expect(container.querySelector("p")?.textContent).toBe("Page not found");
    });
});
