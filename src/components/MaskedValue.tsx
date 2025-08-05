import React, { useState } from "react";
import { Eye, EyeOff, Copy } from "lucide-react";
import { toast } from "react-toastify";

interface MaskedValueProps {
  /** The sensitive value to mask */
  value: string;
  /** Type of masking to apply */
  maskType?: 'partial' | 'full' | 'email';
  /** Number of characters to show at start (for partial masking) */
  showStart?: number;
  /** Number of characters to show at end (for partial masking) */
  showEnd?: number;
  /** Character to use for masking */
  maskChar?: string;
  /** Whether to show toggle visibility button */
  showToggle?: boolean;
  /** Whether to show copy button */
  showCopy?: boolean;
  /** Custom label for copy success message */
  copyLabel?: string;
  /** Additional CSS classes */
  className?: string;
}

const MaskedValue: React.FC<MaskedValueProps> = ({
  value,
  maskType = 'partial',
  showStart = 4,
  showEnd = 4,
  maskChar = '*',
  showToggle = true,
  showCopy = true,
  copyLabel = "Value",
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Masking logic
  const getMaskedValue = (val: string): string => {
    if (!val) return "";

    switch (maskType) {
      case 'full':
        return maskChar.repeat(val.length);
      
      case 'email':
        const [localPart, domain] = val.split('@');
        if (!domain) return val; // Not a valid email
        const maskedLocal = localPart.length > 2 
          ? localPart.substring(0, 2) + maskChar.repeat(localPart.length - 2)
          : maskChar.repeat(localPart.length);
        return `${maskedLocal}@${domain}`;
      
      case 'partial':
      default:
        if (val.length <= showStart + showEnd) {
          return maskChar.repeat(val.length);
        }
        const firstPart = val.substring(0, showStart);
        const lastPart = val.substring(val.length - showEnd);
        const middleMask = maskChar.repeat(val.length - showStart - showEnd);
        return `${firstPart}${middleMask}${lastPart}`;
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${copyLabel} copied to clipboard`);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error(`Failed to copy ${copyLabel.toLowerCase()}`);
    }
  };

  // Toggle visibility
  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const displayValue = isVisible ? value : getMaskedValue(value);

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <span className="font-mono text-sm select-all">
        {displayValue}
      </span>
      
      <div className="flex items-center space-x-1">
        {showToggle && (
          <button
            onClick={handleToggle}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
            title={isVisible ? 'Hide value' : 'Show value'}
            type="button"
          >
            {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
        
        {showCopy && (
          <button
            onClick={handleCopy}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
            title={`Copy ${copyLabel.toLowerCase()}`}
            type="button"
          >
            <Copy size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MaskedValue;
