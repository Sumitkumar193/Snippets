import fs from 'fs';
import path from 'path';
import pdf from 'html-pdf';

export async function generatePdf(data) {
  try {
    // PDF options
    const options = {
      format: 'A4',
      childProcessOptions: {
        env: {
          OPENSSL_CONF: '/dev/null',
        },
      },
    };

    // Path to the HTML template
    const templatePath = path.resolve(process.cwd(), 'template.html');
    const html = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders in the HTML template with actual values
    const replaceMap = {
      __TITLE__: data.title,
      __CONTENT__: data.content,
    };

    let replacedHtml = html;
    Object.entries(replaceMap).forEach(([key, value]) => {
      const regex = new RegExp(key, 'g'); // Create a global regex
      replacedHtml = replacedHtml.replace(regex, value);
    });

    // File name and path to save the generated PDF
    const fileName = `output.pdf`;
    const savePath = path.resolve(process.cwd(), fileName);

    // Generate the PDF and save it to a file
    pdf.create(replacedHtml, options).toFile(savePath, (err, res) => {
      if (err) {
        console.error('Error generating PDF:', err);
      } else {
        console.log('PDF generated:', res);
      }
    });

    return fileName;
  } catch (error) {
    console.error('Error generating or saving PDF:', error);
    throw error;
  }
}
