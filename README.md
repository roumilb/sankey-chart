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

| Option                      | Type                              | Description                                                                         |
|-----------------------------|-----------------------------------|-------------------------------------------------------------------------------------|
| `id`                        | `string`                          | ID of the DOM element where the chart will be displayed.                            |
| `data`                      | `[]`                              | Array of data objects containing `source`, `target`, and `value`.                   |
| `nodeClickCallback`         | `(source) => {}`                  | (optional) Callback function triggered when a node is clicked.                      |
| `linkClickCallback`         | `({source, target, value}) => {}` | (optional) Callback function triggered when a link is clicked.                      |
| `iteractivity`              | `boolean` By default `false`      | (optional) True if you want to be able to click on node to hide or show child links |
| `iterationHidden`           | `number`                          | (optional) Set a number if you want to hide every node after X levels               |
| `labels`                    | `{}`                              | (optional) Custom labels for the nodes and links.                                   |
| `link.backgroundColor`      | `string`                          | (optional) Default background color for links.                                      |
| `link.hoverBackgroundColor` | `string`                          | (optional) Hover background color for links.                                        |
| `node.backgroundColor`      | `string`                          | (optional) Default background color for nodes.                                      |

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

### Interactivity

The `interactivity` option allows you to enable or disable interactivity on the chart. When interactivity is enabled, you can click on a node to hide or show its child links. This can be useful for exploring the data in more detail.

Also, you can set the `iterationHidden` option to hide every node after X levels. Check the example `examples/interactivity.html` to see how it works.

## Examples

You can find some example Sankey charts in the `examples` folder.

## Development

To build the library, run the following commands:

```bash
npm install
npm run build
```

This will generate the `bundle.js` file in the `dist` folder.

To run the build and watch for changes, run:

```bash
npm run watch
```

## License

This library is released under the MIT license. You are free to use, modify, and distribute it as you see fit. See the `LICENSE` file for more information.
