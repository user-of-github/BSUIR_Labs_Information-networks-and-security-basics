const decompress = require("decompress");

async function install(input, output) {
  decompress(input, output)
  .then((files) => {
    console.log('successfully unzipped')
  })
  .catch((error) => {
    console.error('Error occured')
    console.log(error);
  });
}


async function main() {
  const input = 'app.zip'
  const output = './'
  await install(input, output)
}


main()