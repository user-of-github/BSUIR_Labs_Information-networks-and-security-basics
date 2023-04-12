import fs from 'fs'
var JavaScriptObfuscator = require('javascript-obfuscator');


const main = async () => {
    const code = await fs.promises.readFile('./installer.js', 'utf-8')
    console.log(code)

    const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, {
        compact: false,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        stringArrayShuffle: true,
        splitStrings: true,
        stringArrayThreshold: 1
    });

    console.log(obfuscatedCode)
   // await fs.promises.rm('installer-obfuscated.js')
   // await fs.promises.open('installer-obfuscated.js')
    await fs.promises.writeFile('./installer-obfuscated.js', obfuscatedCode._obfuscatedCode)
}


main()