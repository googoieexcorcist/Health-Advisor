import { useState } from "react";
import { FileSearch, Upload, AlertCircle, CheckCircle2, Activity } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface AnalysisResult {
  summary: {
    patient_info: {
      name: string;
      age: string;
      gender: string;
      date_of_report: string;
    };
    diagnosis: string[];
    key_findings: {
      finding: string;
      severity: string;
      implication: string;
    }[];
    medications: string[];
    recommendations: string;
    follow_up: string;
  };
}

const ReportAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        toast.success("File selected successfully");
      } else {
        toast.error("Please select a PDF file");
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a file first");
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/analyze_report", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze report.");
      }

      const data = await response.json();
      setAnalysis(data);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error during report analysis:", error);
      toast.error("An error occurred while analyzing the report.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary mb-6 glow">
              <FileSearch className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Report Analysis</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your medical reports for instant AI-powered analysis and insights.
            </p>
          </div>

          {/* Upload Section */}
          <Card className="glass card-elevated mb-8 animate-scale-in">
            <CardHeader>
              <CardTitle>Upload Medical Report</CardTitle>
              <CardDescription>
                Supported formats: PDF. Maximum file size: 10MB
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border/50 rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium mb-1">
                        {file ? file.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PDF (max. 10MB)
                      </p>
                    </div>
                  </div>
                </label>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isLoading || !file}
                  variant="gradient"
                  size="lg"
                  className="flex-1"
                >
                  {isLoading ? "Analyzing..." : "Analyze Report"}
                </Button>
                <Button 
                  onClick={handleReset} 
                  variant="outline"
                  size="lg"
                >
                  Reset
                </Button>
              </div>

              <Alert className="glass border-primary/30">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-sm">
                  Your reports are processed securely and are not stored on our servers.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="w-16 h-16 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin" />
            </div>
          )}

          {/* Analysis Results */}
          {!isLoading && analysis && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-center mb-6">
                Analysis Results
              </h2>
              
              {/* Summary Card */}
              <Card className="glass card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{analysis.summary.recommendations}</p>
                </CardContent>
              </Card>

              {/* Key Findings */}
              <Card className="glass card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    Key Findings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.summary.key_findings.map((finding, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                        <span className="text-secondary mt-0.5">•</span>
                        <span>{finding.finding} - <strong>{finding.severity}</strong>: {finding.implication}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Diagnosis */}
              <Card className="glass card-elevated border-destructive/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    Diagnosis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.summary.diagnosis.map((diag, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-3 p-3 rounded-lg bg-destructive/10">
                        <span className="text-destructive mt-0.5">•</span>
                        <span>{diag}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Medications and Follow up */}
              <Card className="glass card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Medications and Follow up
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.summary.medications.map((med, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{med}</span>
                      </li>
                    ))}
                  </ul>
                   <p className="text-sm text-muted-foreground">{analysis.summary.follow_up}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;