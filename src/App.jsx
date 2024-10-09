import React, { useState } from 'react';
import pdfToText from 'react-pdftotext';
import './PDFParserReact.css'; // Assuming you have some CSS for styling

function PDFParserReact() {
    const [bankDetails, setBankDetails] = useState({ name: '', accountNumber: '', ifscCode: '' });
    const [fileName, setFileName] = useState('');

    const extractText = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name); // Set the file name for display
            pdfToText(file)
                .then(text => {
                    console.log('Extracted text:', text); // Debugging line
                    parseBankDetails(text);
                })
                .catch(error => {
                    console.error("Failed to extract text from PDF:", error);
                    setBankDetails({ name: 'Error extracting details', accountNumber: '', ifscCode: '' });
                });
        } else {
            console.error("No file selected");
        }
    };

    const parseBankDetails = (text) => {
        // Regular expressions to match relevant bank details
        const nameMatch = text.match(/(?:Name|Name:)\s*([^\n]+)/i);
        const accountNumberMatch = text.match(/(?:Account Number|Account No|Acc No:)\s*([0-9]+)/i);
        const ifscCodeMatch = text.match(/(?:IFSC Code|IFSC|IFSC Code:)\s*([A-Z]{4}\d{7})/i);

        // Set the bank details state
        setBankDetails({
            name: nameMatch && nameMatch[1] ? `Name: ${nameMatch[1].trim()}` : 'Not found',
            accountNumber: accountNumberMatch && accountNumberMatch[1] ? `Account Number: ${accountNumberMatch[1].trim()}` : 'Not found',
            ifscCode: ifscCodeMatch && ifscCodeMatch[1] ? `IFSC Code: ${ifscCodeMatch[1].trim()}` : 'Not found'
        });
    };

    return (
        <div className="portal">
            <header className="portal-header">
                <h1>Bank Details Extractor</h1>
                <input type="file" accept="application/pdf" onChange={extractText} />
            </header>
            <main className="portal-content">
                {fileName && <h2>Extracted from: {fileName}</h2>}
                <h2>Bank Details:</h2>
                <div className="details-display">
                    <p><strong>Name:</strong> {bankDetails.name}</p>
                    <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
                    <p><strong>IFSC Code:</strong> {bankDetails.ifscCode}</p>
                </div>
            </main>
            <footer className="portal-footer">
                <p>&copy; 2024 Your Portal Name</p>
            </footer>
        </div>
    );
}

export default PDFParserReact;

