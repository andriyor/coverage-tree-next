import fs from "node:fs";
import zlib from "node:zlib";

import { getTreeByFile } from "ts-tree";

const coverage = JSON.parse(fs.readFileSync('../../work/poynt/mercury-clean/coverage/coverage-summary.json', 'utf-8'))
// const tree = getTreeByFile('../../work/poynt/mercury-clean/src/containers/settings/bank-account/bank-account.container.tsx', coverage)
const tree = getTreeByFile('../../work/poynt/mercury-clean/src/containers/otp/otp.container.tsx', coverage)
console.dir(tree, { depth: null });
const jsonString = JSON.stringify(tree);
const buff = Buffer.from(jsonString).toString("base64")
console.log('buff', buff);
console.log('json length', jsonString.length);
console.log('base64 length', buff.length);
const zipped = zlib.deflateSync(jsonString)
console.log('zipped',  zipped);
console.log('zipped base64', zipped.toString('base64'));
console.log('zipped base64 length', zipped.toString('base64').length);



console.log('zipped length', zipped.length);

const objSmall = {kek: 'lol'}
const zippedObjSmall = zlib.deflateSync(JSON.stringify(objSmall));
console.log('zipped base64', zippedObjSmall.toString('base64'));

const obj = {kek: 'lol', lol: 'kek', len: [{ kek: 'lol', lol: 'kek'}, { kek: 'lol', lol: 'kek'}]}
const zippedObj = zlib.deflateSync(JSON.stringify(obj));
const base64 = zippedObj.toString('base64')
console.log('zipped base64', base64);


const buffer = Buffer.from(base64, 'base64');
console.log('buffer', buffer);
const unzipped = zlib.unzipSync(buffer);
console.log('unzipped', unzipped.toString());


import lzString from "lz-string";

const lzCompressedBase64 = lzString.compressToBase64(JSON.stringify(obj));
const lzCompressedUTF = lzString.compressToUTF16(JSON.stringify(obj));
const lzCompressedURI = lzString.compressToEncodedURIComponent(JSON.stringify(obj));
console.log('lzCompressedBase64', lzCompressedBase64);
console.log('lzCompressedUTF', lzCompressedUTF);
console.log('lzCompressedURI', lzCompressedURI);
console.log(lzString.decompressFromBase64(lzCompressedBase64))
console.log(lzString.decompressFromUTF16(lzCompressedUTF))

const lzTree = lzString.compressToEncodedURIComponent(JSON.stringify(tree))
console.log(`http://localhost:3000/?json=${lzTree}`);
