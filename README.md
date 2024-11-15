# Sankey Chart

A very simple and lightweight JavaScript library to display Sankey charts.

This library allows you to easily create Sankey charts to visualize data flow. It’s designed to be lightweight and simple to use, with minimal setup required. You just need to provide a dataset and the library will handle the rendering of the chart.

## Installation

To use the Sankey chart library, simply download and include the `bundle.js` file in your project and call the `SankeyChart.display()` function. The chart will be rendered inside the specified DOM element, and you can customize its appearance and functionality through various options.

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Sankey Chart Example</title>
	</head>
	<body>
		<div id="chart"></div>
		<script src="bundle.js"></script>
		<script>
			const data = [
				{
					source: 'poi',
					target: 'jft',
					value: 10
				},
				{
					source: 'jft',
					target: 'azy',
					value: 4
				},
				{
					source: 'azy',
					target: 'syn',
					value: 4
				},
				{
					source: 'jft',
					target: 'vbs',
					value: 5
				},
				{
					source: 'vbs',
					target: 'msp',
					value: 2
				},
				{
					source: 'syn',
					target: 'zxp',
					value: 2
				},
				{
					source: 'syn',
					target: 'ygh',
					value: 1
				}
			];

			SankeyChart.display({
				id: 'sankey',
				data
			});
		</script>
	</body>
```

## Options

The `SankeyChart.display()` function accepts an options object with the following properties:

| Option                      | Type                              | Description                                                       |
|-----------------------------|-----------------------------------|-------------------------------------------------------------------|
| `id`                        | `string`                          | ID of the DOM element where the chart will be displayed.          |
| `data`                      | `[]`                              | Array of data objects containing `source`, `target`, and `value`. |
| `nodeClickCallback`         | `(source) => {}`                  | (optional) Callback function triggered when a node is clicked.    |
| `linkClickCallback`         | `({source, target, value}) => {}` | (optional) Callback function triggered when a link is clicked.    |
| `labels`                    | `{}`                              | (optional) Custom labels for the nodes and links.                 |
| `link.backgroundColor`      | `string`                          | (optional) Default background color for links.                    |
| `link.hoverBackgroundColor` | `string`                          | (optional) Hover background color for links.                      |
| `node.backgroundColor`      | `string`                          | (optional) Default background color for nodes.                    |

### Data Format

The data for the Sankey chart should be an array of objects, where each object represents a link between two nodes. Each object should have the following properties:

```javascript
const data = [
    {
        source: 'poi',
        target: 'jft',
        value: 10
    },
    {
        source: 'jft',
        target: 'azy',
        value: 4
    },
    {
        source: 'azy',
        target: 'syn',
        value: 4
    }
];
```

### Labels Format

The `labels` option allows you to customize the labels for the nodes and links in the chart. You can provide custom labels for each node and link by specifying the `nodes` and `links` properties in the `labels` object.

```javascript
const dataLabels = {
    poi: 'Nice label POI',
    jft: '<b>JFT</b>',
    azy: '<span class="my_class">AZY</span>',
    syn: 'SYN'
};
```

## Examples

You can find some example Sankey charts in the `examples` folder.
