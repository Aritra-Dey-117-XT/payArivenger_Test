"use client"

import { useState, ChangeEvent, FormEvent, DragEvent } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import axios from 'axios';
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentForm = () => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers with up to 2 decimal places
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      // Check if the value is within the valid range (0.01 to 5000)
      const numValue = parseFloat(value);
      if (!value || (numValue >= 0.01 && numValue <= 5000)) {
        setAmount(value);
      }
    }
  };

  const handleAmountBlur = () => {
    // Format the amount to always show 2 decimal places when user leaves the field
    if (amount) {
      const formattedAmount = parseFloat(amount).toFixed(2);
      setAmount(formattedAmount);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handlePayment = async () => {
    // Create order by calling the server endpoint
    const response = await axios.post('/api/create-order', {
      amount,
      message,
      imageURL: null,
    });

    const order = await response.data;

    // Open Razorpay Checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      name: 'ARITRA DEY',
      description: 'Test Transaction',
      order_id: order.orderId,
      prefill: {
        name: 'ARITRA DEY',
        email: 'aritradey2715@gmail.com',
        contact: '8328728541'
      },
      theme: {
        color: '#F37254'
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" /> {/* SCRIPT FOR RAZORPAY CHECKOUT */}
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
          <p className="text-gray-500">Please fill in the payment information below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Field */}
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount in Rupees (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="text"
                id="amount"
                required
                value={amount}
                onChange={handleAmountChange}
                onBlur={handleAmountBlur}
                className="block w-full pl-8 rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-12"
                placeholder="0.00"
                inputMode="decimal"
                min="1"
                max="5000"
              />
            </div>
            <p className="text-xs text-gray-500">Minimum: ₹1 | Maximum: ₹5000.00</p>
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message (optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={handleMessageChange}
              className="block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              rows={3}
              placeholder="  Add a message for the receiver..."
            />
          </div>

          {/* File Upload Field */}
          <div className="space-y-2">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Upload Attachments (optional)
            </label>
            <div className="relative">
              {!file ? (
                <div
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                    isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 border-dashed'
                  } rounded-md transition-colors duration-200`}
                >
                  <div className="space-y-1 text-center">
                    <Upload className={`mx-auto h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span className='text-black'>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                  <span className="text-sm text-gray-500 truncate flex-1">{file.name}</span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 rounded-full hover:bg-gray-200 text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || !amount || parseFloat(amount) < 0.01}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              handlePayment()
              setAmount('')
              setMessage('')
              setFile(null)
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;