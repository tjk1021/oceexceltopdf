var PDFDocument = require('pdfkit');
var mysave = require('save-as');
var myRequiredPDF = require('myPDF');
var xlsx = require('xlsx');

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

  // PARSE AN EXCEL FILE ///////////////////////////////////////////////////////
  module.parseExcel = function(type, data) {
    var workbook;
      if (type == 'binary') {
        workbook = xlsx.read(data, {type: 'binary'});
        if (!workbook.Sheets.Sheet1.A2.h) {
            alert('Sorry, this spreadsheet is not in the correct format.');
        } else {
          myPDF.pdfData = {
            title: workbook.Sheets.Sheet1.A2.h,
            body: workbook.Sheets.Sheet1.B2.v,
            credits: workbook.Sheets.Sheet1.C2.v,
          };
          console.log(myPDF.pdfData);
          console.log(workbook);
          myPDF.createPDF();
          // return workbook;
        }
      } else {
        if (!workbook.Sheets.Sheet1.A2.h) {
            alert('Sorry, this spreadsheet is not in the correct format.');
        } else {
        workbook = xlsx.read(data, {type: 'binary'});
        myPDF.pdfData = {
          title: workbook.Sheets.Sheet1.A2.h,
          body: workbook.Sheets.Sheet1.B2.v,
          credits: workbook.Sheets.Sheet1.C2.v
        };
        console.log(myPDF.pdfData);
        myPDF.createPDF();
        // return workbook;
      }
    }
  };

  // MAKE PARSED EXCEL JSON INTO A PDF /////////////////////////////////////////
  module.createPDF = function() {
    if (!myPDF.pdfData) {
        myPDF.pdfData = {
          title: 'TEST TITLE',
          body: 'TESTING BODY',
          credits: 123
        };
    }
    var doc = new PDFDocument();
    var blobStream = require('blob-stream');
    var stream = doc.pipe(blobStream());
    myPDF.pdfBlob = null;
    myPDF.pdfBlobURL = null;
      doc.fontSize(20)
      doc.text('The University of Massachusetts Medical School ', {
        align: 'center'
      });
      doc.moveDown();
      doc.fontSize(12)
      doc.text('certifies that ', {
        align: 'center'
      });
      doc.fontSize(20)
      doc.moveDown();
      doc.text(myPDF.pdfData.title, {
        align: 'center'
      });
      doc.moveDown();
      doc.fontSize(12)
      doc.text('Has partipated in the enduring activity titled', {
        align: 'center'
      });
      doc.fontSize(20)
      doc.moveDown();
      doc.text('TEST PROGRAM', {
        align: 'center'
      });
         doc.moveDown();
      doc.fontSize(12)
      doc.text('On 05/05/17.', {
        align: 'center'
      });
         doc.moveDown();
      doc.fontSize(12)
      doc.text('This activity was certified for '+ myPDF.pdfData.credits +' AMA PRA Category 1 Credit(s)™.', {
        align: 'center'
      });
      // doc.image('images/test.jpeg', 0, 15, {
      //   width: 300
      // }).text('Proportional to width', 0, 0);


      // end and display the document in the iframe to the right


    doc.end();
    var name = myPDF.pdfData.title;
    stream.on('finish', function() {
      myPDF.pdfBlobURL = stream.toBlobURL('application/pdf');
      myPDF.pdfBlob = stream.toBlob();
      // alert(JSON.stringify(myPDF));
      myPDF.downloadPDF(name);
      return myPDF.pdfBlob;
    });
  };

  // DOWNLOAD THE PDF //////////////////////////////////////////////////////////
  module.downloadPDF = function(name){
    if (myPDF.pdfBlob) {
      mysave.saveAs(myPDF.pdfBlob, name + 'CertificatePDF.pdf');
    } else {
      alert('NO PDF CREATED YET!');
    }
  };

  return module;

})(myPDF || {});

module.exports = myPDF;
