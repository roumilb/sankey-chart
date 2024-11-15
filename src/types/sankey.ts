import {RawData} from "./rawData";
import {LinkClickCallback, NodeClickCallback} from "./callbacks";
import {Label} from "./label";
import {Options} from "./options";

type DefaultValues = {
    link: {
        fillColor: string,
        hoverFillColor: string
    },
    node: {
        backgroundColor: string
    }
}

type ParentChild = Record<string, string[]>

type NodeValue = Record<string, number>

export type Node = {
    id: string,
    children: Node[]
}

export type Sankey = {
    chartElement: HTMLElement | null,
    chartDimensions: { width: number, height: number },
    dataAsTree: [Node] | null,
    maxHeightNodeValue: number,
    htmlElement: string[][],
    linksPath: string[],
    nodeValues: NodeValue,
    parentChildren: ParentChild,
    rawData: RawData[] | null,
    nodeClickCallback: NodeClickCallback | null,
    linkClickCallback: LinkClickCallback | null,
    nodeElements: NodeListOf<HTMLElement> | null,
    linkElements: NodeListOf<HTMLElement> | null,
    defaultValues: DefaultValues,
    labels: Label,
    display: (options: Options) => void,
    setData: (options: Options) => void,
    configureChartElement: () => void,
    sortDataAsTree: () => void,
    fillNodeValues: () => void,
    getHeightForNode: (value: number) => number,
    fillNodeHtmlElement: (nodes: Node[], level: number, isFirst?: boolean) => void,
    fillLinksPath: () => void,
    addHtml: () => void,
    drawPath: () => void
    getLink: (source: string, target: string) => RawData | undefined
    setNodeElements: () => void,
    setLinkElements: () => void,
    setNodeClick: () => void,
    setLinkClick: () => void,
    setNodeHover: () => void,
    getHistoryForNode: (nodeId: string) => string[] | null
}
