import {RawData} from "./rawData";

export type NodeClickCallback = (node: string, isLastNodeBranch: boolean) => void;
export type LinkClickCallback = (node: RawData) => void
