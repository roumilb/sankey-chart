import {Options} from "./types/options";
import {Node, Sankey} from "./types/sankey";
import {RawData} from "./types/rawData";

import './style.css';

const sankey: Sankey = {
    chartElement: null,
    chartDimensions: {
        width: 0,
        height: 0
    },
    dataAsTree: null,
    maxHeightNodeValue: 0,
    htmlElement: [],
    linksPath: [],
    nodeValues: {},
    parentChildren: {},
    rawData: null,
    nodeClickCallback: null,
    linkClickCallback: null,
    nodeElements: null,
    linkElements: null,
    isInteractive: false,
    nodeDisplayStates: {},
    iterationHidden: null,
    defaultValues: {
        link: {
            fillColor: 'rgba(229, 246, 254, 0.5)',
            hoverFillColor: 'rgba(0, 164, 255, 0.5)'
        },
        node: {
            backgroundColor: '#00a4ff'
        }
    },
    labels: {},
    display: function (options: Options): void {
        this.setData(options);
        this.configureChartElement();
        this.fillNodeValues();
        this.sortDataAsTree();
        if (!this.dataAsTree) {
            throw new Error('Invalid data, data as tree is required');
        }
        this.fillNodeHtmlElement(this.dataAsTree, 0, true);
        this.fillLinksPath();
        this.addHtml();
        this.drawPath();
        this.setNodeElements();
        this.setLinkElements();
        this.setNodeClick();
        this.setLinkClick();
        this.setNodeHover();
    },
    setData: function (options: Options): void {
        if (!options.id) {
            throw new Error('Invalid data, id is required');
        }

        this.chartElement = document.getElementById(options.id);

        if (!this.chartElement) {
            throw new Error(`Element with id ${options.id} not found`);
        }

        if (!options.data || options.data.length === 0) {
            throw new Error('Invalid data, data is required and should have at least one element');
        }

        this.rawData = options.data;

        this.chartDimensions = {
            width: this.chartElement.clientWidth,
            height: this.chartElement.clientHeight
        };

        if (!this.chartDimensions.width || !this.chartDimensions.height) {
            throw new Error('Invalid dimensions, please set the width and height of the element');
        }

        this.maxHeightNodeValue = Math.max(...options.data.map((linkValue) => linkValue.value));

        if (options.nodeClickCallback && typeof options.nodeClickCallback === 'function') {
            this.nodeClickCallback = options.nodeClickCallback;
        }

        if (options.linkClickCallback && typeof options.linkClickCallback === 'function') {
            this.linkClickCallback = options.linkClickCallback;
        }

        if (options.labels) {
            this.labels = options.labels;
        }

        if (options.link) {
            if (options.link.backgroundColor) {
                this.defaultValues.link.fillColor = options.link.backgroundColor;
            }

            if (options.link.hoverBackgroundColor) {
                this.defaultValues.link.hoverFillColor = options.link.hoverBackgroundColor;
            }
        }

        if (options.node) {
            if (options.node.backgroundColor) {
                this.defaultValues.node.backgroundColor = options.node.backgroundColor;
            }
        }

        this.isInteractive = options.interactive ?? false;

        this.iterationHidden = options.iterationHidden ?? null;
    },
    configureChartElement: function (): void {
        if (this.chartElement) {
            this.chartElement.classList.add('sankey_chart_container');
        }
    },
    sortDataAsTree: function (): void {
        if (!this.rawData) {
            throw new Error('Invalid data, data is required');
        }

        const nodes: Record<string, Node> = {};
        this.rawData.forEach((data: RawData) => {
            if (!nodes[data.source]) {
                nodes[data.source] = {
                    id: data.source,
                    children: []
                };
            }
            if (!nodes[data.target]) {
                nodes[data.target] = {
                    id: data.target,
                    children: []
                };
            }
        });

        this.rawData.forEach((data: RawData) => {
            nodes[data.source].children.push(nodes[data.target]);
        });

        const targets = new Set(this.rawData.map((data: RawData) => data.target));
        const rootNode = this.rawData.find((data: RawData) => !targets.has(data.source));

        if (!rootNode) {
            throw new Error('Invalid data, no root node found');
        }

        const rootId = rootNode.source;
        this.dataAsTree = [nodes[rootId]];
    },
    fillNodeValues: function (): void {
        if (!this.rawData) {
            throw new Error('Invalid data, data is required');
        }

        this.rawData.forEach((nodeValue) => {
            if (!this.parentChildren[nodeValue.source]) {
                this.parentChildren[nodeValue.source] = [];
            }

            if (!this.nodeValues[nodeValue.target]) {
                this.nodeValues[nodeValue.target] = 0;
            }

            this.parentChildren[nodeValue.source].push(nodeValue.target);
            this.nodeValues[nodeValue.target] += nodeValue.value;
        });
    },
    getHeightForNode: function (value: number): number {
        return value / this.maxHeightNodeValue * this.chartDimensions.height;
    },
    fillNodeHtmlElement: function (nodes: Node[], level: number, isFirst: boolean = false) {
        if (!this.htmlElement[level]) {
            this.htmlElement[level] = [];
        }

        nodes.forEach((node: Node) => {
            let height = 0;
            if (isFirst) {
                height = this.getHeightForNode(this.maxHeightNodeValue);
            } else {
                height = this.nodeValues[node.id] ? this.getHeightForNode(this.nodeValues[node.id]) : 0;
            }

            if (!height) {
                return;
            }

            const label = this.labels[node.id] ? this.labels[node.id] : node.id;

            const needToHide = this.iterationHidden && level >= this.iterationHidden
            this.nodeDisplayStates[node.id] = !needToHide;

            const displayValue = needToHide ? 'none' : 'flex';

            const style = `height: ${height}px; background: ${this.defaultValues.node.backgroundColor}; display: ${displayValue}`;

            this.htmlElement[level].push(`<div id="node_${node.id}" class="sankey_chart_node" style="${style}">
                                            <div class="sankey_chart_node_label">${label}</div>
                                          </div>`);

            if (node.children.length) {
                return this.fillNodeHtmlElement(node.children, level + 1);
            }
        });
    },
    fillLinksPath: function () {
        for (const [index, children] of Object.entries(this.parentChildren)) {
            this.linksPath.push(...children.map((child) => `<path fill="${this.defaultValues.link.fillColor}" class="sankey_chart_link" id="${index}-${child}"></path>`));
        }
    },
    addHtml: function () {
        if (!this.chartElement) {
            throw new Error('Invalid chart element');
        }
        this.chartElement.innerHTML = this.htmlElement.map((htmlElement, index) => {
            if (index === 0) {
                return `<div class="sankey_chart_node_container">${htmlElement.join('')}</div>`;
            }

            return `<div class="sankey_chart_grow"></div><div class="sankey_chart_node_container">${htmlElement.join('')}</div>`;
        }).join('');

        this.chartElement.innerHTML += `<svg id="sankey_chart_svg_container" width="${this.chartDimensions.width}" height="${this.chartDimensions.height}" viewBox="0 0 ${this.chartDimensions.width} ${this.chartDimensions.height}"></svg>`;
        const svgContainer = document.getElementById('sankey_chart_svg_container');
        if (!svgContainer) {
            throw new Error('Invalid svg container');
        }
        svgContainer.innerHTML = this.linksPath.join('');
    },
    drawPath: function () {
        for (const [index, children] of Object.entries(this.parentChildren)) {
            let lastChildEndY = 0;
            children.forEach((child) => {
                const linkData = this.getLink(index, child) as RawData;

                const linkHeightPercentage = linkData.value / (this.nodeValues[index] ? this.nodeValues[index] : linkData.value);

                const linkElement = document.getElementById(`${index}-${child}`);

                const sourceNode = document.getElementById(`node_${index}`);
                const targetNode = document.getElementById(`node_${child}`);

                if (!sourceNode || !targetNode || !linkElement) {
                    throw new Error('Invalid sourceNode or targetNode element');
                }

                if (targetNode && targetNode.style.display === 'none') {
                    linkElement.setAttribute('d', '');
                    return;
                }

                const sourceNodeRect = sourceNode.getBoundingClientRect();
                const targetNodeRect = targetNode.getBoundingClientRect();

                const linkHeight = sourceNodeRect.height * linkHeightPercentage + lastChildEndY;

                if (!this.chartElement) {
                    throw new Error('Invalid chart element');
                }

                const chartElementRect = this.chartElement.getBoundingClientRect();

                const points = [
                    {
                        x: sourceNodeRect.x - chartElementRect.x + sourceNodeRect.width,
                        y: sourceNodeRect.y - chartElementRect.y + lastChildEndY
                    },
                    {
                        x: targetNodeRect.x - chartElementRect.x,
                        y: targetNodeRect.y - chartElementRect.y
                    },
                    {
                        x: targetNodeRect.x - chartElementRect.x,
                        y: targetNodeRect.y - chartElementRect.y + targetNodeRect.height
                    },
                    {
                        x: sourceNodeRect.x - chartElementRect.x + sourceNodeRect.width,
                        y: sourceNodeRect.y - chartElementRect.y + linkHeight
                    }
                ];

                lastChildEndY = points[3].y - (sourceNodeRect.y - chartElementRect.y);

                const xHalf = points[0].x + (points[1].x - points[0].x) / 2;

                const svgPath = `M ${points[0].x} ${points[0].y}
                                 C ${xHalf} ${points[0].y}, ${xHalf} ${points[1].y}, ${points[1].x} ${points[1].y}
                                 L ${points[2].x} ${points[2].y}
                                 C ${xHalf} ${points[2].y}, ${xHalf} ${points[3].y}, ${points[3].x} ${points[3].y}`;

                linkElement.setAttribute('d', svgPath);
            });
        }
    },
    getLink: function (source, target) {
        if (!this.rawData) {
            throw new Error('Invalid data, data is required');
        }
        return this.rawData.find((link: RawData) => link.source === source && link.target === target);
    },
    setNodeElements: function () {
        this.nodeElements = document.querySelectorAll('.sankey_chart_node');
    },
    setLinkElements: function () {
        this.linkElements = document.querySelectorAll('.sankey_chart_link');
    },
    setNodeClick: function () {
        if (!this.nodeElements) {
            throw new Error('Invalid node elements');
        }

        this.nodeElements.forEach((node) => {
            node.addEventListener('click', () => {
                const nodeSourceId = node.id.replace('node_', '');

                if (this.nodeClickCallback) {
                    this.nodeClickCallback(nodeSourceId);
                }

                if (!this.isInteractive) {
                    return;
                }

                const needToHide = this.nodeDisplayStates[nodeSourceId] === undefined ? true : !this.nodeDisplayStates[nodeSourceId];
                this.nodeDisplayStates[nodeSourceId] = needToHide;

                const nodeIdsToToggle = this.getAllNodeChildrenFromNode(nodeSourceId);

                if (!nodeIdsToToggle) {
                    return;
                }

                const displayValue = needToHide ? 'none' : 'block';
                nodeIdsToToggle.forEach((nodeId) => {
                    this.nodeDisplayStates[nodeId] = needToHide;
                    const nodeElement = document.getElementById(`node_${nodeId}`);
                    if (nodeElement) {
                        nodeElement.style.display = displayValue;
                    }
                });
                this.drawPath();
            });
        });
    },
    setLinkClick: function () {
        if (!this.linkClickCallback) {
            return;
        }

        if (!this.linkElements) {
            throw new Error('Invalid link elements');
        }

        this.linkElements.forEach((link) => {
            link.addEventListener('click', () => {
                const [source, target] = link.id.split('-');

                // @ts-ignore
                this.linkClickCallback(this.getLink(source, target));
            });
        });
    },
    setNodeHover: function () {
        if (!this.nodeElements || !this.linkElements) {
            throw new Error('Invalid node or link elements');
        }

        this.nodeElements.forEach((node: HTMLElement) => {
            node.addEventListener('mouseover', function () {
                // @ts-ignore
                const nodeHistory = sankey.getHistoryForNode(this.id.replace('node_', '')) as string[];

                for (let i = 0; i < nodeHistory.length - 1; i++) {
                    const linkElement = document.getElementById(`${nodeHistory[i]}-${nodeHistory[i + 1]}`);
                    if (linkElement) {
                        linkElement.style.fill = sankey.defaultValues.link.hoverFillColor;
                    }
                }

                // @ts-ignore
                this.addEventListener('mouseout', () => {
                    // @ts-ignore
                    sankey.linkElements.forEach((link: HTMLElement) => {
                        link.style.fill = sankey.defaultValues.link.fillColor;
                    });
                });
            });
        });
    },
    getHistoryForNode: function (nodeId: string): string[] | null {
        if (!this.dataAsTree) {
            throw new Error('Invalid data, data is required');
        }

        const findNode = (node: Node, path: string[]): string[] | null => {
            path.push(node.id);
            if (node.id === nodeId) {
                return path;
            }

            if (node.children.length) {
                for (let child of node.children) {
                    const history: string[] | null = findNode(child, [...path]);
                    if (history) {
                        return history;
                    }
                }
            }

            return null;
        };

        for (let node of this.dataAsTree) {
            const history: string[] | null = findNode(node, []);
            if (history) {
                return history;
            }
        }

        return null;
    },
    getAllNodeChildrenFromNode: function (nodeId: string): string[] | null {
        if (!this.dataAsTree) {
            throw new Error('Invalid data, data is required');
        }

        const findNodeChildren = (node: Node, childIds: string[], nodeFound: boolean): string[] => {
            if (nodeFound) {
                childIds.push(node.id);
            }

            if (node.id === nodeId) {
                nodeFound = true;
            }

            if (node.children.length) {
                for (let child of node.children) {
                    findNodeChildren(child, childIds, nodeFound);
                }
            }

            return childIds;
        }

        for (let node of this.dataAsTree) {
            const children: string[] = findNodeChildren(node, [], false);
            if (children.length) {
                return children;
            }
        }

        return null;
    }
};

export default sankey;
