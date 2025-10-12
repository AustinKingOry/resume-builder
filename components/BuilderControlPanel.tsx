import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RotateCcw, Download, FileText, Layers, Zap } from "lucide-react";
import { Margins } from "@/lib/types";

interface ControlPanelProps {
  Margins: Margins;
  printMode: boolean;
  onMarginsChange: (margins: Partial<Margins>) => void;
  onPrintModeToggle: () => void;
  onReset: () => void;
  onDownloadPDF: () => void;
  isDownloading?: boolean;
}

export function ControlPanel({
  Margins,
  printMode,
  onMarginsChange,
  onPrintModeToggle,
  onReset,
  onDownloadPDF,
  isDownloading = false
}: ControlPanelProps) {
  return (
    <div className="control-panel w-80 bg-card border-r border-border overflow-y-auto h-fit" data-testid="control-panel">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">A4 Page Layout</h1>
          <p className="text-sm text-muted-foreground">Configure page margins and layout options</p>
        </div>

        {/* Page Size Info */}
        <Card className="bg-gray-100 dark:bg-gray-900">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              <span>Page Dimensions</span>
            </div>
            <div className="text-xs font-mono text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Width:</span>
                <span>210mm (794px)</span>
              </div>
              <div className="flex justify-between">
                <span>Height:</span>
                <span>297mm (1123px)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Page 1 Margins */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Page Margins (mm)
          </h3>
          
          <MarginControls 
            margins={Margins}
            onChange={onMarginsChange}
            testPrefix="page1"
          />
        </div>

        <Separator />

        {/* Layout Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Layout Options
          </h3>

          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Preview for Print</label>
            <Switch 
              checked={printMode}
              onCheckedChange={onPrintModeToggle}
              data-testid="print-mode-toggle"
            />
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Actions
          </h3>

          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={onReset}
            data-testid="button-reset"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Margins
          </Button>

          <Button 
            className="w-full" 
            onClick={onDownloadPDF}
            disabled={isDownloading}
            data-testid="button-download"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "Generating PDF..." : "Download PDF"}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface MarginControlsProps {
  margins: Margins;
  onChange: (margins: Partial<Margins>) => void;
  testPrefix: string;
}

function MarginControls({ margins, onChange, testPrefix }: MarginControlsProps) {
  return (
    <>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm text-muted-foreground">Top</label>
          <span className="text-sm font-mono text-foreground" data-testid={`${testPrefix}-top-value`}>
            {margins.top}
          </span>
        </div>
        <Slider
          value={[margins.top]}
          onValueChange={(value) => onChange({ top: value[0] })}
          min={0}
          max={40}
          step={1}
          className="w-full"
          data-testid={`${testPrefix}-top-slider`}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm text-muted-foreground">Bottom</label>
          <span className="text-sm font-mono text-foreground" data-testid={`${testPrefix}-bottom-value`}>
            {margins.bottom}
          </span>
        </div>
        <Slider
          value={[margins.bottom]}
          onValueChange={(value) => onChange({ bottom: value[0] })}
          min={0}
          max={40}
          step={1}
          className="w-full"
          data-testid={`${testPrefix}-bottom-slider`}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm text-muted-foreground">Left</label>
          <span className="text-sm font-mono text-foreground" data-testid={`${testPrefix}-left-value`}>
            {margins.left}
          </span>
        </div>
        <Slider
          value={[margins.left]}
          onValueChange={(value) => onChange({ left: value[0] })}
          min={0}
          max={40}
          step={1}
          className="w-full"
          data-testid={`${testPrefix}-left-slider`}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm text-muted-foreground">Right</label>
          <span className="text-sm font-mono text-foreground" data-testid={`${testPrefix}-right-value`}>
            {margins.right}
          </span>
        </div>
        <Slider
          value={[margins.right]}
          onValueChange={(value) => onChange({ right: value[0] })}
          min={0}
          max={40}
          step={1}
          className="w-full"
          data-testid={`${testPrefix}-right-slider`}
        />
      </div>
    </>
  );
}
