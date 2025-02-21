import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Simulated API call function; replace with your actual API integration
const simulateAPICall = (response, delay = 2000) =>
  new Promise((resolve) => setTimeout(() => resolve(response), delay));

const DocumentManagement = () => {
  const [loadingScan, setLoadingScan] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [loadingOCR, setLoadingOCR] = useState(false);
  const [ocrResult, setOcrResult] = useState('');

  const handleScanDocument = async () => {
    setLoadingScan(true);
    setScanResult('');
    try {
      const response = await simulateAPICall('Document scanned successfully!');
      setScanResult(response);
    } catch (error) {
      setScanResult('Error scanning document.');
    } finally {
      setLoadingScan(false);
    }
  };

  const handlePerformOCR = async () => {
    setLoadingOCR(true);
    setOcrResult('');
    try {
      const response = await simulateAPICall('OCR completed: Text extracted.');
      setOcrResult(response);
    } catch (error) {
      setOcrResult('Error performing OCR.');
    } finally {
      setLoadingOCR(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Advanced Digital Document Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">
            Use our advanced features to scan documents and perform OCR to extract text.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={handleScanDocument} disabled={loadingScan} className="flex items-center justify-center">
              {loadingScan ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Scanning...
                </div>
              ) : (
                'Scan Document'
              )}
            </Button>
            <Button variant="secondary" onClick={handlePerformOCR} disabled={loadingOCR} className="flex items-center justify-center">
              {loadingOCR ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Perform OCR'
              )}
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {scanResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-600"
              >
                {scanResult}
              </motion.div>
            )}
            {ocrResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-blue-600"
              >
                {ocrResult}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentManagement;