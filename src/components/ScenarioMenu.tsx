import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash2, Smartphone, Printer, Pencil } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useState, useRef } from 'react';
import { PrintableMotivation } from './PrintableMotivation';
import { ScenarioFrontend } from '@/types';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation';

interface ScenarioMenuProps {
  scenario: ScenarioFrontend;
  currentIncome?: number;
  onDelete: () => void;
}

export function ScenarioMenu({ scenario, currentIncome, onDelete }: ScenarioMenuProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [saveMode, setSaveMode] = useState<'print' | 'phone'>('print');
  const printRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleDownload = async () => {
    if (!printRef.current) return;
    
    const element = printRef.current;
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      width: saveMode === 'phone' ? 1170 : undefined, // Fixed width for phone background
      height: saveMode === 'phone' ? 2532 : undefined, // iPhone 13 Pro Max dimensions
    });
    
    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = data;
    link.download = `${scenario.name}-${saveMode === 'phone' ? 'background' : 'printout'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowPreview(false);
  };

  const handlePrint = async () => {
    if (!printRef.current) return;
    
    // Create a new window with just the content
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    // Get all the styles from the current document
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          console.error(e);
          return '';
        }
      })
      .join('\n');

    // Write the content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print - ${scenario.name}</title>
          <style>
            ${styles}
            @page {
              size: letter;
              margin: 0;
            }
            body {
              margin: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          ${printRef.current.outerHTML}
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => router.push(`/scenarios/${scenario.id}/edit`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Expenses
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              setSaveMode('print');
              setShowPreview(true);
            }}
          >
            <Printer className="mr-2 h-4 w-4" />
            Generate Printout
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Scenario
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>
            {saveMode === 'phone' ? 'Save as Phone Background' : 'Save as Printout'}
          </DialogTitle>
          <div className="h-[200px] overflow-hidden relative">
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            <div className={`${saveMode === 'phone' ? 'scale-[0.08] origin-top' : ''}`}>
              <PrintableMotivation 
                scenario={scenario} 
                currentIncome={currentIncome}
                hideDownloadButton
                isPhoneBackground={saveMode === 'phone'}
              />
            </div>
          </div>
          <div className="fixed left-[-9999px]">
            <div ref={printRef} className={saveMode === 'phone' ? '' : ''}>
              <PrintableMotivation 
                scenario={scenario} 
                currentIncome={currentIncome}
                hideDownloadButton
                isPhoneBackground={saveMode === 'phone'}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            {saveMode === 'print' ? (
              <>
                <Button 
                  onClick={() => {
                    handlePrint();
                  }}
                  className="flex-1 sm:flex-none"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button 
                  onClick={handleDownload}
                  className="flex-1 sm:flex-none"
                >
                  Save as Image
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleDownload}
                className="w-full"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Save Background
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 