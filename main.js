var PDFDocument = require('pdfkit');
var mysave = require('save-as');
var myRequiredPDF = require('myPDF');
var excelParser = require('excel-parser');
var fs = require("fs");

'use strict';

var myPDF = myPDF || {
  pdfData: {
    title:'',
    body:'',
    credits:''
  },
  pdfBlob: null,
  pdfBlobURL: null
};

myPDF = (function(module){
  // public vs. private methods
  // http://stackoverflow.com/questions/2620699/why-private-methods-in-the-object-oriented

  module.parseExcel = function(file) {
    alert(123);
    excelParser.parse({
      inFile: file,
      worksheet: 1,
      skipEmpty: true,
      // searchFor: {
      //   term: ['my serach term'],
      //   type: 'loose'
      // }
    },function(err, records){
      if(err) console.error(err);
      console.log(records);
    });
  },

  module.createPDF = function(pdfData) {
    if (!pdfData) {
        myPDF.pdfData = {
          title: 'YO!',
          body: 'HEYYYYY',
          credits: 123
        };
    } else {
      myPDF.pdfData = pdfData;
    }
    var doc = new PDFDocument();
    var blobStream = require('blob-stream');
    var stream = doc.pipe(blobStream());
    myPDF.pdfBlob = null;
    myPDF.pdfBlobURL = null;
    // draw some text
    doc.fontSize(25)
       .text(myPDF.pdfData.title, 100, 80);
    // some vector graphics
    doc.save()
       .moveTo(100, 150)
       .lineTo(100, 250)
       .lineTo(200, 250)
       .fill("#FF3300");
    doc.circle(280, 200, 50)
       .fill("#6600FF");
    // an SVG path
    doc.scale(0.6)
       .translate(470, 130)
       .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
       .fill('red', 'even-odd')
       .restore();
       // and some justified text wrapped into columns
   doc.text(myPDF.pdfData.body, 100, 300)
          .font('Times-Roman', 13)
          .moveDown()
          .text(myPDF.pdfData.credits, {
            width: 412,
            align: 'justify',
            indent: 30,
            columns: 2,
            height: 300,
            ellipsis: true
          });
    // end and display the document in the iframe to the right
    doc.end();
    stream.on('finish', function() {
      myPDF.pdfBlobURL = stream.toBlobURL('application/pdf');
      myPDF.pdfBlob = stream.toBlob();
      alert(JSON.stringify(myPDF));
      return myPDF.pdfBlob;
    });
  };

  module.downloadPDF = function(){
    if (myPDF.pdfBlob) {
      mysave.saveAs(myPDF.pdfBlob, 'myPDF.pdf');
    } else {
      alert('NO PDF CREATED YET!');
    }
  };

  return module;

})(myPDF || {});

module.exports = myPDF;
