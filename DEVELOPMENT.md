# Observable Inputs - Development

To develop Observable Inputs, clone this repository and install its dependencies:

```
git clone git@github.com:observablehq/inputs.git
cd inputs
pnpm
```

Inputs is written in ES modules and uses [Vite](https://vitejs.dev/) for development; this means that you can edit the Inputs source code and examples, and they’ll update live as you save changes. To start, copy over the example scratch.html file:

```
mkdir scratch
cp test/scratch.html scratch/index.html
```

Then start Vite:

```
pnpm dev
```

Now you can edit scratch/index.html to see your changes.

To run the tests:

```
pnpm test
```

Inputs has both unit tests and snapshot tests. To generate new snapshots, simply delete the current snapshots and then run the tests.

```
rm -rf test/output
pnpm test
```
