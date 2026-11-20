# decode-uri-component 0.5.1

Source from the [official npm release](https://www.npmjs.com/package/decode-uri-component/v/0.5.1) and [upstream tag](https://github.com/SamVerschueren/decode-uri-component/tree/v0.5.1). The original tarball has SHA-1 `7f66b25bf435df723f9af55713dcf860a1c297d2` and npm integrity `sha512-vWHQkXgg2cE3BB4rR0c+PYw9BCQzLoNIRMI7AunIkZst74tw/vpPp7VLoYtsR/cy1f55g3XDWUslfeCZjiZJyA==`.

The upstream algorithm is unchanged. This copy uses CommonJS because `query-string@7.1.3` requires a callable CommonJS export while upstream 0.5.1 is ESM. The adaptation changes the export in `index.js`, updates the declaration to `export =`, and supplies matching package metadata. Upstream author Sam Verschueren and the MIT license are recorded in `license`.

The [GitHub security advisory](https://github.com/advisories/GHSA-qr28-fpjm-wq7f) identifies 0.5.1 as the patched release. Remove this copy when Expo Router and React Navigation can use an upstream dependency tree containing the fix.
