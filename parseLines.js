const fs = require('fs');

fs.readFile('./results.js', (err, data) => {
  if (err) console.log(err);
  const elements = JSON.parse(data).textAnnotations;
  elements.shift();

  let groups = {};
  let locations = elements.map(item => {
    let top = item.boundingPoly.vertices[0].y;
    let bottom = item.boundingPoly.vertices[2].y;
    let center = bottom - Math.floor((bottom - top) /2);
    return {
      description: item.description,
      center: center
    }
  });
  locations.forEach((item, index, array) => {
    let margin = item.center;
    let counter = 1;
    while (array[index + counter] && (array[index + counter].center - margin) <= 12) {
      margin = Math.floor((margin + array[index + counter].center) / 2);
      counter++;
    }

    for (let i = counter; i > index; i--) {
      if(array[index + i]) {
        array[index + i].margin = margin;
        console.log(array[index + i]);
      }
    }

    let pos = item.margin ? item.margin : margin;

    groups[pos] = groups[pos] ? groups[pos] : [];
    groups[pos].push(item.description);
  });



  console.log(groups);
})