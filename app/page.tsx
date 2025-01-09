"use client"

import { useState, useRef } from "react";
import axios from "axios";
import Script from "next/script";
import ImageKit from "imagekit-javascript";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Home() {
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState('');
  const [attachmentURL, setAttachmentURL] = useState('');
  const [amountError, setAmountError] = useState('');
  const [isProcessing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Upload file if selected
      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        
        // Create an instance of ImageKit
        const imagekit = new ImageKit({
          publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
          urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
        });

        // Get authentication parameters
        const authenticationEndpoint = "/api/imagekit-auth";
        const authParams = await fetch(authenticationEndpoint).then(res => res.json());

        // Upload the file
        const uploadResponse = await imagekit.upload({
          file: file,
          fileName: file.name,
          useUniqueFileName: true,
          ...authParams
        });

        setAttachmentURL(uploadResponse.url);
      }

      // Proceed with payment
      console.log(amount, message, attachmentURL);
      const response = await axios.post("/api/create-order", { amount, message, attachmentURL });
      const data = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(amount * 100),
        currency: 'INR',
        name: 'ARITRA DEY',
        description: 'Test Transaction',
        order_id: data.orderId,
        handler: (response: any) => {
          console.log("Payment Successful: ", response);
        },
        prefill: {
          name: 'ARITRA DEY',
          email: 'aritradey2715@gmail.com',
          contact: '8328728540'
        },
        theme: {
          color: '#F37254'
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment Failed: ", error);
    } finally {
      setProcessing(false);
    }
  };

  const validateAmount = (value: number) => {
    if (!value) {
      return 'Amount is required';
    }
    if (value < 1) {
      return 'Minimum amount is $1';
    }
    return '';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(value);
    if (value) {
      setAmountError(validateAmount(value));
    } else {
      setAmountError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateAmount(amount);
    setAmountError(error);
    
    if (!error) {
      handlePayment();
    }
  };

  const handleFileRemove = () => {
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</div>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className={`pl-8 ${amountError ? 'border-red-500 focus:ring-red-500' : ''}`}
                value={amount || ''}
                onChange={handleAmountChange}
                min="1"
                step="0.01"
                aria-invalid={!!amountError}
                aria-describedby={amountError ? "amount-error" : undefined}
              />
              {amountError && (
                <p id="amount-error" className="mt-1 text-sm text-red-500">
                  {amountError}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Add a note..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-24"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm font-medium">
              Attachment (Optional)
            </Label>
            <div className="flex items-center gap-2">
              {!fileName ? (
                <label 
                  htmlFor="file" 
                  className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm mr-3">Choose file</span>
                </label>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 border rounded-md bg-gray-50">
                  <span className="text-sm truncate max-w-[200px]">{fileName}</span>
                  <button
                    type="button"
                    onClick={handleFileRemove}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}
            </div>
            <Input
              id="file"
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
            />
          </div>

          <Button type="submit" className="w-full text-lg py-6" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

