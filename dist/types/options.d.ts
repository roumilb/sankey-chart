import { RawData } from "./rawData";
import { Label } from "./label";
import { LinkClickCallback, NodeClickCallback } from "./callbacks";
export type Options = {
    id: string;
    data: RawData[];
    nodeClickCallback: NodeClickCallback | undefined;
    linkClickCallback: LinkClickCallback | undefined;
    labels: Label;
    link: {
        backgroundColor: string;
        hoverBackgroundColor: string;
    };
    node: {
        backgroundColor: string;
    };
    interactive: boolean;
    iterationHidden: number | undefined;
};
