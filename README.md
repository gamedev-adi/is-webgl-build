# is-webgl-build
Validates if given folder is a valid WebGL build folder
> validates WebGL builds exported from Unity

**Note:** 
- Currently only WebGL builds are supported. Contributions are encouraged!.
- Ensure that the file names referenced in index.html inside the build folder match the actual file names.
- Exact content validation is quite tricky, so for that purpose,consider using http-server module or any other http-server to check for runtime issues.
- This package primarily validates structure, checking for corrupted files(size 0) & detect missing files

## Features
- Validate WebGL builds (works for compressed as well as uncompressed builds)
- Detect missing or malformed files

## Installation
`npm install @adityamore.gamedev/is-webgl-build`

## Usage
```
const { validateBuild } = require("@adityamore.gamedev/is-webgl-build");

const result = validateBuild("/path/to/build/folder");

if (result.valid) 
{
  console.log("This is a valid WebGL build!");
}
else
{
  console.error("Invalid build:", result.errors);
}
```

## Contributing
Contributions are welcome!
- If you add support for another engine, submit a PR.
- Your contribution will be showcased as part of this open source project.

## License
MIT © 2025 Aditya More