'use strict';

const http = require('http');
const URL = require('url');

const mathJax = require('mathjax-node');
const sharp = require('sharp');

mathJax.start();

const server = http.createServer(async function (request, response) {
  const query = URL.parse(request.url, true).query;
  if (query.backgroundColor === undefined) {
    query.backgroundColor = 'white';
  }
  if (!query.tex) {
    response.statusCode(400);
    response.end();
    return;
  }
  let svg = (
    await mathJax.typeset({
      math: query.tex,
      format: 'TeX', // or "inline-TeX", "MathML"
      svg: true, // or svg:true, or html:true
    })
  ).svg;
  if (query.backgroundColor) {
    svg = svg.replace(
      'style="',
      `style="stroke-width: 0px; background-color: ${query.backgroundColor}; `,
    );
  }
  if (query.format !== 'png') {
    response.setHeader('content-type', 'image/svg+xml');
    response.write(svg);
    response.end();
  } else {
    const encoder = new TextEncoder('utf8');
    let svgBlob = encoder.encode(svg);
    const png = await sharp(svgBlob, {
      density: query.resolution ? Number(query.resolution) : 300,
    })
      .png()
      .toBuffer();
    response.setHeader('content-type', 'image/png');
    response.write(png);
    response.end();
  }
});
server.timeout = 2000;

server.listen(8080);
